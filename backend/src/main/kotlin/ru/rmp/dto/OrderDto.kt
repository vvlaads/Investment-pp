package ru.rmp.dto

import java.math.BigDecimal
import java.time.Instant

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
