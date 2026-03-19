package ru.rmp.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rmp.dto.QuoteResponse
import ru.rmp.service.MarketDataService

@RestController
@RequestMapping("/api/quotes")
class QuotesController(private val marketDataService: MarketDataService) {

    @GetMapping
    fun getAllQuotes(): List<QuoteResponse> = marketDataService.getAllQuotes()

    @GetMapping("/{ticker}")
    fun getQuote(@PathVariable ticker: String): QuoteResponse =
        marketDataService.getQuote(ticker)
            ?: throw NoSuchElementException("Котировка не найдена: $ticker")
}

