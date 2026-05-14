package ru.rmp.dto

import java.math.BigDecimal
import java.time.Instant

data class RegisterRequest(
    val login: String? = null,
    val email: String? = null,
    val password: String = "",
    val firstName: String? = null,
    val surname: String? = null,
    val patronymic: String? = null
)

data class LoginRequest(
    val login: String? = null,
    val email: String? = null,
    val password: String = ""
)

data class UserInfoResponse(
    val id: Long,
    val login: String,
    val email: String?,
    val firstName: String?,
    val surname: String?,
    val patronymic: String?
)

data class UpdateUserRequest(
    val email: String? = null,
    val firstName: String? = null,
    val surname: String? = null,
    val patronymic: String? = null
)

data class AuthResponse(
    val token: String,
    val user: UserInfoResponse
)

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

data class InstrumentResponse(
    val ticker: String,
    val name: String
)

data class HealthResponse(
    val status: String,
    val service: String,
    val timestamp: Instant
)

data class StockListItem(
    val ticker: String,
    val name: String,
    val currentPrice: BigDecimal,
    val changePercent: BigDecimal,
    val type: String
)

data class StockListResponse(
    val items: List<StockListItem>,
    val page: Int,
    val totalPages: Int
)

data class StockHistoryPoint(
    val date: Instant,
    val price: BigDecimal
)

data class StockInfoResponse(
    val ticker: String,
    val name: String,
    val type: String,
    val currentPrice: BigDecimal,
    val history: List<StockHistoryPoint>
)

data class UserStockResponse(
    val ticker: String,
    val name: String,
    val quantity: BigDecimal,
    val avgPurchasePrice: BigDecimal,
    val currentPrice: BigDecimal,
    val type: String
)

data class StockTradeRequest(
    val ticker: String,
    val quantity: BigDecimal
)

data class WalletAmountRequest(
    val amount: BigDecimal
)

data class WalletOperationResponse(
    val success: Boolean,
    val message: String,
    val balance: BigDecimal
)

data class StatusResponse(
    val status: String,
    val message: String
)
