import { Image, Pressable, StyleSheet } from "react-native";
import { palette } from "../theme/palette";
import arrow from '../assets/icons/gray/Arrow-left.png'
import { useTheme } from "../theme/ThemeProvider";

export default function BackButton({ navigation }) {
    const { theme } = useTheme();
    const s = styles(theme);

    return (
        <Pressable
            style={({ pressed }) => [
                s.container,
                pressed ? { backgroundColor: theme.hover } : null
            ]}
            onPress={() => navigation.goBack()}
        >
            <Image
                source={arrow}
                style={s.image}
            />

        </Pressable>
    );
}

const styles = (theme) => StyleSheet.create({
    container: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1000,

        width: 48,
        height: 48,
        backgroundColor: theme.surface,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: theme.border,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 24,
        height: 24,
    },
});
