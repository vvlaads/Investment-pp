package com.example.androidcomposeapp.ui

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.example.androidcomposeapp.ui.navigation.InvestmentNavHost
import com.example.androidcomposeapp.ui.state.rememberInvestmentAppState
import com.example.androidcomposeapp.ui.theme.AndroidComposeAppTheme

@Composable
fun InvestmentAppRoot() {
    val appState = rememberInvestmentAppState()

    AndroidComposeAppTheme(darkTheme = appState.uiState.darkMode) {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background
        ) {
            InvestmentNavHost(appState = appState)
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFFF2F5FF)
@Composable
private fun InvestmentAppPreview() {
    InvestmentAppRoot()
}
