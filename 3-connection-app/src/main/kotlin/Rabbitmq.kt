package connection

import io.ktor.server.application.*

/**
 * Раньше здесь декларировались очереди через ktor-rabbitmq DSL.
 * Сейчас вся работа с RabbitMQ идёт через [GatewayRpcClient] в [configureRouting].
 * Модуль оставлен пустым для совместимости со списком модулей в application.yaml.
 */
fun Application.configureRabbitmq() {
    // no-op
}
