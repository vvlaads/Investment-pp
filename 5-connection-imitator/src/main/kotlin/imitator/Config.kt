package imitator

data class Config(
    val baseUrl: String,
    val clients: Int,
    val rampUpSeconds: Int,
    val durationSeconds: Int,
    val minThinkMs: Long,
    val maxThinkMs: Long,
    val buySellWeight: Double,
    val readWeight: Double,
    val historyWeight: Double,
    val portfolioWeight: Double,
    val loginPrefix: String,
    val password: String,
    val requestTimeoutMs: Long,
    val httpConcurrency: Int,
    val metricsIntervalSeconds: Int,
    val maxBuyQuantity: Double
) {
    companion object {
        fun fromEnv(): Config = Config(
            baseUrl = env("API_BASE_URL", "http://localhost:8081"),
            clients = envInt("CLIENTS", 10_000),
            rampUpSeconds = envInt("RAMP_UP_SECONDS", 60),
            durationSeconds = envInt("DURATION_SECONDS", 0),
            minThinkMs = envLong("THINK_MIN_MS", 500),
            maxThinkMs = envLong("THINK_MAX_MS", 3_000),
            buySellWeight = envDouble("WEIGHT_TRADE", 0.25),
            readWeight = envDouble("WEIGHT_QUOTES", 0.45),
            historyWeight = envDouble("WEIGHT_HISTORY", 0.15),
            portfolioWeight = envDouble("WEIGHT_PORTFOLIO", 0.15),
            loginPrefix = env("LOGIN_PREFIX", "sim_"),
            password = env("CLIENT_PASSWORD", "Pa\$\$w0rd!"),
            requestTimeoutMs = envLong("REQUEST_TIMEOUT_MS", 10_000),
            httpConcurrency = envInt("HTTP_CONCURRENCY", 2048),
            metricsIntervalSeconds = envInt("METRICS_INTERVAL_SECONDS", 5),
            maxBuyQuantity = envDouble("MAX_BUY_QTY", 5.0)
        )

        private fun env(name: String, default: String) = System.getenv(name)?.takeIf { it.isNotBlank() } ?: default
        private fun envInt(name: String, default: Int) = System.getenv(name)?.toIntOrNull() ?: default
        private fun envLong(name: String, default: Long) = System.getenv(name)?.toLongOrNull() ?: default
        private fun envDouble(name: String, default: Double) = System.getenv(name)?.toDoubleOrNull() ?: default
    }
}
