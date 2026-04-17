import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import { palette } from '../../theme/palette';
import { formatValue } from '../../utils/formatValue';
import AssetCard from '../../components/AssetCard';
import arrow from '../../assets/icons/white/portfolio.png'
import plus from '../../assets/icons/black/Plus-circle.png'
import send from '../../assets/icons/black/Send.png'
import { useTheme } from '../../theme/ThemeProvider';
import { createCommonStyles } from '../../theme/commonStyles';

export default function PortfolioScreen({ navigation }) {
    const { theme } = useTheme();
    const common = createCommonStyles(theme);
    const s = styles(theme);

    return (
        <ScrollView style={common.container}
            showsVerticalScrollIndicator={false}>
            <View style={common.header}>
                <Text style={[typography.title, { color: theme.headerText, marginTop: 50, marginBottom: 20 }]}>
                    Портфель
                </Text>

                <View style={[common.block, { flexDirection: 'column', gap: 10 }]}>
                    <Text style={typography.subtitle}>{formatValue(1200000, true)}</Text>
                    <Text style={[typography.body, { color: palette.green, fontWeight: fontWeights.bold }]}>+{formatValue(100000, true)} (+10%)</Text>
                </View>

                <View style={s.buttonContainer}>
                    <Pressable
                        style={({ pressed }) => [
                            s.button,
                            pressed ? s.buttonHover : null
                        ]}
                        onPress={() => navigation.navigate('Deposit')}
                    >
                        <Image
                            style={s.icon}
                            source={plus}
                        />
                        <Text style={s.buttonText}>Пополнить</Text>
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            s.button,
                            pressed ? s.buttonHover : null
                        ]}
                        onPress={() => navigation.navigate('Withdraw')}
                    >
                        <Image
                            style={s.icon}
                            source={send}
                        />
                        <Text style={s.buttonText}>Вывести</Text>
                    </Pressable>
                </View>


            </View>
            <View style={common.body}>
                <Text style={[typography.subtitle, { marginBottom: 20 }]}>Мои активы</Text>

                <View style={s.assetsContainer}>
                    <AssetCard companyName={'Apple'} amount={2} pricePerUnit={600} diffPerUnit={10} icon={arrow} navigation={navigation} />
                    <AssetCard companyName={'Apple'} amount={2} pricePerUnit={600} diffPerUnit={10} icon={arrow} navigation={navigation} />
                    <AssetCard companyName={'Apple'} amount={2} pricePerUnit={600} diffPerUnit={10} icon={arrow} navigation={navigation} />
                    <AssetCard companyName={'Apple'} amount={2} pricePerUnit={600} diffPerUnit={10} icon={arrow} navigation={navigation} />
                    <AssetCard companyName={'Apple'} amount={2} pricePerUnit={600} diffPerUnit={10} icon={arrow} navigation={navigation} />
                    <AssetCard companyName={'Apple'} amount={2} pricePerUnit={600} diffPerUnit={10} icon={arrow} navigation={navigation} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = (theme) => StyleSheet.create({
    button: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 15,
        alignItems: 'center',
        width: '45%',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    buttonHover: {
        backgroundColor: theme.hover,
    },
    buttonText: {
        color: theme.primaryText,
        fontWeight: fontWeights.bold,
        fontSize: fontSizes.default,
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    assetsContainer: {
        flexDirection: 'column',
        gap: 10,
    },
    icon: {
        width: 24,
        height: 24,
    },
});