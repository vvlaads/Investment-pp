package ru.rmp.service

import org.springframework.stereotype.Service
import ru.rmp.dto.PortfolioPositionResponse
import ru.rmp.dto.PortfolioResponse
import ru.rmp.repository.PortfolioPositionRepository
import ru.rmp.repository.UserRepository
import java.math.BigDecimal

@Service
class PortfolioService(
    private val userRepository: UserRepository,
    private val portfolioPositionRepository: PortfolioPositionRepository,
    private val marketDataService: MarketDataService
) {
    fun getPortfolio(userId: Long): PortfolioResponse {
        val user = userRepository.findById(userId).orElseThrow { NoSuchElementException("User not found") }
        val positions = portfolioPositionRepository.findAllByUserId(userId)
        val positionResponses = positions.map { pos ->
            val inst = pos.instrument!!
            val price = marketDataService.currentPrice(inst.ticker)
            val total = pos.quantity.multiply(price)
            PortfolioPositionResponse(
                ticker = inst.ticker,
                name = inst.name,
                quantity = pos.quantity,
                currentPrice = price,
                totalValue = total
            )
        }
        val totalAssets = positionResponses.fold(BigDecimal.ZERO) { acc, p -> acc.add(p.totalValue) }
        return PortfolioResponse(
            balance = user.balance,
            positions = positionResponses,
            totalAssets = totalAssets.add(user.balance)
        )
    }
}
