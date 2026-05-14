package ru.rmp.service

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ru.rmp.dto.AuthResponse
import ru.rmp.dto.LoginRequest
import ru.rmp.dto.RegisterRequest
import ru.rmp.dto.UserInfoResponse
import ru.rmp.entity.User
import ru.rmp.repository.UserRepository
import ru.rmp.security.JwtService

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {
    @Transactional
    fun register(req: RegisterRequest): AuthResponse {
        if (req.password.isBlank())
            throw IllegalArgumentException("Пароль не должен быть пустым")
        val rawLogin = (req.login ?: req.email)?.trim().orEmpty()
        if (rawLogin.isBlank())
            throw IllegalArgumentException("Нужен login или email")
        if (userRepository.existsByLogin(rawLogin))
            throw IllegalArgumentException("Пользователь с таким логином уже существует")
        req.email?.let {
            if (userRepository.existsByEmail(it))
                throw IllegalArgumentException("Пользователь с таким email уже существует")
        }
        val user = User(
            login = rawLogin,
            passwordHash = passwordEncoder.encode(req.password),
            email = req.email?.trim(),
            firstName = req.firstName?.trim(),
            surname = req.surname?.trim(),
            patronymic = req.patronymic?.trim()
        )
        val saved = userRepository.save(user)
        return buildResponse(saved)
    }

    fun login(req: LoginRequest): AuthResponse {
        val user = when {
            !req.email.isNullOrBlank() -> userRepository.findByEmail(req.email)
            !req.login.isNullOrBlank() -> userRepository.findByLogin(req.login)
            else -> null
        } ?: throw IllegalArgumentException("Неверный логин или пароль")
        if (!passwordEncoder.matches(req.password, user.passwordHash))
            throw IllegalArgumentException("Неверный логин или пароль")
        return buildResponse(user)
    }

    private fun buildResponse(user: User): AuthResponse {
        val token = jwtService.generateToken(user.login, user.id)
        return AuthResponse(
            token = token,
            user = UserInfoResponse(
                id = user.id,
                login = user.login,
                email = user.email,
                firstName = user.firstName,
                surname = user.surname,
                patronymic = user.patronymic
            )
        )
    }
}
