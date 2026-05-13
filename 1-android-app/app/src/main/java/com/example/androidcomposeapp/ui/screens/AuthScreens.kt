package com.example.androidcomposeapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material.icons.outlined.MailOutline
import androidx.compose.material.icons.outlined.PersonOutline
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.example.androidcomposeapp.ui.components.InputField
import com.example.androidcomposeapp.ui.components.InvestmentWordmark
import com.example.androidcomposeapp.ui.components.PrimaryActionButton
import com.example.androidcomposeapp.ui.components.SmallBackButton

@Composable
fun AuthScreen(onLogin: () -> Unit, onRegister: () -> Unit) {
    var email by rememberSaveable { mutableStateOf("demo@investment.app") }
    var password by rememberSaveable { mutableStateOf("password") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .statusBarsPadding()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 24.dp, vertical = 20.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp)
    ) {
        Spacer(modifier = Modifier.height(12.dp))
        InvestmentWordmark()
        Text(
            text = "Добро пожаловать",
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.onBackground
        )
        Text(
            text = "Минималистичный инвестиционный кабинет без лишнего шума.",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        InputField(
            label = "Почта",
            value = email,
            onValueChange = { email = it },
            placeholder = "example@mail.com",
            leadingIcon = Icons.Outlined.MailOutline,
            keyboardType = KeyboardType.Email
        )
        InputField(
            label = "Пароль",
            value = password,
            onValueChange = { password = it },
            placeholder = "Введите пароль",
            leadingIcon = Icons.Outlined.Lock,
            keyboardType = KeyboardType.Password,
            obscureText = true
        )
        PrimaryActionButton(text = "Войти", onClick = onLogin)
        TextButton(onClick = onRegister, modifier = Modifier.align(Alignment.CenterHorizontally)) {
            Text(text = "Регистрация аккаунта")
        }
    }
}

@Composable
fun RegistrationScreen(onBack: () -> Unit, onComplete: () -> Unit) {
    var name by rememberSaveable { mutableStateOf("Иван Владимирович") }
    var email by rememberSaveable { mutableStateOf("demo@investment.app") }
    var password by rememberSaveable { mutableStateOf("password") }
    var repeatPassword by rememberSaveable { mutableStateOf("password") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .statusBarsPadding()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 24.dp, vertical = 20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        SmallBackButton(onClick = onBack)
        InvestmentWordmark()
        Text(
            text = "Регистрация",
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.onBackground
        )
        Text(
            text = "Создайте аккаунт, чтобы просматривать портфель, аналитику и рынок.",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        InputField(
            label = "Имя",
            value = name,
            onValueChange = { name = it },
            placeholder = "Введите имя",
            leadingIcon = Icons.Outlined.PersonOutline
        )
        InputField(
            label = "Почта",
            value = email,
            onValueChange = { email = it },
            placeholder = "example@mail.com",
            leadingIcon = Icons.Outlined.MailOutline,
            keyboardType = KeyboardType.Email
        )
        InputField(
            label = "Пароль",
            value = password,
            onValueChange = { password = it },
            placeholder = "Введите пароль",
            leadingIcon = Icons.Outlined.Lock,
            keyboardType = KeyboardType.Password,
            obscureText = true
        )
        InputField(
            label = "Повтор пароля",
            value = repeatPassword,
            onValueChange = { repeatPassword = it },
            placeholder = "Введите пароль",
            leadingIcon = Icons.Outlined.Lock,
            keyboardType = KeyboardType.Password,
            obscureText = true
        )
        PrimaryActionButton(text = "Зарегистрироваться", onClick = onComplete)
        TextButton(onClick = onBack, modifier = Modifier.align(Alignment.CenterHorizontally)) {
            Text(text = "Уже есть аккаунт? Войти")
        }
    }
}