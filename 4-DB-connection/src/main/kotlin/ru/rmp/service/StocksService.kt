package ru.rmp.service

import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import ru.rmp.dto.StockHistoryPoint
import ru.rmp.dto.StockInfoResponse
import ru.rmp.dto.StockListItem
import ru.rmp.dto.StockListResponse
import ru.rmp.repository.InstrumentRepository
import ru.rmp.repository.PriceHistoryRepository
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.Instant

@Service
class StocksService(
    private val instrumentRepository: InstrumentRepository,
    private val priceHistoryRepository: PriceHistoryRepository,
    private val marketDataService: MarketDataService
) {
    fun list(page: Int, limit: Int): StockListResponse {
        val safePage = page.coerceAtLeast(1)
        val safeLimit = limit.coerceIn(1, 100)
        val pageable = PageRequest.of(safePage - 1, safeLimit, Sort.by("ticker").ascending())
        val pageData = instrumentRepository.findAll(pageable)
        val items = pageData.content.map { inst ->
            val current = marketDataService.currentPrice(inst.ticker)
            val change = computeChangePercent(inst.id, current)
            StockListItem(
                ticker = inst.ticker,
                name = inst.name,
                currentPrice = current,
                changePercent = change,
                type = "stock"
            )
        }
        return StockListResponse(
            items = items,
            page = safePage,
            totalPages = pageData.totalPages.coerceAtLeast(1)
        )
    }

    fun info(ticker: String, beginDate: Instant?, endDate: Instant?): StockInfoResponse {
        val instrument = instrumentRepository.findByTicker(ticker)
            ?: throw NoSuchElementException("Инструмент не найден: $ticker")
        val to = endDate ?: Instant.now()
        val from = beginDate ?: to.minusSeconds(60 * 60 * 24L)
        val history = priceHistoryRepository.findRange(instrument.id, from, to)
            .map { StockHistoryPoint(it.recordedAt, it.price) }
        return StockInfoResponse(
            ticker = instrument.ticker,
            name = instrument.name,
            type = "stock",
            currentPrice = marketDataService.currentPrice(instrument.ticker),
            history = history
        )
    }

    private fun computeChangePercent(instrumentId: Long, current: BigDecimal): BigDecimal {
        val from = Instant.now().minusSeconds(60 * 60 * 24L)
        val to = Instant.now()
        val window = priceHistoryRepository.findRange(instrumentId, from, to)
        val open = window.firstOrNull()?.price ?: return BigDecimal.ZERO.setScale(2)
        if (open.signum() == 0) return BigDecimal.ZERO.setScale(2)
        return current.subtract(open)
            .divide(open, 6, RoundingMode.HALF_UP)
            .multiply(BigDecimal(100))
            .setScale(2, RoundingMode.HALF_UP)
    }
}
