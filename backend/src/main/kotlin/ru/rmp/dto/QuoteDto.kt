package ru.rmp.dto

import java.math.BigDecimal
import java.time.Instant

data class QuoteResponse(
    val ticker: String,
    val name: String,
    val price: BigDecimal,
    val updatedAt: Instant
)
