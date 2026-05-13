package com.example.androidcomposeapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AccountBalanceWallet
import androidx.compose.material.icons.outlined.DarkMode
import androidx.compose.material.icons.outlined.LightMode
import androidx.compose.material.icons.outlined.MailOutline
import androidx.compose.material.icons.outlined.NotificationsNone
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.example.androidcomposeapp.ui.components.InfoBalanceCard
import com.example.androidcomposeapp.ui.components.InputField
import com.example.androidcomposeapp.ui.components.PreferenceCard
import com.example.androidcomposeapp.ui.components.PrimaryActionButton
import com.example.androidcomposeapp.ui.components.ScreenHeader

@Composable
fun SettingsScreen(darkMode: Boolean, onDarkModeChange: (Boolean) -> Unit, onBack: () -> Unit) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 40.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            ScreenHeader(
                title = "Настройки",
                subtitle = "Управляйте видом приложения",
                onBack = onBack
            )
        }

        item {
            Column(modifier = Modifier.padding(horizontal = 20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                PreferenceCard(
                    icon = if (darkMode) Icons.Outlined.DarkMode else Icons.Outlined.LightMode,
                    title = "Темная тема",
                    description = "Включает альтернативную ночную палитру портфеля и экранов.",
                    trailing = {
                        Switch(
                            checked = darkMode,
                            onCheckedChange = onDarkModeChange,
                            colors = SwitchDefaults.colors(checkedThumbColor = Color.White)
                        )
                    }
                )
                PreferenceCard(
                    icon = Icons.Outlined.Settings,
                    title = "Визуальный стиль",
                    description = "Карточный интерфейс, мягкие тени и акцентный фиолетовый градиент.",
                    trailing = {
                        Text(text = "UI Kit", color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.SemiBold)
                    }
                )
            }
        }
    }
}

@Composable
fun NotificationsScreen(enabled: Boolean, onEnabledChange: (Boolean) -> Unit, onBack: () -> Unit) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 40.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            ScreenHeader(
                title = "Уведомления",
                subtitle = "Контролируйте сигналы по рынку и операциям",
                onBack = onBack
            )
        }

        item {
            Column(modifier = Modifier.padding(horizontal = 20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                PreferenceCard(
                    icon = Icons.Outlined.NotificationsNone,
                    title = "Показывать уведомления",
                    description = "Оповещения о движении цены и статусе сделок.",
                    trailing = {
                        Switch(
                            checked = enabled,
                            onCheckedChange = onEnabledChange,
                            colors = SwitchDefaults.colors(checkedThumbColor = Color.White)
                        )
                    }
                )
            }
        }
    }
}

@Composable
fun HelpScreen(onBack: () -> Unit) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 40.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            ScreenHeader(
                title = "Помощь",
                subtitle = "Короткая памятка по приложению",
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
                        Text(text = "Описание", style = MaterialTheme.typography.titleLarge)
                        Text(
                            text = "Сейчас это UI-прототип. Экраны уже готовы для демонстрации сценариев: просмотр рынка, портфеля, профиля и форм операций.",
                            style = MaterialTheme.typography.bodyLarge,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        PrimaryActionButton(text = "Понятно", onClick = onBack)
                    }
                }
            }
        }
    }
}

@Composable
fun TransferScreen(
    title: String,
    actionLabel: String,
    hint: String,
    onBack: () -> Unit,
    onSubmit: () -> Unit
) {
    var amount by rememberSaveable { mutableStateOf("1200000") }
    var account by rememberSaveable { mutableStateOf("Брокерский счет") }
    var comment by rememberSaveable { mutableStateOf("") }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 40.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            ScreenHeader(title = title, subtitle = hint, onBack = onBack)
        }

        item {
            Column(modifier = Modifier.padding(horizontal = 20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                InfoBalanceCard()
                InputField(
                    label = "Счет",
                    value = account,
                    onValueChange = { account = it },
                    placeholder = "Брокерский счет",
                    leadingIcon = Icons.Outlined.AccountBalanceWallet
                )
                InputField(
                    label = "Сумма",
                    value = amount,
                    onValueChange = { amount = it },
                    placeholder = "Введите сумму",
                    leadingIcon = Icons.Outlined.AccountBalanceWallet,
                    keyboardType = KeyboardType.Number
                )
                InputField(
                    label = "Комментарий",
                    value = comment,
                    onValueChange = { comment = it },
                    placeholder = "Необязательно",
                    leadingIcon = Icons.Outlined.MailOutline
                )
                PrimaryActionButton(text = actionLabel, onClick = onSubmit)
            }
        }
    }
}