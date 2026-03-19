package ru.rmp.controller

import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rmp.dto.PortfolioResponse
import ru.rmp.service.PortfolioService

@RestController
@RequestMapping("/api/portfolio")
class PortfolioController(private val portfolioService: PortfolioService) {

    @GetMapping
    fun getPortfolio(authentication: Authentication): PortfolioResponse {
        val userId = authentication.principal as Long
        return portfolioService.getPortfolio(userId)
    }
}

