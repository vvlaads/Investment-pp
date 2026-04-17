import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { palette } from "../theme/palette";
import { fontSizes, fontWeights, typography } from "../theme/typography";
import arrow from '../assets/icons/gray/Chevron right.png'
import { useTheme } from "../theme/ThemeProvider";

export default function LinkButton({ label, description, icon, pageName, navigation }) {
    const { theme } = useTheme();
    const s = styles(theme);

    return (
        <Pressable
            style={({ pressed }) => [
                s.container,
                pressed ? { backgroundColor: theme.hover } : null
            ]}
            onPress={() => navigation.navigate(pageName)}
        >
            <View style={s.imageContainer}>
                <Image
                    source={icon}
                    style={s.image}
                />
            </View>

            <View style={s.textContainer}>
                <Text style={[s.label, typography.body]}>{label}</Text>
                <Text style={s.description}>{description}</Text>
            </View>

            <View style={s.arrowContainer}>
                <Image
                    source={arrow}
                    style={s.arrow} />
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
    },
    imageContainer: {
        width: 42,
        height: 42,
        backgroundColor: theme.background,
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
        color: theme.primaryText
    },
    description: {
        color: theme.secondaryText,
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
