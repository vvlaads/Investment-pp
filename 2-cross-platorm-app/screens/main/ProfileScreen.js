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
import { useEffect, useState } from 'react';
import LoadPage from '../../components/LoadPage';
import { getUserInfoApi, getUserStocksApi } from '../../api/users.api';
import { formatValue } from '../../utils/formatValue';
import { formatPercent } from '../../utils/formatPercent';

export default function ProfileScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [totalSum, setTotalSum] = useState(0);
    const [percent, setPercent] = useState(0);
    const [surname, setSurname] = useState('');
    const [firstName, setFirstName] = useState('');
    const [patronymic, setPatronymic] = useState('');

    const { theme } = useApp();
    const common = createCommonStyles(theme);
    const s = styles(theme);

    useEffect(() => {
        async function loadInfo() {
            try {
                const data = await getUserStocksApi();
                const assetsSum = data.reduce(
                    (sum, asset) => sum + asset.currentPrice * asset.quantity,
                    0
                )
                const purchaseSum = data.reduce(
                    (sum, asset) => sum + asset.avgPurchasePrice * asset.quantity,
                    0
                )
                const diff = assetsSum - purchaseSum;

                setTotalSum(assetsSum);
                setPercent(100 * diff / purchaseSum);

                const userInfo = await getUserInfoApi();

                setSurname(userInfo.surname);
                setFirstName(userInfo.firstName);
                setPatronymic(userInfo.patronymic);
            } finally {
                setLoading(false);
            }
        }

        loadInfo();
    }, []);

    if (loading) return (<LoadPage />);

    return (
        <ScrollView style={common.container}
            showsVerticalScrollIndicator={false}>
            <View style={common.header}>
                <Text style={[typography.title, { color: theme.headerText, marginTop: 50, marginBottom: 20 }]}>
                    {surname} {firstName} {patronymic}
                </Text>

                <View style={s.statisticsContainer}>
                    <View style={[common.block, s.statBlock]}>
                        <Text style={[typography.subtitle, { color: theme.primary }]}>{formatValue(totalSum, true)}</Text>
                        <Text style={[typography.body, { color: theme.secondaryText }]}>Портфель</Text>
                    </View>

                    <View style={[common.block, s.statBlock]}>
                        <Text style={[typography.subtitle, { color: theme.profit }]}>{formatPercent(percent, true, true)}</Text>
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
                    <LinkButton label={'Помощь'} description={'Центр поддержки'} icon={help} pageName={'Help'} navigation={navigation} />
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