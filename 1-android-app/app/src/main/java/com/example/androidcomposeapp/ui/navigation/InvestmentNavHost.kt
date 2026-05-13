package com.example.androidcomposeapp.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.example.androidcomposeapp.ui.screens.*
import com.example.androidcomposeapp.ui.state.InvestmentAppState

@Composable
fun InvestmentNavHost(appState: InvestmentAppState) {
    val uiState = appState.uiState
    val assets = uiState.assets
    val allocations = uiState.allocations

    when (val current = appState.screen) {
        AppScreen.Auth -> AuthScreen(
            onLogin = appState::completeAuth,
            onRegister = appState::openRegistration
        )

        AppScreen.Register -> RegistrationScreen(
            onBack = appState::backToAuth,
            onComplete = appState::completeAuth
        )

        is AppScreen.Main -> MainHubScreen(
            section = current.section,
            assets = assets,
            allocations = allocations,
            onSectionSelected = appState::openMain,
            onAssetSelected = { asset, origin -> appState.openAsset(asset.id, origin) },
            onOpenSettings = appState::openSettings,
            onOpenNotifications = appState::openNotifications,
            onOpenHelp = appState::openHelp,
            onOpenDeposit = appState::openDeposit,
            onOpenWithdraw = appState::openWithdraw,
            onLogout = appState::logout,
            darkMode = uiState.darkMode
        )

        AppScreen.Settings -> SettingsScreen(
            darkMode = uiState.darkMode,
            onDarkModeChange = appState::updateDarkMode,
            onBack = { appState.backToMain(MainSection.Profile) }
        )

        AppScreen.Notifications -> NotificationsScreen(
            enabled = uiState.notificationsEnabled,
            onEnabledChange = appState::updateNotifications,
            onBack = { appState.backToMain(MainSection.Profile) }
        )

        AppScreen.Help -> HelpScreen(onBack = { appState.backToMain(MainSection.Profile) })

        AppScreen.Deposit -> TransferScreen(
            title = "Пополнение счета",
            actionLabel = "Пополнить",
            hint = "Перевод на брокерский счет без комиссии",
            onBack = { appState.backToMain(MainSection.Portfolio) },
            onSubmit = { appState.backToMain(MainSection.Portfolio) }
        )

        AppScreen.Withdraw -> TransferScreen(
            title = "Вывести со счета",
            actionLabel = "Вывести",
            hint = "Вывод средств на карту или банковский счет",
            onBack = { appState.backToMain(MainSection.Portfolio) },
            onSubmit = { appState.backToMain(MainSection.Portfolio) }
        )

        is AppScreen.AssetDetails -> {
            val asset = assets.firstOrNull { it.id == current.assetId } ?: assets.first()
            AssetDetailsScreen(
                asset = asset,
                onBack = { appState.backToMain(current.origin) },
                onBuy = { appState.openTrade(asset.id, current.origin, TradeAction.Buy) },
                onSell = { appState.openTrade(asset.id, current.origin, TradeAction.Sell) }
            )
        }

        is AppScreen.Trade -> {
            val asset = assets.firstOrNull { it.id == current.assetId } ?: assets.first()
            TradeScreen(
                asset = asset,
                action = current.action,
                onBack = { appState.backToAsset(asset.id, current.origin) },
                onSubmit = { appState.backToAsset(asset.id, current.origin) }
            )
        }
    }
}