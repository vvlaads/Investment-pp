import { Image, Pressable, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import arrow from '../assets/icons/gray/Arrow-left.png'

export default function BackButton({ navigation }) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed ? { backgroundColor: colors.grayLight } : null
            ]}
            onPress={() => navigation.goBack()}
        >
            <Image
                source={arrow}
                style={styles.image}
            />

        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1000,

        width: 48,
        height: 48,
        backgroundColor: colors.white,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.grayMedium,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 24,
        height: 24,
    },
});
