package ru.rmp.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ru.rmp.dto.WalletOperationResponse
import ru.rmp.repository.UserRepository
import java.math.BigDecimal
import java.math.RoundingMode

@Service
class WalletService(
    private val userRepository: UserRepository
) {
    fun getBalance(userId: Long): BigDecimal =
        userRepository.findById(userId)
            .orElseThrow { NoSuchElementException("Пользователь не найден") }
            .balance

    @Transactional
    fun deposit(userId: Long, amount: BigDecimal): WalletOperationResponse {
        val normalized = normalize(amount)
        val user = userRepository.findByIdForUpdate(userId)
            .orElseThrow { NoSuchElementException("Пользователь не найден") }
        user.balance = user.balance.add(normalized)
        userRepository.save(user)
        return WalletOperationResponse(true, "Успешно пополнен счёт", user.balance)
    }

    @Transactional
    fun withdraw(userId: Long, amount: BigDecimal): WalletOperationResponse {
        val normalized = normalize(amount)
        val user = userRepository.findByIdForUpdate(userId)
            .orElseThrow { NoSuchElementException("Пользователь не найден") }
        if (user.balance < normalized)
            throw IllegalArgumentException("Недостаточно средств. Баланс: ${user.balance}, запрошено: $normalized")
        user.balance = user.balance.subtract(normalized)
        userRepository.save(user)
        return WalletOperationResponse(true, "Успешно списано со счёта", user.balance)
    }

    private fun normalize(amount: BigDecimal): BigDecimal {
        if (amount <= BigDecimal.ZERO)
            throw IllegalArgumentException("Сумма должна быть положительной")
        return amount.setScale(4, RoundingMode.HALF_UP)
    }
}
