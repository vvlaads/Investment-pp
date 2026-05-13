package ru.rmp

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling
import ru.rmp.security.JwtProperties

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties(JwtProperties::class)
class DbMicroserviceApplication

fun main(args: Array<String>) {
    runApplication<DbMicroserviceApplication>(*args)
}
