import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import { palette } from '../../theme/palette';
import LinkButton from '../../components/LinkButton';
import card from '../../assets/icons/blue/Credit-card.png'
import send from '../../assets/icons/blue/Send.png'
import settings from '../../assets/icons/blue/Settings.png'
import notification from '../../assets/icons/blue/Bell.png'
import help from '../../assets/icons/blue/Help-circle.png'
import logOut from '../../assets/icons/red/Log-out.png'
import { useApp } from '../../utils/AppProvider';
import { createCommonStyles } from '../../theme/commonStyles';

export default function ProfileScreen({ navigation }) {
    const { theme } = useApp();
    const common = createCommonStyles(theme);
    const s = styles(theme);

    return (
        <ScrollView style={common.container}
            showsVerticalScrollIndicator={false}>
            <View style={common.header}>
                <Text style={[typography.title, { color: theme.headerText, marginTop: 50, marginBottom: 20 }]}>
                    Иванов Алексей Владимирович
                </Text>

                <View style={s.statisticsContainer}>
                    <View style={[common.block, s.statBlock]}>
                        <Text style={[typography.subtitle, { color: theme.primary }]}>1.2М ₽</Text>
                        <Text style={[typography.body, { color: theme.secondaryText }]}>Портфель</Text>
                    </View>

                    <View style={[common.block, s.statBlock]}>
                        <Text style={[typography.subtitle, { color: theme.profit }]}>+4.2%</Text>
                        <Text style={[typography.body, { color: theme.secondaryText }]}>Доход</Text>
                    </View>
                </View>


            </View>


            <View style={common.body}>
                <Text style={common.sectionName}>Операции</Text>

                <View style={s.optionContainer}>
                    <LinkButton label={'Пополнить'} description={'Пополнить счет'} icon={card} pageName={'Deposit'} navigation={navigation} />
                    <LinkButton label={'Вывести'} description={'Перевод на другой счет'} icon={send} pageName={'Withdraw'} navigation={navigation} />
                </View>

                <Text style={common.sectionName}>Настройки</Text>

                <View style={s.optionContainer}>
                    <LinkButton label={'Настройки'} description={'Персонализация приложения'} icon={settings} pageName={'Settings'} navigation={navigation} />
                    <LinkButton label={'Уведомления'} description={'Управление уведомлениями'} icon={notification} pageName={'NotificationSettings'} navigation={navigation} />
                    <LinkButton label={'Помощь'} description={'Центр поддержки'} icon={help} pageName={'Portfolio'} navigation={navigation} />
                </View>

                <Pressable
                    style={({ pressed }) => [
                        s.button,
                        pressed ? s.buttonHover : null
                    ]}
                    onPress={() => navigation.replace('Login')}
                >
                    <Image
                        style={{ width: 24, height: 24 }}
                        source={logOut}
                    />
                    <Text style={s.buttonText}>Выйти из аккаунта</Text>
                </Pressable>
            </View>
        </ ScrollView>
    );
}

const styles = (theme) => StyleSheet.create({
    statisticsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    statBlock: {
        width: '45%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionContainer: {
        flexDirection: 'column',
        gap: 20,
        marginBottom: 50,
    },
    button: {
        backgroundColor: theme.surface,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: theme.danger,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    buttonHover: {
        backgroundColor: theme.border,
    },
    buttonText: {
        color: theme.danger,
        fontWeight: fontWeights.default,
        fontSize: fontSizes.medium,
    },
});