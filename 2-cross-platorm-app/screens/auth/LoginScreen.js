import { View, Text, TextInput, StyleSheet, Pressable, Image, useWindowDimensions, ScrollView } from 'react-native';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import logo from '../../assets/logo.png'
import { useTheme } from '../../theme/ThemeProvider';

export default function LoginScreen({ navigation }) {
    const { theme } = useTheme();
    const s = styles(theme);

    const { width } = useWindowDimensions();
    const logoWidth = width < 400 ? width * 0.8 : 400;

    return (
        <ScrollView
            style={s.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Image
                    source={logo}
                    style={{ width: logoWidth }}
                    resizeMode="contain"
                />
            </View>

            <Text style={[typography.title, s.title]}>
                Добро пожаловать
            </Text>

            <Text style={[typography.body, s.subtitle]}>
                Войдите, чтобы продолжить
            </Text>

            <View style={s.inputContainer}>
                <TextInput
                    placeholder="Email"
                    placeholderTextColor={theme.secondaryText}
                    style={[s.input, typography.body]}
                />
                <TextInput
                    placeholder="Password"
                    placeholderTextColor={theme.secondaryText}
                    secureTextEntry
                    style={[s.input, typography.body]}
                />
            </View>

            <Pressable
                style={({ pressed }) => [
                    s.button,
                    pressed && s.buttonHover
                ]}
                onPress={() => navigation.replace('Main')}
            >
                <Text style={s.buttonText}>Войти</Text>
            </Pressable>

            <View style={s.registerContainer}>
                <Text style={[typography.body, { color: theme.secondaryText }]}>
                    Нет аккаунта?
                </Text>

                <Text
                    style={[typography.body, s.link]}
                    onPress={() => navigation.navigate('Register')}
                >
                    Зарегистрироваться
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.background,
    },

    title: {
        color: theme.primaryText,
        marginBottom: 15,
    },

    subtitle: {
        color: theme.secondaryText,
        marginBottom: 20,
    },

    inputContainer: {
        marginTop: 20,
        marginBottom: 20,
        gap: 10,
    },

    input: {
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.surface,
        color: theme.primaryText,
        borderRadius: 8,
        padding: 10,
    },

    registerContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
        gap: 10,
        marginBottom: 200,
    },

    button: {
        backgroundColor: theme.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 15,
        alignItems: 'center',
    },

    buttonHover: {
        backgroundColor: theme.primaryDark,
    },

    buttonText: {
        color: '#fff', // 👈 обычно фиксированный
        fontWeight: fontWeights.bold,
        fontSize: fontSizes.medium,
    },

    link: {
        color: theme.primary,
        fontWeight: fontWeights.bold,
    },
});