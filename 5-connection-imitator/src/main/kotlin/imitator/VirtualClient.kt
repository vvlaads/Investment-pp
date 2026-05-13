package imitator

import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.coroutineScope
import java.math.BigDecimal
import java.math.RoundingMode
import java.util.concurrent.ThreadLocalRandom

class VirtualClient(
    private val id: Int,
    private val config: Config,
    private val api: ApiClient,
    private val metrics: Metrics,
    private val tickers: List<String>
) {
    private var token: String? = null
    private val login: String = "${config.loginPrefix}${id}_${Integer.toHexString(ThreadLocalRandom.current().nextInt())}"

    suspend fun run(durationMs: Long) = coroutineScope {
        if (!authenticate()) return@coroutineScope
        val deadline = if (durationMs <= 0) Long.MAX_VALUE else System.currentTimeMillis() + durationMs
        while (isActive && System.currentTimeMillis() < deadline) {
            performRandomAction()
            think()
        }
    }

    private suspend fun authenticate(): Boolean {
        return try {
            val resp = api.register(login, config.password)
            token = resp.token
            metrics.inc("auth.register.ok")
            true
        } catch (e: ApiException) {
            if (e.status == 400) {
                return tryLogin()
            }
            metrics.inc("auth.register.err.${e.status}")
            false
        } catch (e: Exception) {
            metrics.inc("auth.register.err.network")
            false
        }
    }

    private suspend fun tryLogin(): Boolean {
        return try {
            val resp = api.login(login, config.password)
            token = resp.token
            metrics.inc("auth.login.ok")
            true
        } catch (e: ApiException) {
            metrics.inc("auth.login.err.${e.status}")
            false
        } catch (e: Exception) {
            metrics.inc("auth.login.err.network")
            false
        }
    }

    private suspend fun performRandomAction() {
        val t = token ?: return
        val rnd = ThreadLocalRandom.current().nextDouble()
        val cfg = config
        val totalWeight = cfg.readWeight + cfg.buySellWeight + cfg.historyWeight + cfg.portfolioWeight
        val norm = rnd * totalWeight
        try {
            when {
                norm < cfg.readWeight -> {
                    val list = api.quotes(t)
                    metrics.inc("quotes.ok")
                    metrics.inc("quotes.items", list.size.toLong())
                }
                norm < cfg.readWeight + cfg.portfolioWeight -> {
                    api.portfolio(t)
                    metrics.inc("portfolio.ok")
                }
                norm < cfg.readWeight + cfg.portfolioWeight + cfg.historyWeight -> {
                    api.history(t, 20)
                    metrics.inc("history.ok")
                }
                else -> {
                    doTrade(t)
                }
            }
        } catch (e: ApiException) {
            metrics.inc("action.err.${e.status}")
        } catch (e: Exception) {
            metrics.inc("action.err.network")
        }
    }

    private suspend fun doTrade(token: String) {
        if (tickers.isEmpty()) return
        val ticker = tickers[ThreadLocalRandom.current().nextInt(tickers.size)]
        val isBuy = ThreadLocalRandom.current().nextDouble() < 0.55
        val qty = BigDecimal(ThreadLocalRandom.current().nextDouble(0.01, config.maxBuyQuantity.coerceAtLeast(0.02)))
            .setScale(2, RoundingMode.HALF_UP)
        try {
            if (isBuy) {
                api.buy(token, ticker, qty)
                metrics.inc("buy.ok")
            } else {
                api.sell(token, ticker, qty)
                metrics.inc("sell.ok")
            }
        } catch (e: ApiException) {
            metrics.inc(if (isBuy) "buy.err.${e.status}" else "sell.err.${e.status}")
        }
    }

    private suspend fun think() {
        val span = (config.maxThinkMs - config.minThinkMs).coerceAtLeast(1)
        val ms = config.minThinkMs + ThreadLocalRandom.current().nextLong(span)
        delay(ms)
    }
}
