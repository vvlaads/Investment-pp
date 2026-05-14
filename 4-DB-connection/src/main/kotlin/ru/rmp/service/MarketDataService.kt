package ru.rmp.service

import org.slf4j.LoggerFactory
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import ru.rmp.dto.QuoteResponse
import ru.rmp.entity.Instrument
import ru.rmp.repository.InstrumentRepository
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.Duration
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ThreadLocalRandom

@Service
class MarketDataService(
    private val instrumentRepository: InstrumentRepository,
    private val redis: StringRedisTemplate,
    private val quotePublisher: QuotePublisher
) {
    private val log = LoggerFactory.getLogger(javaClass)

    private val basePrices = ConcurrentHashMap<String, BigDecimal>()
    private val currentPrices = ConcurrentHashMap<String, BigDecimal>()
    private val lastUpdate = ConcurrentHashMap<String, Long>()

    fun getQuote(ticker: String): QuoteResponse? {
        val instrument = instrumentRepository.findByTicker(ticker) ?: return null
        val price = currentPrice(ticker)
        return QuoteResponse(
            ticker = instrument.ticker,
            name = instrument.name,
            price = price,
            updatedAt = Instant.ofEpochMilli(lastUpdate.getOrDefault(ticker, System.currentTimeMillis()))
        )
    }

    fun getAllQuotes(): List<QuoteResponse> {
        return instrumentRepository.findAll().map { inst ->
            QuoteResponse(
                ticker = inst.ticker,
                name = inst.name,
                price = currentPrice(inst.ticker),
                updatedAt = Instant.ofEpochMilli(lastUpdate.getOrDefault(inst.ticker, System.currentTimeMillis()))
            )
        }
    }

    fun currentPrice(ticker: String): BigDecimal {
        currentPrices[ticker]?.let { return it }
        readFromRedis(ticker)?.let {
            currentPrices[ticker] = it
            return it
        }
        val base = basePrices.getOrPut(ticker) { generateBasePrice(ticker) }
        currentPrices[ticker] = base
        writeToRedis(ticker, base)
        lastUpdate[ticker] = System.currentTimeMillis()
        return base
    }

    @Scheduled(fixedDelayString = "\${market.tick-ms:1000}")
    fun tick() {
        val instruments = try {
            instrumentRepository.findAll()
        } catch (e: Exception) {
            log.warn("Не удалось прочитать инструменты для тика: {}", e.message)
            return
        }
        val rnd = ThreadLocalRandom.current()
        val snapshots = ArrayList<QuoteSnapshot>(instruments.size)
        val now = System.currentTimeMillis()
        for (inst in instruments) {
            val base = basePrices.getOrPut(inst.ticker) { generateBasePrice(inst.ticker) }
            val prev = currentPrices[inst.ticker] ?: readFromRedis(inst.ticker) ?: base
            val pct = (rnd.nextDouble() - 0.5) * 0.02
            val deltaRaw = prev.multiply(BigDecimal(pct))
            var next = prev.add(deltaRaw)
            val floor = base.multiply(BigDecimal("0.5"))
            val ceil = base.multiply(BigDecimal("1.5"))
            if (next < floor) next = floor
            if (next > ceil) next = ceil
            next = next.setScale(4, RoundingMode.HALF_UP).max(BigDecimal("0.01"))
            currentPrices[inst.ticker] = next
            lastUpdate[inst.ticker] = now
            writeToRedis(inst.ticker, next)
            val changePct = if (prev.signum() == 0) 0.0
            else next.subtract(prev).divide(prev, 6, RoundingMode.HALF_UP)
                .multiply(BigDecimal(100)).toDouble()
            snapshots.add(QuoteSnapshot(inst.ticker, next, changePct, now))
        }
        if (snapshots.isNotEmpty()) {
            quotePublisher.publish(snapshots)
        }
    }

    private fun readFromRedis(ticker: String): BigDecimal? = try {
        redis.opsForValue().get(redisKey(ticker))?.let { BigDecimal(it) }
    } catch (e: Exception) {
        null
    }

    private fun writeToRedis(ticker: String, price: BigDecimal) {
        try {
            redis.opsForValue().set(redisKey(ticker), price.toPlainString(), Duration.ofMinutes(10))
        } catch (_: Exception) {
        }
    }

    private fun redisKey(ticker: String) = "quote:$ticker"

    private fun generateBasePrice(ticker: String): BigDecimal {
        val h = ticker.hashCode().and(0x7FFF)
        return BigDecimal(100 + h % 500).setScale(2, RoundingMode.HALF_UP)
    }

    fun initInstrumentsIfEmpty() {
        if (instrumentRepository.count() > 0) return
        listOf(
            Instrument(ticker = "GAZP", name = "Газпром"),
            Instrument(ticker = "SBER", name = "Сбербанк"),
            Instrument(ticker = "LKOH", name = "Лукойл"),
            Instrument(ticker = "YNDX", name = "Яндекс"),
            Instrument(ticker = "ROSN", name = "Роснефть"),
            Instrument(ticker = "GMKN", name = "ГМК Норильский никель"),
            Instrument(ticker = "NVTK", name = "Новатэк"),
            Instrument(ticker = "PLZL", name = "Полюс")
        ).forEach { instrumentRepository.save(it) }
    }
}
