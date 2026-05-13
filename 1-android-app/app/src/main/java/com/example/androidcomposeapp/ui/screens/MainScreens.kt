package com.example.androidcomposeapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.HelpOutline
import androidx.compose.material.icons.outlined.NorthEast
import androidx.compose.material.icons.outlined.NotificationsNone
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material.icons.outlined.SouthWest
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.androidcomposeapp.ui.components.*
import com.example.androidcomposeapp.ui.navigation.MainSection
import com.example.androidcomposeapp.ui.state.Allocation
import com.example.androidcomposeapp.ui.state.Asset
import java.util.Locale

@Composable
fun MainHubScreen(
    section: MainSection,
    assets: List<Asset>,
    allocations: List<Allocation>,
    onSectionSelected: (MainSection) -> Unit,
    onAssetSelected: (Asset, MainSection) -> Unit,
    onOpenSettings: () -> Unit,
    onOpenNotifications: () -> Unit,
    onOpenHelp: () -> Unit,
    onOpenDeposit: () -> Unit,
    onOpenWithdraw: () -> Unit,
    onLogout: () -> Unit,
    darkMode: Boolean
) {
    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        bottomBar = {
            InvestmentBottomBar(selected = section, onSectionSelected = onSectionSelected)
        }
    ) { innerPadding ->
        when (section) {
            MainSection.Portfolio -> PortfolioScreen(
                modifier = Modifier.padding(innerPadding),
                assets = assets,
                onDeposit = onOpenDeposit,
                onWithdraw = onOpenWithdraw,
                onAssetSelected = { onAssetSelected(it, MainSection.Portfolio) }
            )

            MainSection.Market -> MarketScreen(
                modifier = Modifier.padding(innerPadding),
                assets = assets,
                onAssetSelected = { onAssetSelected(it, MainSection.Market) }
            )

            MainSection.Analytics -> AnalyticsScreen(
                modifier = Modifier.padding(innerPadding),
                assets = assets,
                allocations = allocations,
                onAssetSelected = { onAssetSelected(it, MainSection.Analytics) }
            )

            MainSection.Profile -> ProfileScreen(
                modifier = Modifier.padding(innerPadding),
                darkMode = darkMode,
                onOpenSettings = onOpenSettings,
                onOpenNotifications = onOpenNotifications,
                onOpenHelp = onOpenHelp,
                onLogout = onLogout
            )
        }
    }
}

@Composable
fun PortfolioScreen(
    modifier: Modifier,
    assets: List<Asset>,
    onDeposit: () -> Unit,
    onWithdraw: () -> Unit,
    onAssetSelected: (Asset) -> Unit
) {
    var query by rememberSaveable { mutableStateOf("") }
    val filteredAssets = assets.filter {
        val normalized = query.trim().lowercase(Locale.getDefault())
        normalized.isBlank() ||
            it.name.lowercase(Locale.getDefault()).contains(normalized) ||
            it.ticker.lowercase(Locale.getDefault()).contains(normalized)
    }

    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = 18.dp, bottom = 120.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            GradientSummaryCard(
                title = "Портфель",
                subtitle = "1 200 000,00 ₽",
                supporting = "11.04% за месяц",
                chips = listOf("7 активов", "Плюс 34 560 ₽")
            )
        }

        item {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                QuickActionCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Outlined.SouthWest,
                    title = "Пополнить",
                    subtitle = "Без комиссии",
                    onClick = onDeposit
                )
                QuickActionCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Outlined.NorthEast,
                    title = "Вывести",
                    subtitle = "На карту",
                    onClick = onWithdraw
                )
            }
        }

        item {
            SearchField(
                value = query,
                onValueChange = { query = it },
                placeholder = "Поиск актива"
            )
        }

        item {
            SectionHeading(title = "Мои активы", caption = "${filteredAssets.size} позиций")
        }

        items(filteredAssets, key = { it.id }) { asset ->
            AssetCard(
                asset = asset,
                subtitle = asset.quantityLabel,
                value = asset.positionLabel,
                onClick = { onAssetSelected(asset) }
            )
        }
    }
}

