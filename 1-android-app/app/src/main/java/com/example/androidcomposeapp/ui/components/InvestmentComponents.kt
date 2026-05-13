package com.example.androidcomposeapp.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ArrowBack
import androidx.compose.material.icons.outlined.ArrowForward
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.example.androidcomposeapp.ui.navigation.MainSection
import com.example.androidcomposeapp.ui.state.Allocation
import com.example.androidcomposeapp.ui.state.Asset
import com.example.androidcomposeapp.ui.theme.BrandPurple
import com.example.androidcomposeapp.ui.theme.BrandPurpleDark
import com.example.androidcomposeapp.ui.theme.NegativeRose
import com.example.androidcomposeapp.ui.theme.PositiveGreen
import java.util.Locale

@Composable
fun InvestmentBottomBar(selected: MainSection, onSectionSelected: (MainSection) -> Unit) {
    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp
    ) {
        MainSection.entries.forEach { section ->
            NavigationBarItem(
                selected = selected == section,
                onClick = { onSectionSelected(section) },
                icon = { Icon(imageVector = section.icon, contentDescription = section.label) },
                label = { Text(text = section.label) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = MaterialTheme.colorScheme.onPrimary,
                    selectedTextColor = MaterialTheme.colorScheme.primary,
                    unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                    unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant,
                    indicatorColor = MaterialTheme.colorScheme.primary
                )
            )
        }
    }
}

@Composable
fun InvestmentWordmark() {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(24.dp),
        tonalElevation = 6.dp
    ) {
        Text(
            text = "Investment++",
            modifier = Modifier.padding(horizontal = 18.dp, vertical = 12.dp),
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.primary
        )
    }
}

