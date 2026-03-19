package ru.rmp.dto

import java.math.BigDecimal
import java.time.Instant

data class RegisterRequest(val login: String, val password: String)
data class LoginRequest(val login: String, val password: String)
data class AuthResponse(val token: String, val login: String)

data class OrderRequest(val ticker: String, val quantity: BigDecimal)
data class OrderResponse(
    val id: Long,
    val ticker: String,
    val type: String,
    val quantity: BigDecimal,
    val price: BigDecimal,
    val status: String,
    val createdAt: Instant
)

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

data class QuoteResponse(
    val ticker: String,
    val name: String,
    val price: BigDecimal,
    val updatedAt: Instant
)

