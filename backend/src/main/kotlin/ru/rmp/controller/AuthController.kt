package ru.rmp.controller

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
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
