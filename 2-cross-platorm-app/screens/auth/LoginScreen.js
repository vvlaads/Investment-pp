import { View, Text, TextInput, StyleSheet, Pressable, Image, useWindowDimensions, ScrollView, ActivityIndicator } from 'react-native';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import logo from '../../assets/logo.png'
import { useApp } from '../../utils/AppProvider';
import { useState } from 'react';
import { loginUser } from '../../api/auth.api';

export default function LoginScreen({ navigation }) {
    const { theme } = useApp();
    const s = styles(theme);

    const { width } = useWindowDimensions();
    const logoWidth = width < 400 ? width * 0.8 : 400;


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};

        // Проверка Email
        if (!email.trim()) {
            newErrors.email = 'Введите email';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Неверный формат email';
        }

        // Проверка пароля
        if (!password.trim()) {
            newErrors.password = 'Введите пароль';
        } else if (password.length < 6) {
            newErrors.password = 'Пароль минимум 6 символов';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleLogin = async () => {
        if (!validate()) return;

        try {
            setLoading(true);
            setErrors({});

            const response = await loginUser(email, password);

            console.log('Login success:', response);
            navigation.replace('Main');
        } catch (error) {
            console.log(error);
            setErrors({
                global: 'Ошибка входа. Попробуйте снова'
            });
        } finally {
            setLoading(false);
        }
    }

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
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {errors.email &&
                    <Text style={s.error}>{errors.email}</Text>}

                <TextInput
                    placeholder="Password"
                    placeholderTextColor={theme.secondaryText}
                    secureTextEntry
                    style={[s.input, typography.body]}
                    value={password}
                    onChangeText={setPassword}
                />
                {errors.password &&
                    (<Text style={s.error}>{errors.password}</Text>)}
            </View>

            {errors.global && (
                <Text style={[s.error, { textAlign: 'center', marginBottom: 10 }]}>
                    {errors.global}
                </Text>
            )}

            <Pressable
                style={({ pressed }) => [
                    s.button,
                    pressed && s.buttonHover,
                    loading && { opacity: 0.7 }
                ]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={theme.surface} />
                ) : (
                    <Text style={s.buttonText}>Войти</Text>
                )}
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
        color: theme.alternativeText,
        fontWeight: fontWeights.bold,
        fontSize: fontSizes.medium,
    },

    link: {
        color: theme.primary,
        fontWeight: fontWeights.bold,
    },
    error: {
        fontSize: fontSizes.default,
        color: theme.error,
    },
});