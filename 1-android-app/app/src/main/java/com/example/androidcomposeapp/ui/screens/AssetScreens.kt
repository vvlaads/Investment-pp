package com.example.androidcomposeapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AccountBalanceWallet
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.androidcomposeapp.ui.components.*
import com.example.androidcomposeapp.ui.navigation.TradeAction
import com.example.androidcomposeapp.ui.state.Asset
import com.example.androidcomposeapp.ui.state.formatRubles

@Composable
fun AssetDetailsScreen(asset: Asset, onBack: () -> Unit, onBuy: () -> Unit, onSell: () -> Unit) {
    var selectedRange by rememberSaveable { mutableStateOf("1M") }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 40.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            ScreenHeader(
                title = asset.name,
                subtitle = "${asset.ticker} • ${asset.sector}",
                onBack = onBack
            )
        }

        item {
            Column(modifier = Modifier.padding(horizontal = 20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = androidx.compose.foundation.shape.RoundedCornerShape(28.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            AssetBadge(label = asset.name.take(1), color = asset.accent)
                            ChangePill(change = asset.changeLabel)
                        }
                        Text(text = asset.priceLabel, style = MaterialTheme.typography.headlineLarge)
                        Text(
                            text = "В портфеле ${asset.quantityLabel}",
                            style = MaterialTheme.typography.bodyLarge,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                RangeSelector(selected = selectedRange, onSelected = { selectedRange = it })

                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = androidx.compose.foundation.shape.RoundedCornerShape(28.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Text(text = "График", style = MaterialTheme.typography.titleLarge)
                        PriceChart(asset = asset)
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                    SecondaryActionButton(
                        modifier = Modifier.weight(1f),
                        text = "Продать",
                        onClick = onSell
                    )
                    PrimaryActionButton(
                        modifier = Modifier.weight(1f),
                        text = "Купить",
                        onClick = onBuy
                    )
                }
            }
        }
    }
}

@Composable
fun TradeScreen(asset: Asset, action: TradeAction, onBack: () -> Unit, onSubmit: () -> Unit) {
    var quantity by rememberSaveable { mutableStateOf("1") }
    val total = formatRubles((quantity.toIntOrNull() ?: 0) * asset.priceValue)

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 40.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            ScreenHeader(
                title = action.title,
                subtitle = "${asset.name} • ${asset.ticker}",
                onBack = onBack
            )
        }

        item {
            Column(modifier = Modifier.padding(horizontal = 20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                AssetCard(asset = asset, subtitle = asset.quantityLabel, value = asset.priceLabel)
                InputField(
                    label = "Количество",
                    value = quantity,
                    onValueChange = { quantity = it.filter(Char::isDigit) },
                    placeholder = "0",
                    leadingIcon = Icons.Outlined.AccountBalanceWallet,
                    keyboardType = androidx.compose.ui.text.input.KeyboardType.Number
                )
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = androidx.compose.foundation.shape.RoundedCornerShape(28.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        SummaryRow(label = "Цена", value = asset.priceLabel)
                        SummaryRow(label = "Количество", value = quantity.ifBlank { "0" })
                        SummaryRow(label = "Комиссия", value = "0 ₽")
                        HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
                        SummaryRow(label = "Итог", value = total, emphasized = true)
                    }
                }
                PrimaryActionButton(text = action.cta, onClick = onSubmit)
            }
        }
    }
}