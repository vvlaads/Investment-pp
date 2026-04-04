import { Pressable, View, StyleSheet, Text, Image } from "react-native";
import { colors } from "../theme/colors";
import { fontSizes, fontWeights } from "../theme/typography";
import portfolioWhite from '../assets/icons/portfolio white.png'
import portfolioGray from '../assets/icons/portfolio white.png'

export default function Menu({ state, navigation, descriptors }) {
    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const isActive = state.index === index;

                const { options } = descriptors[route.key];

                const label =
                    options.title || route.name;

                return (
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            pressed ? styles.buttonHover : null,
                            isActive ? styles.buttonActive : null
                        ]}
                        key={route.key}
                        onPress={() => navigation.navigate(route.name)}
                    >
                        <Image
                            source={isActive ? portfolioWhite : portfolioGray}
                            style={styles.buttonImage}
                        />
                        <Text style={[styles.buttonText, isActive ? styles.buttonTextActive : null]}>
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        paddingTop: 5,
        borderTopColor: colors.grayMedium,
        borderTopWidth: 1,
        backgroundColor: colors.white,
        height: 80,
    },
    button: {
        backgroundColor: colors.white,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 15,
        alignItems: 'center',
        height: '100%',
    },
    buttonHover: {
        backgroundColor: colors.grayLight,
    },
    buttonActive: {
        backgroundColor: colors.main,
    },
    buttonText: {
        color: colors.gray,
        fontSize: fontSizes.small,
        fontWeight: fontWeights.default,
    },
    buttonTextActive: {
        color: colors.white,
    },
    buttonImage: {
        width: 24,
        height: 24,
    },
});