package connection

import io.ktor.server.application.*

/**
 * JWT-схема намеренно не настроена. Шлюз не валидирует токены — он только
 * пробрасывает заголовок Authorization в RabbitMQ-сообщения, а валидацию делает
 * db-service в RpcListener (там есть актуальный secret и единая логика).
 */
fun Application.configureSecurity() {
    // no-op
}
