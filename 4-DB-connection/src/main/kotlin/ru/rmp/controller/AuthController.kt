package ru.rmp.controller

import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rmp.dto.AuthResponse
import ru.rmp.dto.LoginRequest
import ru.rmp.dto.RegisterRequest
import ru.rmp.service.AuthService

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/register")
    fun register(@RequestBody req: RegisterRequest): AuthResponse =
        authService.register(req)

    @PostMapping("/login")
    fun login(@RequestBody req: LoginRequest): AuthResponse =
        authService.login(req)
}

