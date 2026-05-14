package ru.rmp.controller

import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.rmp.dto.WalletAmountRequest
import ru.rmp.dto.WalletOperationResponse
import ru.rmp.service.WalletService
import java.math.BigDecimal

@RestController
@RequestMapping("/api/wallet")
class WalletController(private val walletService: WalletService) {

    @GetMapping("/balance")
    fun balance(authentication: Authentication): BigDecimal =
        walletService.getBalance(authentication.principal as Long)

    @PostMapping("/deposit")
    fun deposit(authentication: Authentication, @RequestBody req: WalletAmountRequest): WalletOperationResponse =
        walletService.deposit(authentication.principal as Long, req.amount)

    @PostMapping("/withdraw")
    fun withdraw(authentication: Authentication, @RequestBody req: WalletAmountRequest): WalletOperationResponse =
        walletService.withdraw(authentication.principal as Long, req.amount)
}
