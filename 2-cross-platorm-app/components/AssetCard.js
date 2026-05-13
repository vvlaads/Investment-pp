import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { fontSizes, fontWeights, typography } from "../theme/typography";
import { useApp } from "../utils/AppProvider";
import { formatValue } from "../utils/formatValue";
import { formatPercent } from "../utils/formatPercent";

export default function AssetCard({ asset, icon, onPress }) {
    const { theme } = useApp();
    const s = styles(theme);

    const diff = asset.currentPrice - asset.avgPurchasePrice;
    const percent = asset.avgPurchasePrice
        ? (diff / asset.avgPurchasePrice) * 100
        : 0;

    const totalProfit = diff * asset.quantity;
    const isProfit = totalProfit >= 0;

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
                <Text style={s.label}>{asset.ticker}</Text>
                <Text style={s.description}>{asset.quantity} шт.</Text>
            </View>

            <View style={[s.textContainer, s.rightContainer]}>
                <Text style={s.price}>
                    {formatValue(asset.currentPrice * asset.quantity, true)}
                </Text>
                <Text style={[typography.body, { color: isProfit ? theme.profit : theme.loss }]}>
                    {formatValue(totalProfit, true, true)} ({formatPercent(percent, true, true)})
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
