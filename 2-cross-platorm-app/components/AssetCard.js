import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { fontSizes, fontWeights, typography } from "../theme/typography";

export default function AssetCard({ companyName, amount, pricePerUnit, diffPerUnit, icon, navigation }) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed ? { backgroundColor: colors.grayLight } : null
            ]}
            onPress={() => navigation.navigate('StockInfo')}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={icon}
                    style={styles.image}
                />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.label}>{companyName}</Text>
                <Text style={styles.description}>{amount} шт.</Text>
            </View>

            <View style={[styles.textContainer, { alignItems: 'flex-end' }]}>
                <Text style={styles.price}>{pricePerUnit * amount} ₽</Text>
                <Text style={[typography.body, { color: colors.red }]}>{-diffPerUnit * amount} ₽ (-10%)</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flexDirection: "row",
        padding: 10,
        borderColor: colors.grayLight,
        borderWidth: 1,
        borderRadius: 10,
        gap: 10,
        alignItems: 'center',
        height: 90,
    },
    imageContainer: {
        width: 64,
        height: 64,
        backgroundColor: colors.background,
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
        color: colors.black,
        fontSize: fontSizes.medium
    },
    description: {
        color: colors.gray,
        fontSize: fontSizes.default,
        fontWeight: fontWeights.default,
    },
    price: {
        fontSize: fontSizes.default,
        fontWeight: fontWeights.bold,
        color: colors.black,
    },
});
