import { Text, StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { palette } from '../../theme/palette';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import { formatValue } from '../../utils/formatValue';
import { formatProcent } from '../../utils/formatProcent';
import BackButton from '../../components/BackButton';
import { useTheme } from '../../theme/ThemeProvider';
import { createCommonStyles } from '../../theme/commonStyles';

export default function StockInfoScreen({ navigation }) {
    const { theme } = useTheme();
    const common = createCommonStyles(theme);
    const s = styles(theme);

    const companyName = 'Apple';
    const companyDescr = 'Apple Inc. — ведущая технологическая компания, специализирующаяся на разработке инновационных продуктов и услуг для потребителей по всему миру.'
    const amount = 2;
    const currentPricePerUnit = 600;
    const previousPricePerUnit = 650;
    const diff = (currentPricePerUnit - previousPricePerUnit) * amount;
    const procents = 100 * currentPricePerUnit / previousPricePerUnit - 100;

    return (
        <View style={{ flex: 1 }}>
            <BackButton navigation={navigation} />

            <ScrollView style={common.container}
                showsVerticalScrollIndicator={false}>
                <View style={common.header}>

                    <Text style={[typography.title, { color: theme.headerText, marginTop: 90, marginBottom: 20 }]}>
                        {companyName}
                    </Text>

                    <View style={[common.block, { flexDirection: 'column', gap: 10 }]}>
                        <Text style={typography.subtitle}>{formatValue(amount * currentPricePerUnit, true)}</Text>
                        <Text style={[typography.body, { color: diff > 0 ? theme.profit : theme.loss, fontWeight: fontWeights.bold }]}>{formatValue(diff, true)} ({formatProcent(procents, true)})</Text>
                        <Text style={{ fontSize: fontSizes.default, color: theme.secondaryText, fontWeight: fontWeights.bold }}>{amount} шт.</Text>
                    </View>
                </View>
                <View style={common.body}>
                    {/* TODO: График акции */}
                    <Text style={[typography.subtitle, { marginBottom: 20 }]}>График</Text>
                    <View style={[common.block, { marginBottom: 50 }]}></View>

                    <Text style={[typography.subtitle, { marginBottom: 20 }]}>О компании</Text>
                    <View style={common.block}>
                        <Text style={[typography.body, { color: theme.secondaryText }]}>{companyDescr}</Text>
                    </View>

                    <View style={s.buttonContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                s.button,
                                { backgroundColor: theme.primary },
                                pressed ? { backgroundColor: theme.primaryDark } : null,

                            ]}
                            onPress={() => navigation.navigate("Buy")}
                        >
                            <Text style={[s.buttonText, { color: theme.headerText }]}>Купить</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                s.button,
                                pressed ? s.buttonHover : null
                            ]}
                            onPress={() => navigation.navigate("Sell")}
                        >
                            <Text style={s.buttonText}>Продать</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = (theme) => StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 20,
        width: '100%',
        left: 0,
        padding: 20,
    },
    button: {
        backgroundColor: theme.surface,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 15,
        alignItems: 'center',
        width: '45%',
        height: 60,
        justifyContent: 'center',
    },
    buttonHover: {
        backgroundColor: theme.hover,
    },
    buttonText: {
        color: theme.primaryText,
        fontWeight: fontWeights.bold,
        fontSize: fontSizes.default,
    },
});