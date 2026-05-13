package com.example.androidcomposeapp.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AccountBalanceWallet
import androidx.compose.material.icons.outlined.DonutLarge
import androidx.compose.material.icons.outlined.PersonOutline
import androidx.compose.material.icons.outlined.ShowChart
import androidx.compose.ui.graphics.vector.ImageVector

enum class MainSection(val label: String, val icon: ImageVector) {
    Portfolio("Портфель", Icons.Outlined.AccountBalanceWallet),
    Market("Рынок", Icons.Outlined.ShowChart),
    Analytics("Аналитика", Icons.Outlined.DonutLarge),
    Profile("Профиль", Icons.Outlined.PersonOutline)
}

enum class TradeAction(val title: String, val cta: String) {
    Buy("Купить акцию", "Купить"),
    Sell("Продать акцию", "Продать")
}

sealed interface AppScreen {
    data object Auth : AppScreen
    data object Register : AppScreen
    data class Main(val section: MainSection) : AppScreen
    data object Settings : AppScreen
    data object Notifications : AppScreen
    data object Help : AppScreen
    data object Deposit : AppScreen
    data object Withdraw : AppScreen
    data class AssetDetails(val assetId: String, val origin: MainSection) : AppScreen
    data class Trade(val assetId: String, val origin: MainSection, val action: TradeAction) : AppScreen
}