@Composable
fun MarketScreen(modifier: Modifier, assets: List<Asset>, onAssetSelected: (Asset) -> Unit) {
    var query by rememberSaveable { mutableStateOf("") }
    val filteredAssets = assets.filter {
        val normalized = query.trim().lowercase(Locale.getDefault())
        normalized.isBlank() ||
            it.name.lowercase(Locale.getDefault()).contains(normalized) ||
            it.sector.lowercase(Locale.getDefault()).contains(normalized)
    }

    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = 18.dp, bottom = 120.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            GradientSummaryCard(
                title = "Рынок",
                subtitle = "Горячие предложения",
                supporting = "Подборка активов для наблюдения",
                chips = listOf("Акции", "ETF", "Облигации")
            )
        }

        item {
            SearchField(
                value = query,
                onValueChange = { query = it },
                placeholder = "Поиск компании или сектора"
            )
        }

        item {
            SectionHeading(title = "Витрина рынка", caption = "Обновлено сегодня")
        }

        items(filteredAssets, key = { it.id }) { asset ->
            AssetCard(
                asset = asset,
                subtitle = asset.sector,
                value = asset.priceLabel,
                onClick = { onAssetSelected(asset) }
            )
        }
    }
}

@Composable
fun AnalyticsScreen(
    modifier: Modifier,
    assets: List<Asset>,
    allocations: List<Allocation>,
    onAssetSelected: (Asset) -> Unit
) {
    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = 18.dp, bottom = 120.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            GradientSummaryCard(
                title = "Аналитика",
                subtitle = "Обзор портфеля",
                supporting = "Структура, лидеры роста и распределение рисков",
                chips = listOf("Риск 4/10", "Доходность +11.04%")
            )
        }

        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(30.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(18.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "100 000 ₽",
                        style = MaterialTheme.typography.headlineMedium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    AllocationDonutChart(data = allocations)
                    allocations.forEach { allocation ->
                        LegendRow(allocation = allocation)
                    }
                }
            }
        }

        item {
            SectionHeading(title = "Лидеры роста", caption = "За последний месяц")
        }

        items(assets.take(3), key = { it.id }) { asset ->
            AssetCard(
                asset = asset,
                subtitle = asset.sector,
                value = asset.priceLabel,
                onClick = { onAssetSelected(asset) }
            )
        }
    }
}

@Composable
fun ProfileScreen(
    modifier: Modifier,
    darkMode: Boolean,
    onOpenSettings: () -> Unit,
    onOpenNotifications: () -> Unit,
    onOpenHelp: () -> Unit,
    onLogout: () -> Unit
) {
    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = 18.dp, bottom = 120.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            GradientSummaryCard(
                title = "Профиль",
                subtitle = "Иван Алексеевич Владимирович",
                supporting = "Премиум-пользователь",
                chips = listOf(if (darkMode) "Темная тема" else "Светлая тема", "4.2% ROI")
            )
        }

        item {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                ProfileStatCard(modifier = Modifier.weight(1f), title = "Доход", value = "+7 204 ₽")
                ProfileStatCard(modifier = Modifier.weight(1f), title = "Риск", value = "Умеренный")
            }
        }

        item {
            SectionHeading(title = "Основное", caption = "Настройки и сервис")
        }

        item { ProfileActionCard(icon = Icons.Outlined.Settings, title = "Настройки", onClick = onOpenSettings) }
        item { ProfileActionCard(icon = Icons.Outlined.NotificationsNone, title = "Уведомления", onClick = onOpenNotifications) }
        item { ProfileActionCard(icon = Icons.Outlined.HelpOutline, title = "Помощь", onClick = onOpenHelp) }
        item { SecondaryActionButton(text = "Выйти из аккаунта", onClick = onLogout) }
    }
}