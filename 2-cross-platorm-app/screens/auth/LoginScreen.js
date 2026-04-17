import { View, Text, TextInput, StyleSheet, Pressable, Image, useWindowDimensions, ScrollView } from 'react-native';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import { colors } from '../../theme/colors';
import logo from '../../assets/logo.png'

export default function LoginScreen({ navigation }) {
    const { width } = useWindowDimensions(); // ширина экрана
    const logoWidth = width < 400 ? width * 0.8 : 400;

    return (
        <ScrollView style={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Image
                    source={logo}
                    style={{ width: logoWidth }}
                    resizeMode="contain"
                />
            </View>

            <Text style={[typography.title, { color: colors.black }, { marginBottom: 15 }]}>
                Добро пожаловать
            </Text>
            <Text style={[typography.body, { color: colors.gray, marginBottom: 20 }]}>
                Войдите, чтобы продолжить
            </Text>

            <View style={styles.inputContainer}>
                <TextInput placeholder="Email" style={[styles.input, typography.body]} />
                <TextInput placeholder="Password" secureTextEntry style={[styles.input, typography.body]} />
            </View>

            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    pressed ? styles.buttonHover : null
                ]}
                onPress={() => navigation.replace('Main')}
            >
                <Text style={styles.buttonText}>Войти</Text>
            </Pressable>
            <View style={styles.registerContainer}>
                <Text style={[{ color: colors.gray }, typography.body]}>Нет аккаунта? </Text>
                <Text style={[typography.body, styles.link]} onPress={() => navigation.navigate('Register')}>
                    Зарегистрироваться
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background
    },

    inputContainer: {
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'column',
        gap: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.grayLight,
        backgroundColor: colors.white,
        color: colors.black,
        placeholderTextColor: colors.gray,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    registerContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
        gap: 10,
        marginBottom: 200,
    },
    button: {
        backgroundColor: colors.main,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonHover: {
        backgroundColor: colors.mainDark,
    },
    buttonText: {
        color: colors.white,
        fontWeight: fontWeights.bold,
        fontSize: fontSizes.medium,
    },
    link: {
        color: colors.main,
        fontWeight: fontWeights.bold,
    },
});