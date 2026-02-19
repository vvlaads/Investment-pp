package ru.rmp.entity

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.Instant

enum class OrderType { BUY, SELL }

enum class OrderStatus { EXECUTED, REJECTED }

@Entity
@Table(name = "orders")
data class Order(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var user: User? = null,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "instrument_id", nullable = false)
    var instrument: Instrument? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var type: OrderType = OrderType.BUY,

    @Column(nullable = false, precision = 20, scale = 6)
    var quantity: BigDecimal = BigDecimal.ZERO,

    @Column(nullable = false, precision = 20, scale = 4)
    var price: BigDecimal = BigDecimal.ZERO,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: OrderStatus = OrderStatus.EXECUTED,

    @Column(nullable = false)
    var createdAt: Instant = Instant.now()
)
