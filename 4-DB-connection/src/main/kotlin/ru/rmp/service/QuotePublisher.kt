package ru.rmp.service

import com.fasterxml.jackson.annotation.JsonProperty
import org.slf4j.LoggerFactory
import org.springframework.amqp.AmqpException
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.math.BigDecimal
import java.math.RoundingMode

data class QuoteMessage(
    val symbol: String,
    val bid: Double,
    val ask: Double,
    val spread: Double,
    val timestamp: Long,
    val volume: Long,
    @JsonProperty("change_percent")
    val changePercent: Double
)

@Component
class QuotePublisher(
    private val rabbitTemplate: RabbitTemplate,
    @Value("\${rabbitmq.quotes-queue:quotes-queue}") private val queueName: String,
    @Value("\${rabbitmq.publish-enabled:true}") private val publishEnabled: Boolean,
    @Value("\${market.spread-bps:25}") private val spreadBps: Long
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun publish(quotes: List<QuoteSnapshot>) {
        if (!publishEnabled || quotes.isEmpty()) return
        val payload = quotes.map { toMessage(it) }
        try {
            rabbitTemplate.convertAndSend(queueName, payload)
        } catch (e: AmqpException) {
            log.warn("Не удалось опубликовать котировки в RabbitMQ: {}", e.message)
        } catch (e: Exception) {
            log.warn("Неожиданная ошибка публикации котировок: {}", e.message)
        }
    }

    private fun toMessage(s: QuoteSnapshot): QuoteMessage {
        val half = s.price.multiply(BigDecimal(spreadBps))
            .divide(BigDecimal(20000), 4, RoundingMode.HALF_UP)
        val bid = s.price.subtract(half).max(BigDecimal("0.01"))
        val ask = s.price.add(half)
        val spread = ask.subtract(bid)
        return QuoteMessage(
            symbol = s.ticker,
            bid = bid.toDouble(),
            ask = ask.toDouble(),
            spread = spread.toDouble(),
            timestamp = s.updatedAtMs,
            volume = 0L,
            changePercent = s.changePercent
        )
    }
}

data class QuoteSnapshot(
    val ticker: String,
    val price: BigDecimal,
    val changePercent: Double,
    val updatedAtMs: Long
)
