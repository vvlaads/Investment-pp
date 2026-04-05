import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { fontSizes, fontWeights, typography } from "../theme/typography";
import arrow from '../assets/icons/gray/Chevron right.png'

export default function LinkButton({ label, description, icon, pageName, navigation }) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed ? { backgroundColor: colors.grayLight } : null
            ]}
            onPress={() => navigation.navigate(pageName)}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={icon}
                    style={styles.image}
                />
            </View>

            <View style={styles.textContainer}>
                <Text style={[styles.label, typography.body]}>{label}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>

            <View style={styles.arrowContainer}>
                <Image
                    source={arrow}
                    style={styles.arrow} />
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
    },
    imageContainer: {
        width: 42,
        height: 42,
        backgroundColor: colors.background,
        borderRadius: 10,
        padding: 5,
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
        color: colors.black
    },
    description: {
        color: colors.gray,
        fontSize: fontSizes.small,
        fontWeight: fontWeights.default,
    },
    arrowContainer: {
        width: 42,
        height: 42,
        padding: 5,
    },
    arrow: {
        width: '100%',
        height: '100%'
    },
});
