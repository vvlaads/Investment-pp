package ru.rmp.config

import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import ru.rmp.service.MarketDataService

@Component
class DataInitializer(private val marketDataService: MarketDataService) : CommandLineRunner {

    override fun run(vararg args: String?) {
        marketDataService.initInstrumentsIfEmpty()
    }
}
