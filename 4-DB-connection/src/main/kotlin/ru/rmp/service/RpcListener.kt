package ru.rmp.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.slf4j.LoggerFactory
import org.springframework.amqp.core.Message
import org.springframework.amqp.core.MessageBuilder
import org.springframework.amqp.core.MessageProperties
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import ru.rmp.dto.LoginRequest
import ru.rmp.dto.OrderRequest
import ru.rmp.dto.RegisterRequest
import ru.rmp.dto.StockTradeRequest
import ru.rmp.dto.UpdateUserRequest
import ru.rmp.dto.WalletAmountRequest
import ru.rmp.security.JwtService

@Component
class RpcListener(
    private val authService: AuthService,
    private val userService: UserService,
    private val walletService: WalletService,
    private val orderService: OrderService,
    private val stocksService: StocksService,
    private val jwtService: JwtService,
    private val rabbitTemplate: RabbitTemplate,
    @Qualifier("amqpObjectMapper") private val objectMapper: ObjectMapper
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @RabbitListener(queues = ["\${rabbitmq.investment-queue:investment-queue}"])
    fun onMessage(message: Message) {
        val props = message.messageProperties
        val routingKey = props.receivedRoutingKey
        val replyTo = props.replyTo
        val correlationId = props.correlationId
        val token = (props.headers["jwt"] as? String) ?: (props.headers["Authorization"] as? String)?.removePrefix("Bearer ")
        val body = String(message.body, Charsets.UTF_8)

        val result: Any = try {
            handle(routingKey, body, token)
        } catch (e: IllegalArgumentException) {
            mapOf("error" to (e.message ?: "Bad request"), "status" to 400)
        } catch (e: NoSuchElementException) {
            mapOf("error" to (e.message ?: "Not found"), "status" to 404)
        } catch (e: Exception) {
            log.error("Ошибка RPC ${routingKey}: ${e.message}", e)
            mapOf("error" to "Internal Server Error", "message" to (e.message ?: ""), "status" to 500)
        }

        if (replyTo.isNullOrBlank()) {
            log.debug("Сообщение без reply-to, ответ отброшен ({})", routingKey)
            return
        }
        val payload = objectMapper.writeValueAsBytes(result)
        val reply = MessageBuilder
            .withBody(payload)
            .setContentType(MessageProperties.CONTENT_TYPE_JSON)
            .setCorrelationId(correlationId)
            .build()
        rabbitTemplate.send("", replyTo, reply)
    }

    private fun handle(routingKey: String?, body: String, token: String?): Any = when (routingKey) {
        "wallet.balance" -> mapOf("balance" to walletService.getBalance(requireUserId(token)))
        "wallet.deposit" -> walletService.deposit(requireUserId(token), parse<WalletAmountRequest>(body).amount)
        "wallet.withdraw" -> walletService.withdraw(requireUserId(token), parse<WalletAmountRequest>(body).amount)

        "stocks.list" -> {
            val (page, limit) = parsePageLimit(body)
            stocksService.list(page, limit)
        }
        "stocks.info" -> {
            val req = parse<StockInfoRpc>(body)
            stocksService.info(
                ticker = req.ticker,
                beginDate = req.beginDate?.let { runCatching { java.time.Instant.parse(it) }.getOrNull() },
                endDate = req.endDate?.let { runCatching { java.time.Instant.parse(it) }.getOrNull() }
            )
        }
        "stocks.buy" -> {
            val req = parse<StockTradeRequest>(body)
            orderService.buy(requireUserId(token), OrderRequest(req.ticker, req.quantity))
        }
        "stocks.sell" -> {
            val req = parse<StockTradeRequest>(body)
            orderService.sell(requireUserId(token), OrderRequest(req.ticker, req.quantity))
        }

        "users.get" -> userService.getProfile(requireUserId(token))
        "users.update" -> userService.updateProfile(requireUserId(token), parse<UpdateUserRequest>(body))
        "users.delete" -> userService.deleteUser(requireUserId(token))
        "users.stocks" -> userService.getUserStocks(requireUserId(token))

        "auth.register" -> authService.register(parse<RegisterRequest>(body))
        "auth.login" -> authService.login(parse<LoginRequest>(body))

        else -> throw IllegalArgumentException("Неизвестный routing key: $routingKey")
    }

    private inline fun <reified T> parse(body: String): T {
        if (body.isBlank()) throw IllegalArgumentException("Пустое тело запроса")
        return objectMapper.readValue(body)
    }

    private fun parsePageLimit(body: String): Pair<Int, Int> {
        if (body.isBlank()) return 1 to 20
        return try {
            val node = objectMapper.readTree(body)
            val page = node.path("page").asInt(1)
            val limit = node.path("limit").asInt(20)
            page to limit
        } catch (_: Exception) {
            1 to 20
        }
    }

    private fun requireUserId(token: String?): Long {
        if (token.isNullOrBlank()) throw IllegalArgumentException("Отсутствует JWT в заголовках сообщения")
        return jwtService.getUserIdFromToken(token)
            ?: throw IllegalArgumentException("Недействительный JWT")
    }

    data class StockInfoRpc(
        val ticker: String = "",
        val beginDate: String? = null,
        val endDate: String? = null
    )
}