@Composable
fun GradientSummaryCard(
    title: String,
    subtitle: String,
    supporting: String,
    chips: List<String>
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.Transparent),
        shape = RoundedCornerShape(32.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    brush = Brush.linearGradient(listOf(BrandPurple, BrandPurpleDark)),
                    shape = RoundedCornerShape(32.dp)
                )
                .padding(22.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(text = title, style = MaterialTheme.typography.titleLarge, color = Color.White.copy(alpha = 0.86f))
                Text(text = subtitle, style = MaterialTheme.typography.headlineLarge, color = Color.White)
                Text(text = supporting, style = MaterialTheme.typography.bodyLarge, color = Color.White.copy(alpha = 0.84f))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    chips.forEach { chip ->
                        Surface(
                            color = Color.White.copy(alpha = 0.16f),
                            shape = RoundedCornerShape(18.dp)
                        ) {
                            Text(
                                text = chip,
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                                color = Color.White,
                                style = MaterialTheme.typography.labelLarge
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun QuickActionCard(
    modifier: Modifier = Modifier,
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier.clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Surface(
                color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
                shape = CircleShape
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    modifier = Modifier.padding(12.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
            }
            Text(text = title, style = MaterialTheme.typography.titleMedium)
            Text(text = subtitle, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
fun AssetCard(
    asset: Asset,
    subtitle: String,
    value: String,
    onClick: (() -> Unit)? = null
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(28.dp))
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(28.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            AssetBadge(label = asset.name.take(1), color = asset.accent)
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(text = asset.name, style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.onSurface)
                Text(text = subtitle, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Column(horizontalAlignment = Alignment.End, verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(text = value, style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.onSurface)
                Text(
                    text = asset.changeLabel,
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (asset.changePercent >= 0) PositiveGreen else NegativeRose
                )
            }
        }
    }
}

@Composable
fun AssetBadge(label: String, color: Color) {
    Surface(color = color.copy(alpha = 0.16f), shape = CircleShape) {
        Box(modifier = Modifier.size(48.dp), contentAlignment = Alignment.Center) {
            Text(
                text = label.uppercase(Locale.getDefault()),
                style = MaterialTheme.typography.titleMedium,
                color = color,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun SearchField(value: String, onValueChange: (String) -> Unit, placeholder: String) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier.fillMaxWidth(),
        leadingIcon = {
            Icon(
                imageVector = Icons.Outlined.Search,
                contentDescription = placeholder,
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        },
        placeholder = { Text(text = placeholder) },
        shape = RoundedCornerShape(24.dp),
        colors = fieldColors(),
        singleLine = true
    )
}

@Composable
fun InputField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    leadingIcon: ImageVector,
    keyboardType: KeyboardType = KeyboardType.Text,
    obscureText: Boolean = false
) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(text = label, style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth(),
            leadingIcon = { Icon(imageVector = leadingIcon, contentDescription = label) },
            placeholder = { Text(text = placeholder) },
            shape = RoundedCornerShape(24.dp),
            colors = fieldColors(),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
            visualTransformation = if (obscureText) PasswordVisualTransformation() else VisualTransformation.None
        )
    }
}

@Composable
fun PrimaryActionButton(modifier: Modifier = Modifier, text: String, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        modifier = modifier.fillMaxWidth().height(56.dp),
        shape = RoundedCornerShape(20.dp),
        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
    ) {
        Text(text = text, style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.onPrimary)
    }
}

@Composable
fun SecondaryActionButton(modifier: Modifier = Modifier, text: String, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        modifier = modifier.fillMaxWidth().height(56.dp),
        shape = RoundedCornerShape(20.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
            contentColor = MaterialTheme.colorScheme.primary
        )
    ) {
        Text(text = text, style = MaterialTheme.typography.titleMedium)
    }
}

@Composable
fun SectionHeading(title: String, caption: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = title, style = MaterialTheme.typography.titleLarge, color = MaterialTheme.colorScheme.onBackground)
        Text(text = caption, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
fun ProfileStatCard(modifier: Modifier = Modifier, title: String, value: String) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(text = title, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(text = value, style = MaterialTheme.typography.titleLarge, color = MaterialTheme.colorScheme.onSurface)
        }
    }
}

@Composable
fun ProfileActionCard(icon: ImageVector, title: String, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(24.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Surface(color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f), shape = CircleShape) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    modifier = Modifier.padding(12.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
            }
            Text(text = title, modifier = Modifier.weight(1f), style = MaterialTheme.typography.titleMedium)
            Icon(
                imageVector = Icons.Outlined.ArrowForward,
                contentDescription = title,
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun PreferenceCard(
    icon: ImageVector,
    title: String,
    description: String,
    trailing: @Composable () -> Unit
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(28.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Surface(color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f), shape = CircleShape) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    modifier = Modifier.padding(12.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
            }
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(text = title, style = MaterialTheme.typography.titleMedium)
                Text(text = description, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            trailing()
        }
    }
}

@Composable
fun ScreenHeader(title: String, subtitle: String, onBack: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                brush = Brush.linearGradient(listOf(BrandPurple, BrandPurpleDark)),
                shape = RoundedCornerShape(bottomStart = 32.dp, bottomEnd = 32.dp)
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(horizontal = 20.dp, vertical = 18.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            SmallBackButton(onClick = onBack, light = true)
            Text(text = title, style = MaterialTheme.typography.headlineLarge, color = Color.White)
            Text(text = subtitle, style = MaterialTheme.typography.bodyLarge, color = Color.White.copy(alpha = 0.84f))
        }
    }
}

@Composable
fun SmallBackButton(onClick: () -> Unit, light: Boolean = false) {
    Surface(
        modifier = Modifier.size(46.dp).clickable(onClick = onClick),
        color = if (light) Color.White.copy(alpha = 0.18f) else MaterialTheme.colorScheme.surface,
        shape = CircleShape
    ) {
        Box(contentAlignment = Alignment.Center) {
            Icon(
                imageVector = Icons.Outlined.ArrowBack,
                contentDescription = "Назад",
                tint = if (light) Color.White else MaterialTheme.colorScheme.onSurface
            )
        }
    }
}

@Composable
fun InfoBalanceCard() {
    Card(
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(28.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(text = "Брокерский счет", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(text = "1 200 000,00 ₽", style = MaterialTheme.typography.headlineMedium, color = MaterialTheme.colorScheme.onSurface)
        }
    }
}

@Composable
fun ChangePill(change: String) {
    val positive = !change.trim().startsWith("-")
    Surface(
        color = if (positive) PositiveGreen.copy(alpha = 0.14f) else NegativeRose.copy(alpha = 0.14f),
        shape = RoundedCornerShape(16.dp)
    ) {
        Text(
            text = change,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            color = if (positive) PositiveGreen else NegativeRose,
            style = MaterialTheme.typography.labelLarge
        )
    }
}

@Composable
fun RangeSelector(selected: String, onSelected: (String) -> Unit) {
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
        listOf("1D", "1W", "1M", "1Y").forEach { range ->
            Surface(
                modifier = Modifier.clickable { onSelected(range) },
                color = if (selected == range) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surface,
                shape = RoundedCornerShape(16.dp)
            ) {
                Text(
                    text = range,
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                    style = MaterialTheme.typography.labelLarge,
                    color = if (selected == range) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
fun PriceChart(asset: Asset) {
    val gridColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.22f)

    Canvas(modifier = Modifier.fillMaxWidth().height(220.dp)) {
        val width = size.width
        val height = size.height
        val linePath = Path()
        val points = asset.history
        val step = if (points.size > 1) width / (points.size - 1) else width

        for (index in 0 until 4) {
            val y = height / 4f * index
            drawLine(
                color = gridColor,
                start = Offset(0f, y),
                end = Offset(width, y),
                strokeWidth = 1.4f
            )
        }

        points.forEachIndexed { index, value ->
            val x = step * index
            val y = height - (height * value)
            if (index == 0) linePath.moveTo(x, y) else linePath.lineTo(x, y)
        }

        drawPath(
            path = linePath,
            color = asset.accent,
            style = Stroke(width = 8f, cap = StrokeCap.Round)
        )
    }
}

@Composable
fun AllocationDonutChart(data: List<Allocation>) {
    Canvas(modifier = Modifier.size(220.dp)) {
        val stroke = size.minDimension * 0.14f
        var startAngle = -90f

        data.forEach { allocation ->
            val sweep = allocation.share * 360f
            drawArc(
                color = allocation.color,
                startAngle = startAngle,
                sweepAngle = sweep,
                useCenter = false,
                style = Stroke(width = stroke, cap = StrokeCap.Round)
            )
            startAngle += sweep + 4f
        }
    }
}

@Composable
fun LegendRow(allocation: Allocation) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Surface(color = allocation.color, shape = CircleShape) {
                Spacer(modifier = Modifier.size(12.dp))
            }
            Text(text = allocation.label, style = MaterialTheme.typography.bodyLarge)
        }
        Text(text = allocation.amount, style = MaterialTheme.typography.titleMedium)
    }
}

@Composable
fun SummaryRow(label: String, value: String, emphasized: Boolean = false) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(
            text = value,
            style = if (emphasized) MaterialTheme.typography.titleLarge else MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onSurface
        )
    }
}

@Composable
private fun fieldColors() = OutlinedTextFieldDefaults.colors(
    focusedContainerColor = MaterialTheme.colorScheme.surface,
    unfocusedContainerColor = MaterialTheme.colorScheme.surface,
    disabledContainerColor = MaterialTheme.colorScheme.surface,
    focusedBorderColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.7f),
    unfocusedBorderColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.7f),
    focusedTextColor = MaterialTheme.colorScheme.onSurface,
    unfocusedTextColor = MaterialTheme.colorScheme.onSurface,
    focusedLeadingIconColor = MaterialTheme.colorScheme.primary,
    unfocusedLeadingIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
    focusedPlaceholderColor = MaterialTheme.colorScheme.onSurfaceVariant,
    unfocusedPlaceholderColor = MaterialTheme.colorScheme.onSurfaceVariant
)