package com.example.androidcomposeapp.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Typography = Typography(
	headlineLarge = TextStyle(
		fontSize = 32.sp,
		lineHeight = 38.sp,
		fontWeight = FontWeight.Bold
	),
	headlineMedium = TextStyle(
		fontSize = 26.sp,
		lineHeight = 32.sp,
		fontWeight = FontWeight.Bold
	),
	titleLarge = TextStyle(
		fontSize = 20.sp,
		lineHeight = 26.sp,
		fontWeight = FontWeight.Bold
	),
	titleMedium = TextStyle(
		fontSize = 16.sp,
		lineHeight = 22.sp,
		fontWeight = FontWeight.SemiBold
	),
	bodyLarge = TextStyle(
		fontSize = 15.sp,
		lineHeight = 22.sp,
		fontWeight = FontWeight.Normal
	),
	bodyMedium = TextStyle(
		fontSize = 14.sp,
		lineHeight = 20.sp,
		fontWeight = FontWeight.Normal
	),
	labelLarge = TextStyle(
		fontSize = 13.sp,
		lineHeight = 18.sp,
		fontWeight = FontWeight.SemiBold
	)
)
