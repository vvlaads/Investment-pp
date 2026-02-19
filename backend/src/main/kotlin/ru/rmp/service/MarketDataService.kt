package ru.rmp.service

import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import ru.rmp.dto.QuoteResponse
import ru.rmp.entity.Instrument
import ru.rmp.repository.InstrumentRepository
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap

@Service
class MarketDataService(
    private val instrumentRepository: InstrumentRepository,
    private val redis: StringRedisTemplate
) {
    private val basePrices = ConcurrentHashMap<String, BigDecimal>()
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
        try {
            val cached = redis.opsForValue().get("quote:$ticker")
            if (cached != null) return BigDecimal(cached)
        } catch (_: Exception) { }
        val base = basePrices.getOrPut(ticker) { generateBasePrice(ticker) }
        val seed = (ticker.hashCode() + System.currentTimeMillis() / 60_000) % 1000
        val delta = base.multiply(BigDecimal(seed - 500)).divide(BigDecimal(10000), 4, RoundingMode.HALF_UP)
        val price = (base + delta).max(BigDecimal("0.01"))
        try {
            redis.opsForValue().set("quote:$ticker", price.toPlainString())
        } catch (_: Exception) { }
        lastUpdate[ticker] = System.currentTimeMillis()
        return price
    }

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
