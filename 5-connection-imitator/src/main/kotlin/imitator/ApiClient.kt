package imitator

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.jackson.*
import java.math.BigDecimal

@JsonIgnoreProperties(ignoreUnknown = true)
data class AuthResponse(val token: String = "", val login: String = "")

@JsonIgnoreProperties(ignoreUnknown = true)
data class QuoteDto(val ticker: String = "", val name: String = "", val price: BigDecimal = BigDecimal.ZERO)

@JsonIgnoreProperties(ignoreUnknown = true)
data class PositionDto(
    val ticker: String = "",
    val quantity: BigDecimal = BigDecimal.ZERO,
    val currentPrice: BigDecimal = BigDecimal.ZERO,
    val totalValue: BigDecimal = BigDecimal.ZERO
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class PortfolioDto(
    val balance: BigDecimal = BigDecimal.ZERO,
    val positions: List<PositionDto> = emptyList(),
    val totalAssets: BigDecimal = BigDecimal.ZERO
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class OrderDto(
    val id: Long = 0,
    val ticker: String = "",
    val type: String = "",
    val quantity: BigDecimal = BigDecimal.ZERO,
    val price: BigDecimal = BigDecimal.ZERO,
    val status: String = ""
)

data class AuthRequest(val login: String, val password: String)
data class TradeRequest(val ticker: String, val quantity: BigDecimal)

class ApiException(val status: Int, val payload: String) : RuntimeException("HTTP $status: $payload")

class ApiClient(private val baseUrl: String, requestTimeoutMs: Long, httpConcurrency: Int) {
    private val http = HttpClient(CIO) {
        engine {
            requestTimeout = requestTimeoutMs
            maxConnectionsCount = httpConcurrency
            endpoint {
                maxConnectionsPerRoute = httpConcurrency
                pipelineMaxSize = 32
                keepAliveTime = 30_000
                connectTimeout = requestTimeoutMs
                connectAttempts = 1
            }
        }
        install(HttpTimeout) {
            requestTimeoutMillis = requestTimeoutMs
            connectTimeoutMillis = requestTimeoutMs
            socketTimeoutMillis = requestTimeoutMs
        }
        install(ContentNegotiation) {
            jackson {
                registerKotlinModule()
                registerModule(JavaTimeModule())
                disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            }
        }
        expectSuccess = false
    }

    suspend fun register(login: String, password: String): AuthResponse =
        post("/api/auth/register", AuthRequest(login, password))

    suspend fun login(login: String, password: String): AuthResponse =
        post("/api/auth/login", AuthRequest(login, password))

    suspend fun quotes(token: String? = null): List<QuoteDto> =
        get("/api/quotes", token)

    suspend fun portfolio(token: String): PortfolioDto =
        get("/api/portfolio", token)

    suspend fun history(token: String, limit: Int = 20): List<OrderDto> =
        get("/api/orders/history?limit=$limit", token)

    suspend fun buy(token: String, ticker: String, qty: BigDecimal): OrderDto =
        post("/api/orders/buy", TradeRequest(ticker, qty), token)

    suspend fun sell(token: String, ticker: String, qty: BigDecimal): OrderDto =
        post("/api/orders/sell", TradeRequest(ticker, qty), token)

    private suspend inline fun <reified T> get(path: String, token: String? = null): T {
        val resp = http.get(baseUrl + path) {
            token?.let { header(HttpHeaders.Authorization, "Bearer $it") }
        }
        return ensureOk(resp).body()
    }

    private suspend inline fun <reified T> post(path: String, body: Any, token: String? = null): T {
        val resp = http.post(baseUrl + path) {
            contentType(ContentType.Application.Json)
            token?.let { header(HttpHeaders.Authorization, "Bearer $it") }
            setBody(body)
        }
        return ensureOk(resp).body()
    }

    private suspend fun ensureOk(resp: HttpResponse): HttpResponse {
        if (!resp.status.isSuccess()) {
            val text = runCatching { resp.bodyAsText() }.getOrDefault("")
            throw ApiException(resp.status.value, text.take(500))
        }
        return resp
    }

    fun close() = http.close()
}
