package com.example.androidcomposeapp.ui.state

import androidx.compose.runtime.Composable
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color
import com.example.androidcomposeapp.ui.navigation.AppScreen
import com.example.androidcomposeapp.ui.navigation.MainSection
import com.example.androidcomposeapp.ui.navigation.TradeAction
import com.example.androidcomposeapp.ui.theme.AccentAmber
import com.example.androidcomposeapp.ui.theme.AccentPink
import com.example.androidcomposeapp.ui.theme.AccentSky
import com.example.androidcomposeapp.ui.theme.BrandPurple
import com.example.androidcomposeapp.ui.theme.PositiveGreen
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.util.Locale

data class Asset(
    val id: String,
    val name: String,
    val ticker: String,
    val priceValue: Double,
    val quantity: Int,
    val changePercent: Double,
    val sector: String,
    val accent: Color,
    val history: List<Float>
) {
    val priceLabel: String
        get() = formatRubles(priceValue)

    val positionLabel: String
        get() = formatRubles(priceValue * quantity)

    val quantityLabel: String
        get() = "$quantity шт."

    val changeLabel: String
        get() = buildString {
            if (changePercent > 0) append("+")
            append(String.format(Locale.US, "%.1f%%", changePercent))
        }
}

data class Allocation(
    val label: String,
    val share: Float,
    val amount: String,
    val color: Color
)

data class InvestmentUiState(
    val darkMode: Boolean = false,
    val notificationsEnabled: Boolean = true,
    val assets: List<Asset> = sampleAssets,
    val allocations: List<Allocation> = sampleAllocations
)

@Stable
class InvestmentAppState {
    var screen by mutableStateOf<AppScreen>(AppScreen.Auth)
        private set

    var uiState by mutableStateOf(InvestmentUiState())
        private set

    fun updateDarkMode(enabled: Boolean) {
        uiState = uiState.copy(darkMode = enabled)
    }

    fun updateNotifications(enabled: Boolean) {
        uiState = uiState.copy(notificationsEnabled = enabled)
    }

    fun openRegistration() {
        screen = AppScreen.Register
    }

    fun completeAuth() {
        screen = AppScreen.Main(MainSection.Portfolio)
    }

    fun logout() {
        screen = AppScreen.Auth
    }

    fun openMain(section: MainSection) {
        screen = AppScreen.Main(section)
    }

    fun openSettings() {
        screen = AppScreen.Settings
    }

    fun openNotifications() {
        screen = AppScreen.Notifications
    }

    fun openHelp() {
        screen = AppScreen.Help
    }

    fun openDeposit() {
        screen = AppScreen.Deposit
    }

    fun openWithdraw() {
        screen = AppScreen.Withdraw
    }

    fun openAsset(assetId: String, origin: MainSection) {
        screen = AppScreen.AssetDetails(assetId, origin)
    }

    fun openTrade(assetId: String, origin: MainSection, action: TradeAction) {
        screen = AppScreen.Trade(assetId, origin, action)
    }

    fun backToAuth() {
        screen = AppScreen.Auth
    }

    fun backToMain(section: MainSection) {
        screen = AppScreen.Main(section)
    }

    fun backToAsset(assetId: String, origin: MainSection) {
        screen = AppScreen.AssetDetails(assetId, origin)
    }
}

@Composable
fun rememberInvestmentAppState(): InvestmentAppState = remember { InvestmentAppState() }

val sampleAssets = listOf(
    Asset(
        id = "apple",
        name = "Apple",
        ticker = "AAPL",
        priceValue = 12360.0,
        quantity = 4,
        changePercent = 8.2,
        sector = "Технологии",
        accent = AccentSky,
        history = listOf(0.22f, 0.38f, 0.34f, 0.46f, 0.58f, 0.64f, 0.78f, 0.82f)
    ),
    Asset(
        id = "rosneft",
        name = "Роснефть",
        ticker = "ROSN",
        priceValue = 1200.0,
        quantity = 2,
        changePercent = -10.0,
        sector = "Нефтегаз",
        accent = AccentAmber,
        history = listOf(0.70f, 0.66f, 0.69f, 0.61f, 0.56f, 0.54f, 0.50f, 0.46f)
    ),
    Asset(
        id = "mts",
        name = "МТС",
        ticker = "MTSS",
        priceValue = 1200.0,
        quantity = 3,
        changePercent = -4.2,
        sector = "Телеком",
        accent = AccentPink,
        history = listOf(0.62f, 0.60f, 0.64f, 0.58f, 0.54f, 0.57f, 0.52f, 0.49f)
    ),
    Asset(
        id = "gazprom",
        name = "Газпром",
        ticker = "GAZP",
        priceValue = 1200.0,
        quantity = 2,
        changePercent = -2.3,
        sector = "Энергетика",
        accent = BrandPurple,
        history = listOf(0.58f, 0.63f, 0.61f, 0.60f, 0.55f, 0.52f, 0.50f, 0.47f)
    ),
    Asset(
        id = "sber",
        name = "Сбер",
        ticker = "SBER",
        priceValue = 1530.0,
        quantity = 6,
        changePercent = 3.5,
        sector = "Финансы",
        accent = PositiveGreen,
        history = listOf(0.28f, 0.36f, 0.40f, 0.48f, 0.46f, 0.54f, 0.60f, 0.67f)
    )
)

val sampleAllocations = listOf(
    Allocation("Apple", 0.34f, "420 000 ₽", AccentSky),
    Allocation("МТС", 0.26f, "310 000 ₽", AccentPink),
    Allocation("Газпром", 0.22f, "260 000 ₽", BrandPurple),
    Allocation("Наличные", 0.18f, "210 000 ₽", AccentAmber)
)

fun formatRubles(amount: Double): String {
    val formatter = DecimalFormat("#,##0.00", DecimalFormatSymbols(Locale("ru", "RU")))
    return formatter.format(amount) + " ₽"
}