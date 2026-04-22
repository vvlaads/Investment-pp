import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { fontSizes, fontWeights, typography } from "../theme/typography";
import { useApp } from "../utils/AppProvider";
import { formatValue } from "../utils/formatValue";
import { formatPercent } from "../utils/formatPercent";

export default function AssetCard({ companyName, amount, pricePerUnit, prevPricePerUnit, icon, onPress }) {
    const { theme } = useApp();
    const s = styles(theme);

    const diff = pricePerUnit - prevPricePerUnit;
    const isProfit = diff > 0;
    const percent = prevPricePerUnit
        ? (diff / prevPricePerUnit) * 100
        : 0;

    const profitColor = isProfit ? theme.profit : theme.loss;

    return (
        <Pressable
            style={({ pressed }) => [
                s.container,
                pressed ? { backgroundColor: theme.hover } : null
            ]}
            onPress={onPress}
        >
            <View style={s.imageContainer}>
                <Image
                    source={icon}
                    style={s.image}
                />
            </View>

            <View style={s.textContainer}>
                <Text style={s.label}>{companyName}</Text>
                <Text style={s.description}>{amount} шт.</Text>
            </View>

            <View style={[s.textContainer, s.rightContainer]}>
                <Text style={s.price}>
                    {formatValue(pricePerUnit * amount, true)}
                </Text>
                <Text style={[typography.body, { color: profitColor }]}>
                    {formatValue(diff * amount, true, true)} ({formatPercent(percent, true, true)})
                </Text>
            </View>
        </Pressable>
    );
}

const styles = (theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.surface,
        flexDirection: "row",
        padding: 10,
        borderColor: theme.border,
        borderWidth: 1,
        borderRadius: 10,
        gap: 10,
        alignItems: 'center',
        height: 90,
    },
    imageContainer: {
        width: 64,
        height: 64,
        backgroundColor: theme.background,
        borderRadius: 100,
        padding: 10,
    },
    image: {
        width: '100%',
        height: '100%'
    },
    textContainer: {
        flexDirection: "column",
        flexShrink: 1,
    },
    rightContainer: {
        alignItems: 'flex-end',
        flex: 1,
    },
    label: {
        color: theme.primaryText,
        fontSize: fontSizes.medium
    },
    description: {
        color: theme.secondaryText,
        fontSize: fontSizes.default,
        fontWeight: fontWeights.default,
    },
    price: {
        fontSize: fontSizes.default,
        fontWeight: fontWeights.bold,
        color: theme.primaryText,
    },
});
