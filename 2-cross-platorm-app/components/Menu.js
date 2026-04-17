import { Pressable, View, StyleSheet, Text, Image } from "react-native";
import { palette } from "../theme/darkTheme";
import { fontSizes, fontWeights } from "../theme/typography";
import { useApp } from "../utils/AppProvider";

const menuConfig = {
    Portfolio: {
        icons: {
            active: require('../assets/icons/white/portfolio.png'),
            inactive: require('../assets/icons/gray/portfolio.png'),
        },
    },
    Market: {
        icons: {
            active: require('../assets/icons/white/dollar.png'),
            inactive: require('../assets/icons/gray/dollar.png'),
        },
    },
    Analytics: {
        icons: {
            active: require('../assets/icons/white/bars.png'),
            inactive: require('../assets/icons/gray/bars.png'),
        },
    },
    Profile: {
        icons: {
            active: require('../assets/icons/white/profile.png'),
            inactive: require('../assets/icons/gray/profile.png'),
        },
    },
}

export default function Menu({ state, navigation, descriptors }) {
    const { theme } = useApp();
    const s = styles(theme);

    return (
        <View style={s.container}>
            {state.routes.map((route, index) => {
                const isActive = state.index === index;

                const { options } = descriptors[route.key];

                const label = options.title || route.name;
                const icons = menuConfig[route.name].icons

                return (
                    <Pressable
                        style={({ pressed }) => [
                            s.button,
                            pressed ? s.buttonHover : null,
                            isActive ? s.buttonActive : null
                        ]}
                        key={route.key}
                        onPress={() => navigation.navigate(route.name)}
                    >
                        <Image
                            source={isActive ? icons.active : icons.inactive}
                            style={s.buttonImage}
                        />
                        <Text style={[s.buttonText, isActive ? s.buttonTextActive : null]}>
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View >
    );
}

const styles = (theme) => StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        paddingTop: 5,
        borderTopColor: theme.border,
        borderTopWidth: 1,
        backgroundColor: theme.surface,
        height: 80,
    },
    button: {
        backgroundColor: theme.surface,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 15,
        alignItems: 'center',
        height: '100%',
        width: 90,
    },
    buttonHover: {
        backgroundColor: theme.hover,
    },
    buttonActive: {
        backgroundColor: theme.primary,
    },
    buttonText: {
        color: theme.secondaryText,
        fontSize: fontSizes.small,
        fontWeight: fontWeights.default,
    },
    buttonTextActive: {
        color: '#fff',
    },
    buttonImage: {
        width: 24,
        height: 24,
    },
});