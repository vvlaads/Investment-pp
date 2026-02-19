package ru.rmp.controller

import org.springframework.web.bind.annotation.*
import ru.rmp.dto.QuoteResponse
import ru.rmp.service.MarketDataService

@RestController
@RequestMapping("/api/quotes")
class QuotesController(private val marketDataService: MarketDataService) {

    @GetMapping
    fun getAllQuotes(): List<QuoteResponse> =
        marketDataService.getAllQuotes()

    @GetMapping("/{ticker}")
    fun getQuote(@PathVariable ticker: String): QuoteResponse =
        marketDataService.getQuote(ticker)
            ?: throw NoSuchElementException("Котировка не найдена: $ticker")
}
