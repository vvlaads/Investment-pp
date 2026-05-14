package connection

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    val rabbitUri = environment.config.propertyOrNull("rabbitmq.uri")?.getString()
        ?: "amqp://admin:admin@localhost:5672"
    val exchange = environment.config.propertyOrNull("rabbitmq.exchange")?.getString()
        ?: "investment-exchange"
    val timeoutMs = environment.config.propertyOrNull("rabbitmq.rpcTimeoutMs")?.getString()?.toIntOrNull() ?: 10_000

    val rpc = GatewayRpcClient(rabbitUri, exchange, timeoutMs)
    val mapper = jacksonObjectMapper()

    monitor.subscribe(ApplicationStopped) { rpc.close() }

    routing {
        get("/") {
            call.respondText("Investment Gateway is running")
        }

        get("/health") {
            call.respond(mapOf("status" to "ok", "service" to "gateway"))
        }

        // Авторизация (без JWT)
        post("/auth/login") {
            val body = call.receiveText()
            val result = rpc.call("auth.login", parseJson(mapper, body), token = null)
            respond(call, result)
        }
        post("/auth/sign-in") {
            val body = call.receiveText()
            val result = rpc.call("auth.register", parseJson(mapper, body), token = null)
            respond(call, result)
        }
        post("/auth/register") {
            val body = call.receiveText()
            val result = rpc.call("auth.register", parseJson(mapper, body), token = null)
            respond(call, result)
        }

        // Wallet
        get("/wallet/balance") {
            val token = bearerToken(call)
            val result = rpc.call("wallet.balance", null, token)
            respond(call, result)
        }
        post("/wallet/deposit") {
            val token = bearerToken(call)
            val body = call.receiveText()
            val result = rpc.call("wallet.deposit", parseJson(mapper, body), token)
            respond(call, result)
        }
        post("/wallet/withdraw") {
            val token = bearerToken(call)
            val body = call.receiveText()
            val result = rpc.call("wallet.withdraw", parseJson(mapper, body), token)
            respond(call, result)
        }

        // Stocks
        get("/stocks/list") {
            val page = call.parameters["page"]?.toIntOrNull() ?: 1
            val limit = call.parameters["limit"]?.toIntOrNull() ?: 20
            val token = bearerToken(call)
            val result = rpc.call("stocks.list", mapOf("page" to page, "limit" to limit), token)
            respond(call, result)
        }
        get("/stocks") {
            val ticker = call.parameters["ticker"] ?: ""
            val beginDate = call.parameters["beginDate"]
            val endDate = call.parameters["endDate"]
            val token = bearerToken(call)
            val result = rpc.call(
                "stocks.info",
                mapOf("ticker" to ticker, "beginDate" to beginDate, "endDate" to endDate),
                token
            )
            respond(call, result)
        }
        post("/stocks/buy") {
            val token = bearerToken(call)
            val body = call.receiveText()
            val result = rpc.call("stocks.buy", parseJson(mapper, body), token)
            respond(call, result)
        }
        post("/stocks/sell") {
            val token = bearerToken(call)
            val body = call.receiveText()
            val result = rpc.call("stocks.sell", parseJson(mapper, body), token)
            respond(call, result)
        }

        // Users
        get("/users") {
            val token = bearerToken(call)
            val result = rpc.call("users.get", null, token)
            respond(call, result)
        }
        put("/users") {
            val token = bearerToken(call)
            val body = call.receiveText()
            val result = rpc.call("users.update", parseJson(mapper, body), token)
            respond(call, result)
        }
        delete("/users") {
            val token = bearerToken(call)
            val result = rpc.call("users.delete", null, token)
            respond(call, result)
        }
        get("/users/stocks") {
            val token = bearerToken(call)
            val result = rpc.call("users.stocks", null, token)
            respond(call, result)
        }
    }
}

private fun bearerToken(call: ApplicationCall): String? {
    val header = call.request.headers[HttpHeaders.Authorization] ?: return null
    return if (header.startsWith("Bearer ", ignoreCase = true)) header.substring(7) else header
}

private fun parseJson(mapper: com.fasterxml.jackson.databind.ObjectMapper, body: String): Any? {
    if (body.isBlank()) return null
    return mapper.readValue(body, Any::class.java)
}

private suspend fun respond(call: ApplicationCall, result: RpcResult) {
    val status = HttpStatusCode.fromValue(result.status.coerceIn(100, 599))
    val payload = result.payload ?: emptyMap<String, Any?>()
    call.respond(status, payload)
}
