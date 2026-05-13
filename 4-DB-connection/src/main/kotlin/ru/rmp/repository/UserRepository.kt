package ru.rmp.repository

import jakarta.persistence.LockModeType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Lock
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import ru.rmp.entity.User
import java.util.Optional

interface UserRepository : JpaRepository<User, Long> {
    fun findByLogin(login: String): User?
    fun existsByLogin(login: String): Boolean

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from User u where u.id = :id")
    fun findByIdForUpdate(@Param("id") id: Long): Optional<User>
}
