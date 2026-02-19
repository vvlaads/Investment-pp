package ru.rmp.dto

import java.math.BigDecimal

data class PortfolioPositionResponse(
    val ticker: String,
    val name: String,
    val quantity: BigDecimal,
    val currentPrice: BigDecimal,
    val totalValue: BigDecimal
)

data class PortfolioResponse(
    val balance: BigDecimal,
    val positions: List<PortfolioPositionResponse>,
    val totalAssets: BigDecimal
)
