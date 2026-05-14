package connection

import com.fasterxml.jackson.annotation.JsonProperty

data class WalletDepositRequest(
    @JsonProperty("amount") val amount: Double
)

data class WalletWithdrawRequest(
    @JsonProperty("amount") val amount: Double
)

data class StockBuyRequest(
    @JsonProperty("ticker") val ticker: String,
    @JsonProperty("quantity") val quantity: Int,
    @JsonProperty("price") val price: Double
)

data class StockSellRequest(
    @JsonProperty("ticker") val ticker: String,
    @JsonProperty("quantity") val quantity: Int,
    @JsonProperty("price") val price: Double
)

data class StockInfoRequest(
    @JsonProperty("ticker") val ticker: String,
    @JsonProperty("beginDate") val beginDate: String,
    @JsonProperty("endDate") val endDate: String
)
