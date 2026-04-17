import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { palette } from "../theme/palette";
import { fontSizes, fontWeights, typography } from "../theme/typography";
import { useApp } from "../utils/AppProvider";

export default function AssetCard({ companyName, amount, pricePerUnit, diffPerUnit, icon, navigation }) {
    const { theme } = useApp();
    const s = styles(theme);

    return (
        <Pressable
            style={({ pressed }) => [
                s.container,
                pressed ? { backgroundColor: theme.hover } : null
            ]}
            onPress={() => navigation.navigate('StockInfo')}
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

            <View style={[s.textContainer, { alignItems: 'flex-end' }]}>
                <Text style={s.price}>{pricePerUnit * amount} ₽</Text>
                <Text style={[typography.body, { color: theme.loss }]}>{-diffPerUnit * amount} ₽ (-10%)</Text>
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
