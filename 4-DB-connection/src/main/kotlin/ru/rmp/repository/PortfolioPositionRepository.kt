package ru.rmp.repository

import org.springframework.data.jpa.repository.JpaRepository
import ru.rmp.entity.PortfolioPosition

interface PortfolioPositionRepository : JpaRepository<PortfolioPosition, Long> {
    fun findAllByUserId(userId: Long): List<PortfolioPosition>
    fun findByUserIdAndInstrumentId(userId: Long, instrumentId: Long): PortfolioPosition?
}

