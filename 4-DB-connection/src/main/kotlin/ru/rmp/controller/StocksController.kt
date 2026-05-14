package ru.rmp.controller

import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import ru.rmp.dto.OrderRequest
import ru.rmp.dto.OrderResponse
import ru.rmp.dto.StockInfoResponse
import ru.rmp.dto.StockListResponse
import ru.rmp.dto.StockTradeRequest
import ru.rmp.service.OrderService
import ru.rmp.service.StocksService
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

@RestController
@RequestMapping("/api/stocks")
class StocksController(
    private val stocksService: StocksService,
    private val orderService: OrderService
) {

    @GetMapping("/list")
    fun list(
        @RequestParam(defaultValue = "1") page: Int,
        @RequestParam(defaultValue = "20") limit: Int
    ): StockListResponse = stocksService.list(page, limit)

    @GetMapping
    fun info(
        @RequestParam ticker: String,
        @RequestParam(required = false) beginDate: String?,
        @RequestParam(required = false) endDate: String?
    ): StockInfoResponse = stocksService.info(
        ticker = ticker,
        beginDate = parseInstant(beginDate),
        endDate = parseInstant(endDate)
    )

    @PostMapping("/buy")
    fun buy(authentication: Authentication, @RequestBody req: StockTradeRequest): OrderResponse =
        orderService.buy(authentication.principal as Long, OrderRequest(req.ticker, req.quantity))

    @PostMapping("/sell")
    fun sell(authentication: Authentication, @RequestBody req: StockTradeRequest): OrderResponse =
        orderService.sell(authentication.principal as Long, OrderRequest(req.ticker, req.quantity))

    private fun parseInstant(raw: String?): Instant? {
        if (raw.isNullOrBlank()) return null
        return try {
            Instant.parse(raw)
        } catch (_: DateTimeParseException) {
            try {
                LocalDate.parse(raw, DateTimeFormatter.ISO_LOCAL_DATE)
                    .atStartOfDay().toInstant(ZoneOffset.UTC)
            } catch (_: DateTimeParseException) {
                null
            }
        }
    }
}
