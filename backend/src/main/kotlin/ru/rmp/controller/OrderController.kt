package ru.rmp.controller

import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import ru.rmp.dto.OrderRequest
import ru.rmp.dto.OrderResponse
import ru.rmp.service.OrderService

@RestController
@RequestMapping("/api/orders")
class OrderController(private val orderService: OrderService) {

    @PostMapping("/buy")
    fun buy(authentication: Authentication, @RequestBody req: OrderRequest): OrderResponse {
        val userId = authentication.principal as Long
        return orderService.buy(userId, req)
    }

    @PostMapping("/sell")
    fun sell(authentication: Authentication, @RequestBody req: OrderRequest): OrderResponse {
        val userId = authentication.principal as Long
        return orderService.sell(userId, req)
    }

    @GetMapping("/history")
    fun history(
        authentication: Authentication,
        @RequestParam(defaultValue = "50") limit: Int
    ): List<OrderResponse> {
        val userId = authentication.principal as Long
        return orderService.getHistory(userId, limit)
    }
}
