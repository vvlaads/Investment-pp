package ru.rmp.entity

import jakarta.persistence.*

@Entity
@Table(name = "instruments")
data class Instrument(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(unique = true, nullable = false)
    val ticker: String = "",

    @Column(nullable = false)
    val name: String = ""
)
