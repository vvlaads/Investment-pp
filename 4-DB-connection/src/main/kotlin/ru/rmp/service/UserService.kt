package ru.rmp.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ru.rmp.dto.StatusResponse
import ru.rmp.dto.UpdateUserRequest
import ru.rmp.dto.UserInfoResponse
import ru.rmp.dto.UserStockResponse
import ru.rmp.repository.PortfolioPositionRepository
import ru.rmp.repository.UserRepository

@Service
class UserService(
    private val userRepository: UserRepository,
    private val portfolioPositionRepository: PortfolioPositionRepository,
    private val marketDataService: MarketDataService
) {
    fun getProfile(userId: Long): UserInfoResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { NoSuchElementException("Пользователь не найден") }
        return UserInfoResponse(
            id = user.id,
            login = user.login,
            email = user.email,
            firstName = user.firstName,
            surname = user.surname,
            patronymic = user.patronymic
        )
    }

    @Transactional
    fun updateProfile(userId: Long, req: UpdateUserRequest): UserInfoResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { NoSuchElementException("Пользователь не найден") }
        req.email?.let {
            val trimmed = it.trim()
            if (trimmed != user.email && userRepository.existsByEmail(trimmed))
                throw IllegalArgumentException("Email уже используется")
            user.email = trimmed
        }
        req.firstName?.let { user.firstName = it.trim() }
        req.surname?.let { user.surname = it.trim() }
        req.patronymic?.let { user.patronymic = it.trim() }
        userRepository.save(user)
        return UserInfoResponse(
            id = user.id,
            login = user.login,
            email = user.email,
            firstName = user.firstName,
            surname = user.surname,
            patronymic = user.patronymic
        )
    }

    @Transactional
    fun deleteUser(userId: Long): StatusResponse {
        if (!userRepository.existsById(userId))
            throw NoSuchElementException("Пользователь не найден")
        userRepository.deleteById(userId)
        return StatusResponse(status = "success", message = "Пользователь успешно удалён")
    }

    fun getUserStocks(userId: Long): List<UserStockResponse> {
        val positions = portfolioPositionRepository.findAllByUserId(userId)
        return positions.map { pos ->
            val inst = pos.instrument!!
            UserStockResponse(
                ticker = inst.ticker,
                name = inst.name,
                quantity = pos.quantity,
                avgPurchasePrice = pos.avgPrice,
                currentPrice = marketDataService.currentPrice(inst.ticker),
                type = "stock"
            )
        }
    }
}
