package ru.rmp.entity

import jakarta.persistence.*
import java.math.BigDecimal

@Entity
@Table(name = "portfolio_positions", uniqueConstraints = [
    UniqueConstraint(columnNames = ["user_id", "instrument_id"])
])
data class PortfolioPosition(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var user: User? = null,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "instrument_id", nullable = false)
    var instrument: Instrument? = null,

    @Column(nullable = false, precision = 20, scale = 6)
    var quantity: BigDecimal = BigDecimal.ZERO
)
