package connection

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.request.*
import com.fasterxml.jackson.databind.*
import io.ktor.serialization.jackson.*
import io.ktor.server.plugins.contentnegotiation.*
import io.github.damir.denis.tudor.ktor.server.rabbitmq.dsl.*
import io.github.damir.denis.tudor.ktor.server.rabbitmq.rabbitMQ
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper

fun Application.configureRouting() {
    val mapper = jacksonObjectMapper()

    routing {
        get("/") {
            call.respondText("Hello, World!")
        }
        get("/json/jackson") {
            call.respond(mapOf("hello" to "world"))
        }

        rabbitmq {
            // Wallet
            get("/wallet/balance") {
                basicPublish {
                    exchange = "investment-exchange"
                    routingKey = "wallet.balance"
                    message { "Request: getBalance" }
                }
                call.respondText("Balance request queued")
            }
            post("/wallet/deposit") {
                val request = call.receive<WalletDepositRequest>()
                basicPublish {
                    exchange = "investment-exchange"
                    routingKey = "wallet.deposit"
                    message { mapper.writeValueAsString(request) }
                }
                call.respond(mapOf("success" to true, "message" to "Депозит в очереди"))
            }
            post("/wallet/withdraw") {
                val request = call.receive<WalletWithdrawRequest>()
                basicPublish {
                    exchange = "investment-exchange"
                    routingKey = "wallet.withdraw"
                    message { mapper.writeValueAsString(request) }
                }
                call.respond(mapOf("success" to true, "message" to "Снятие в очереди"))
            }

            // Stocks
            get("/stocks/list") {
                val page = call.parameters["page"] ?: "1"
                val limit = call.parameters["limit"] ?: "20"
                basicPublish {
                    exchange = "investment-exchange"
                    routingKey = "stocks.list"
                    message { "Request: getStocks(page=$page, limit=$limit)" }
                }
                call.respondText("Stocks list request queued")
            }
            get("/stocks") {
                val ticker = call.parameters["ticker"] ?: ""
                val beginDate = call.parameters["beginDate"] ?: ""
                val endDate = call.parameters["endDate"] ?: ""
                basicPublish {
                    exchange = "investment-exchange"
                    routingKey = "stocks.info"
                    message { mapper.writeValueAsString(StockInfoRequest(ticker, beginDate, endDate)) }
                }
                call.respondText("Stock info request queued")
            }
            post("/stocks/buy") {
                val request = call.receive<StockBuyRequest>()
                basicPublish {
                    exchange = "investment-exchange"
                    routingKey = "stocks.buy"
                    message { mapper.writeValueAsString(request) }
                }
                call.respond(mapOf("status" to "success", "message" to "Покупка акций в очереди"))
            }
            post("/stocks/sell") {
                val request = call.receive<StockSellRequest>()
                basicPublish {
                    exchange = "investment-exchange"
                    routingKey = "stocks.sell"
                    message { mapper.writeValueAsString(request) }
                }
                call.respond(mapOf("status" to "success", "message" to "Продажа акций в очереди"))
            }
        }
    }
}
