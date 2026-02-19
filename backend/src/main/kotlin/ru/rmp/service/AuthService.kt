package ru.rmp.service

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import ru.rmp.dto.AuthResponse
import ru.rmp.dto.LoginRequest
import ru.rmp.dto.RegisterRequest
import ru.rmp.entity.User
import ru.rmp.repository.UserRepository
import ru.rmp.security.JwtService

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {
    fun register(req: RegisterRequest): AuthResponse {
        if (req.login.isBlank() || req.password.isBlank())
            throw IllegalArgumentException("Логин и пароль не должны быть пустыми")
        if (userRepository.existsByLogin(req.login))
            throw IllegalArgumentException("Пользователь с таким логином уже существует")
        val user = User(
            login = req.login.trim(),
            passwordHash = passwordEncoder.encode(req.password)
        )
        val saved = userRepository.save(user)
        val token = jwtService.generateToken(saved.login, saved.id)
        return AuthResponse(token = token, login = saved.login)
    }

    fun login(req: LoginRequest): AuthResponse {
        val user = userRepository.findByLogin(req.login)
            ?: throw IllegalArgumentException("Неверный логин или пароль")
        if (!passwordEncoder.matches(req.password, user.passwordHash))
            throw IllegalArgumentException("Неверный логин или пароль")
        val token = jwtService.generateToken(user.login, user.id)
        return AuthResponse(token = token, login = user.login)
    }
}
