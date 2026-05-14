package ru.rmp.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import ru.rmp.entity.PriceHistoryEntry
import java.time.Instant

interface PriceHistoryRepository : JpaRepository<PriceHistoryEntry, Long> {
    @Query(
        """
        select p from PriceHistoryEntry p
        where p.instrumentId = :instrumentId
          and p.recordedAt between :from and :to
        order by p.recordedAt asc
        """
    )
    fun findRange(
        @Param("instrumentId") instrumentId: Long,
        @Param("from") from: Instant,
        @Param("to") to: Instant
    ): List<PriceHistoryEntry>
}
