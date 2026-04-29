import { View, Text, TextInput, StyleSheet, Pressable, Image, useWindowDimensions, ScrollView, ActivityIndicator } from 'react-native';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import { palette } from '../../theme/palette';
import logo from '../../assets/logo.png'
import { useApp } from '../../utils/AppProvider';
import { useState } from 'react';
import { registerUser } from '../../api/auth.api';

export default function RegisterScreen({ navigation }) {
    const { theme } = useApp();
    const s = styles(theme);

    const { width } = useWindowDimensions(); // ширина экрана
    const logoWidth = width < 400 ? width * 0.8 : 400;


    const [surname, setSurname] = useState('');
    const [firstName, setFirstName] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const nameRegex = /^[A-Za-zА-Яа-яЁё]+$/;

    const validate = () => {
        const newErrors = {};

        if (!surname.trim()) {
            newErrors.surname = 'Введите фамилию';
        } else if (!nameRegex.test(surname)) {
            newErrors.surname = 'Только буквы';
        }

        if (!firstName.trim()) {
            newErrors.firstName = 'Введите имя';
        } else if (!nameRegex.test(firstName)) {
            newErrors.firstName = 'Только буквы';
        }

        if (!patronymic.trim()) {
            newErrors.patronymic = 'Введите отчество';
        } else if (!nameRegex.test(patronymic)) {
            newErrors.patronymic = 'Только буквы';
        }

        if (!email.trim()) {
            newErrors.email = 'Введите email';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Неверный email';
        }

        if (!password.trim()) {
            newErrors.password = 'Введите пароль';
        } else if (password.length < 6) {
            newErrors.password = 'Минимум 6 символов';
        }

        if (!rePassword.trim()) {
            newErrors.rePassword = 'Повторите пароль';
        } else if (password !== rePassword) {
            newErrors.rePassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async () => {
        if (!validate()) return;

        try {
            setLoading(true);
            setErrors({});

            const response = await registerUser({
                surname,
                firstName,
                patronymic,
                email,
                password,
            });

            console.log('Register success:', response);
            navigation.replace('Main');
        } catch (error) {
            console.log(error);
            setErrors({
                global: error.message || 'Ошибка регистрации',
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView style={s.container}
            showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Image
                    source={logo}
                    style={{ width: logoWidth }}
                    resizeMode="contain"
                />
            </View>

            <Text style={[typography.title, s.title]}>
                Регистрация аккаунта
            </Text>

            <View style={s.inputContainer}>
                <TextInput
                    placeholder="Фамилия"
                    style={[s.input, typography.body]}
                    value={surname}
                    onChangeText={setSurname}
                />
                {errors.surname && <Text style={s.error}>{errors.surname}</Text>}

                <TextInput
                    placeholder="Имя"
                    style={[s.input, typography.body]}
                    value={firstName}
                    onChangeText={setFirstName}
                />
                {errors.firstName && <Text style={s.error}>{errors.firstName}</Text>}

                <TextInput
                    placeholder="Отчество"
                    style={[s.input, typography.body]}
                    value={patronymic}
                    onChangeText={setPatronymic}
                />
                {errors.patronymic && <Text style={s.error}>{errors.patronymic}</Text>}

                <TextInput
                    placeholder="Email"
                    style={[s.input, typography.body]}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {errors.email && <Text style={s.error}>{errors.email}</Text>}

                <TextInput
                    placeholder="Пароль"
                    secureTextEntry
                    style={[s.input, typography.body]}
                    value={password}
                    onChangeText={setPassword}
                />
                {errors.password && <Text style={s.error}>{errors.password}</Text>}

                <TextInput
                    placeholder="Повторите пароль"
                    secureTextEntry
                    style={[s.input, typography.body]}
                    value={rePassword}
                    onChangeText={setRePassword}
                />
                {errors.rePassword && (
                    <Text style={s.error}>{errors.rePassword}</Text>
                )}
            </View>

            {errors.global && (
                <Text style={[s.error, { textAlign: 'center', marginBottom: 10 }]}>
                    {errors.global}
                </Text>
            )}

            <Pressable
                style={({ pressed }) => [
                    s.button,
                    pressed ? s.buttonHover : null,
                    loading && { opacity: 0.7 }
                ]}
                onPress={handleSignUp}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={theme.surface} />
                ) : (
                    <Text style={s.buttonText}>Зарегистрироваться</Text>
                )}
            </Pressable>
            <View style={s.loginContainer}>
                <Text style={[typography.body, { color: theme.secondaryText }]}>
                    Уже есть аккаунт?
                </Text>
                <Text style={[typography.body, s.link]} onPress={() => navigation.navigate('Login')}>
                    Войти
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

    inputContainer: {
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'column',
        gap: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.surface,
        color: theme.primaryText,
        placeholderTextColor: theme.secondaryText,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    loginContainer: {
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
        color: '#fff',
        fontWeight: fontWeights.bold,
        fontSize: fontSizes.medium,
    },
    link: {
        color: theme.primary,
        fontWeight: fontWeights.bold,
    },
    error: {
        color: theme.error,
        fontSize: fontSizes.default,
        marginBottom: 4,
    },
});