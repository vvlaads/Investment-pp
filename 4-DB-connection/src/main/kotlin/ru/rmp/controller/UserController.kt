package ru.rmp.controller

import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import ru.rmp.dto.StatusResponse
import ru.rmp.dto.UpdateUserRequest
import ru.rmp.dto.UserInfoResponse
import ru.rmp.dto.UserStockResponse
import ru.rmp.service.UserService

@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {

    @GetMapping
    fun me(authentication: Authentication): UserInfoResponse =
        userService.getProfile(authentication.principal as Long)

    @PutMapping
    fun update(authentication: Authentication, @RequestBody req: UpdateUserRequest): UserInfoResponse =
        userService.updateProfile(authentication.principal as Long, req)

    @DeleteMapping
    fun delete(authentication: Authentication): StatusResponse =
        userService.deleteUser(authentication.principal as Long)

    @GetMapping("/stocks")
    fun stocks(authentication: Authentication): List<UserStockResponse> =
        userService.getUserStocks(authentication.principal as Long)
}
