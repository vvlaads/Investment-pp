package ru.rmp.repository

import org.springframework.data.jpa.repository.JpaRepository
import ru.rmp.entity.Instrument

interface InstrumentRepository : JpaRepository<Instrument, Long> {
    fun findByTicker(ticker: String): Instrument?
}
