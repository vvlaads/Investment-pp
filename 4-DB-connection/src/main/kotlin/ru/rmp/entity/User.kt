package ru.rmp.entity

import jakarta.persistence.*
import java.math.BigDecimal

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(unique = true, nullable = false)
    var login: String = "",

    @Column(nullable = false)
    var passwordHash: String = "",

    @Column(nullable = false)
    var balance: BigDecimal = BigDecimal("100000.00"),

    @Column(unique = true)
    var email: String? = null,

    @Column(name = "first_name")
    var firstName: String? = null,

    @Column(name = "surname")
    var surname: String? = null,

    @Column(name = "patronymic")
    var patronymic: String? = null,

    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
    val positions: MutableList<PortfolioPosition> = mutableListOf(),

    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
    val orders: MutableList<Order> = mutableListOf()
)
