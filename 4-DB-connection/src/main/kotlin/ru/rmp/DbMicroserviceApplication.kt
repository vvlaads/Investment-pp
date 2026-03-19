package ru.rmp

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import ru.rmp.security.JwtProperties

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties::class)
class DbMicroserviceApplication

fun main(args: Array<String>) {
    runApplication<DbMicroserviceApplication>(*args)
}

