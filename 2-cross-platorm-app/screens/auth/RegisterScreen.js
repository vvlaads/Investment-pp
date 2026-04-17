import { View, Text, TextInput, StyleSheet, Pressable, Image, useWindowDimensions, ScrollView } from 'react-native';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import { palette } from '../../theme/palette';
import logo from '../../assets/logo.png'
import { useTheme } from '../../theme/ThemeProvider';

export default function RegisterScreen({ navigation }) {
    const { theme } = useTheme();
    const s = styles(theme);

    const { width } = useWindowDimensions(); // ширина экрана
    const logoWidth = width < 400 ? width * 0.8 : 400;

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
                <TextInput placeholder="Фамилия" style={[s.input, typography.body]} />
                <TextInput placeholder="Имя" style={[s.input, typography.body]} />
                <TextInput placeholder="Отчество" style={[s.input, typography.body]} />
                <TextInput placeholder="Email" style={[s.input, typography.body]} />
                <TextInput placeholder="Password" secureTextEntry style={[s.input, typography.body]} />
                <TextInput placeholder="Password" secureTextEntry style={[s.input, typography.body]} />
            </View>

            <Pressable
                style={({ pressed }) => [
                    s.button,
                    pressed ? s.buttonHover : null
                ]}
                onPress={() => navigation.replace('Main')}
            >
                <Text style={s.buttonText}>Зарегистрироваться</Text>
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
});