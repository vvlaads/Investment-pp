package ru.rmp.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import ru.rmp.dto.HealthResponse
import java.time.Instant

@RestController
class HealthController {

    @GetMapping("/health", "/api/health")
    fun health(): HealthResponse =
        HealthResponse(status = "UP", service = "investments-db-service", timestamp = Instant.now())
}
