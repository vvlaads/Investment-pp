package com.example.androidcomposeapp.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ColorScheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme: ColorScheme = lightColorScheme(
    primary = BrandPurple,
    onPrimary = Color.White,
    secondary = AccentSky,
    onSecondary = LightText,
    tertiary = AccentPink,
    background = LightBackground,
    onBackground = LightText,
    surface = LightSurface,
    onSurface = LightText,
    surfaceVariant = LightSurfaceVariant,
    onSurfaceVariant = LightMuted,
    outline = LightOutline
)

private val DarkColorScheme: ColorScheme = darkColorScheme(
    primary = BrandPurpleNight,
    onPrimary = Color.White,
    secondary = AccentSky,
    onSecondary = DarkBackground,
    tertiary = AccentPink,
    background = DarkBackground,
    onBackground = DarkText,
    surface = DarkSurface,
    onSurface = DarkText,
    surfaceVariant = DarkSurfaceVariant,
    onSurfaceVariant = DarkMuted,
    outline = DarkOutline
)

@Composable
fun AndroidComposeAppTheme(
    darkTheme: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
