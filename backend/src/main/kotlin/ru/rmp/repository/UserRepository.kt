package ru.rmp.repository

import org.springframework.data.jpa.repository.JpaRepository
import ru.rmp.entity.User

interface UserRepository : JpaRepository<User, Long> {
    fun findByLogin(login: String): User?
    fun existsByLogin(login: String): Boolean
}
