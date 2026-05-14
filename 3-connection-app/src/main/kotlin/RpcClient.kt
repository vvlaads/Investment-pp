package connection

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.rabbitmq.client.AMQP
import com.rabbitmq.client.Channel
import com.rabbitmq.client.Connection
import com.rabbitmq.client.ConnectionFactory
import com.rabbitmq.client.RpcClient
import com.rabbitmq.client.RpcClientParams
import org.slf4j.LoggerFactory
import java.io.Closeable
import java.net.URI

class GatewayRpcClient(
    rabbitUri: String,
    private val exchange: String,
    private val timeoutMs: Int
) : Closeable {
    private val log = LoggerFactory.getLogger(javaClass)
    private val mapper: ObjectMapper = jacksonObjectMapper()
    private val connection: Connection
    private val channel: Channel

    init {
        val factory = ConnectionFactory().apply {
            setUri(URI(rabbitUri))
            isAutomaticRecoveryEnabled = true
            networkRecoveryInterval = 5_000
        }
        connection = factory.newConnection("investment-gateway")
        channel = connection.createChannel()
        channel.exchangeDeclare(exchange, "direct", true)
    }

    fun call(routingKey: String, body: Any?, token: String?): RpcResult {
        val payload = when (body) {
            null -> "".toByteArray()
            is String -> body.toByteArray(Charsets.UTF_8)
            else -> mapper.writeValueAsBytes(body)
        }
        val headers = HashMap<String, Any?>()
        if (!token.isNullOrBlank()) headers["jwt"] = token
        val params = RpcClientParams()
            .channel(channel)
            .exchange(exchange)
            .routingKey(routingKey)
            .timeout(timeoutMs)
        val client = RpcClient(params)
        return try {
            val props = AMQP.BasicProperties.Builder()
                .contentType("application/json")
                .headers(headers)
                .build()
            val response = client.doCall(props, payload)
            val bytes = response.body
            val text = bytes.toString(Charsets.UTF_8)
            val parsed = if (text.isBlank()) emptyMap<String, Any?>() else mapper.readValue(text, Any::class.java)
            val status = ((parsed as? Map<*, *>)?.get("status") as? Number)?.toInt() ?: 200
            RpcResult(status, parsed)
        } catch (e: Exception) {
            log.warn("RPC {} failed: {}", routingKey, e.message)
            RpcResult(503, mapOf("error" to "Сервис недоступен", "message" to (e.message ?: "")))
        } finally {
            runCatching { client.close() }
        }
    }

    override fun close() {
        runCatching { channel.close() }
        runCatching { connection.close() }
    }
}

data class RpcResult(val status: Int, val payload: Any?)
