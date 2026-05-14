package ru.rmp.entity

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.Instant

@Entity
@Table(
    name = "price_history",
    indexes = [
        Index(name = "idx_price_history_instrument_time", columnList = "instrument_id, recorded_at")
    ]
)
data class PriceHistoryEntry(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "instrument_id", nullable = false)
    val instrumentId: Long = 0,

    @Column(nullable = false, precision = 20, scale = 4)
    val price: BigDecimal = BigDecimal.ZERO,

    @Column(name = "recorded_at", nullable = false)
    val recordedAt: Instant = Instant.now()
)
