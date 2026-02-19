package ru.rmp

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import ru.rmp.security.JwtProperties

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties::class)
class InvestmentsApplication

fun main(args: Array<String>) {
    runApplication<InvestmentsApplication>(*args)
}
