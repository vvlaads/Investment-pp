package imitator

import kotlinx.coroutines.*
import org.slf4j.LoggerFactory
import kotlin.system.exitProcess

private val log = LoggerFactory.getLogger("imitator.Main")

fun main() {
    val config = Config.fromEnv()
    log.info(
        "Старт имитатора: baseUrl={}, clients={}, rampUp={}s, duration={}s",
        config.baseUrl, config.clients, config.rampUpSeconds,
        if (config.durationSeconds <= 0) "∞" else config.durationSeconds.toString()
    )

    val api = ApiClient(config.baseUrl, config.requestTimeoutMs, config.httpConcurrency)
    val metrics = Metrics()

    val tickers = waitForTickers(api)
    if (tickers.isEmpty()) {
        log.error("Не удалось получить список инструментов с {}. Выход.", config.baseUrl)
        api.close()
        exitProcess(2)
    }
    log.info("Инструменты загружены: {}", tickers)

    val supervisor = SupervisorJob()
    val scope = CoroutineScope(Dispatchers.Default + supervisor)

    Runtime.getRuntime().addShutdownHook(Thread {
        log.info("Останавливаю имитатор...")
        supervisor.cancel()
        api.close()
        printMetrics(metrics, prefix = "FINAL")
    })

    scope.launch { reporter(metrics, config.metricsIntervalSeconds.coerceAtLeast(1)) }

    val durationMs = if (config.durationSeconds <= 0) 0L else config.durationSeconds * 1000L
    val perClientDelayMs = if (config.clients <= 0 || config.rampUpSeconds <= 0) 0L
    else (config.rampUpSeconds * 1000L / config.clients).coerceAtLeast(0L)

    val workJob = scope.launch {
        coroutineScope {
            repeat(config.clients) { i ->
                launch {
                    if (perClientDelayMs > 0) delay(perClientDelayMs * i.toLong())
                    VirtualClient(
                        id = i,
                        config = config,
                        api = api,
                        metrics = metrics,
                        tickers = tickers
                    ).run(durationMs)
                }
            }
        }
    }

    runBlocking {
        workJob.join()
        log.info("Все виртуальные клиенты завершили работу.")
    }
    supervisor.cancel()
    printMetrics(metrics, prefix = "FINAL")
    api.close()
}

private fun waitForTickers(api: ApiClient, attempts: Int = 30, delayMs: Long = 2_000): List<String> {
    repeat(attempts) { attempt ->
        try {
            val quotes = runBlocking { api.quotes() }
            if (quotes.isNotEmpty()) return quotes.map { it.ticker }
        } catch (e: Exception) {
            log.warn("Попытка {}/{}: не удалось получить котировки ({}). Жду {} мс.", attempt + 1, attempts, e.message, delayMs)
        }
        Thread.sleep(delayMs)
    }
    return emptyList()
}

private suspend fun reporter(metrics: Metrics, intervalSec: Int) {
    var prev = metrics.snapshot()
    while (currentCoroutineContext().isActive) {
        delay(intervalSec * 1000L)
        val diff = metrics.diff(prev)
        prev = metrics.snapshot()
        val total = diff.values.sum()
        val ratePerSec = total.toDouble() / intervalSec
        log.info("[metrics] rate={} req/s, delta={}, totals={}", "%.1f".format(ratePerSec), diff, prev)
    }
}

private fun printMetrics(metrics: Metrics, prefix: String) {
    log.info("[{}] {}", prefix, metrics.snapshot())
}
