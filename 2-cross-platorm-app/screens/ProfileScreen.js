import { View, Text, StyleSheet, Pressable } from 'react-native';
import { fontSizes, fontWeights, typography } from '../theme/typography';
import { colors } from '../theme/colors';
import LinkButton from '../components/LinkButton';
import arrow from '../assets/icons/portfolio white.png'

export default function ProfileScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[typography.title, { color: colors.white, marginTop: 50, marginBottom: 20 }]}>
                    Иванов Алексей Владимирович
                </Text>

                <View style={styles.statisticsContainer}>
                    <View style={styles.block}>
                        <Text style={[typography.subtitle, { color: colors.main }]}>1.2М ₽</Text>
                        <Text style={[typography.body, { color: colors.gray }]}>Портфель</Text>
                    </View>

                    <View style={styles.block}>
                        <Text style={[typography.subtitle, { color: colors.green }]}>+4.2%</Text>
                        <Text style={[typography.body, { color: colors.gray }]}>Доход</Text>
                    </View>
                </View>


            </View>
            <View style={styles.body}>
                <Text style={typography.subtitle}>Операции</Text>
                <View style={styles.optionContainer}>
                    <LinkButton label={'Пополнить'} description={'Пополнить счет'} icon={arrow} />
                </View>

                <Text style={typography.subtitle}>Настройки</Text>
                <View style={styles.optionContainer}>

                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed ? styles.buttonHover : null
                    ]}
                    onPress={() => navigation.replace('Login')}
                >
                    <Text style={styles.buttonText}>Выйти из аккаунта</Text>
                </Pressable>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: colors.main,
        height: 350,
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    body: {
        padding: 20,
        justifyContent: 'top',
        backgroundColor: colors.background,
    },
    block: {
        backgroundColor: colors.white,
        color: colors.black,
        borderRadius: 20,
        padding: 20,
        width: '45%',
        alignItems: 'center',
        gap: 10
    },
    statisticsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    optionContainer: {},
    button: {
        backgroundColor: colors.white,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.red,
        alignItems: 'center',
    },
    buttonHover: {
        backgroundColor: colors.grayLight,
    },
    buttonText: {
        color: colors.red,
        fontWeight: fontWeights.default,
        fontSize: fontSizes.medium,
    },
});