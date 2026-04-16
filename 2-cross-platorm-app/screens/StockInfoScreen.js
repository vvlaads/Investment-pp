import { Text, StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { fontSizes, fontWeights, typography } from '../theme/typography';
import { formatValue } from '../utils/formatValue';
import { formatProcent } from '../utils/formatProcent';
import BackButton from '../components/BackButton';

export default function StockInfoScreen({ navigation }) {
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

            <ScrollView style={styles.container}
                showsVerticalScrollIndicator={false}>
                <View style={styles.header}>

                    <Text style={[typography.title, { color: colors.white, marginTop: 90, marginBottom: 20 }]}>
                        {companyName}
                    </Text>

                    <View style={[styles.block, { flexDirection: 'column', gap: 10 }]}>
                        <Text style={typography.subtitle}>{formatValue(amount * currentPricePerUnit, true)}</Text>
                        <Text style={[typography.body, { color: diff > 0 ? colors.green : colors.red, fontWeight: fontWeights.bold }]}>{formatValue(diff, true)} ({formatProcent(procents, true)})</Text>
                        <Text style={{ fontSize: fontSizes.default, color: colors.gray, fontWeight: fontWeights.bold }}>{amount} шт.</Text>
                    </View>
                </View>
                <View style={styles.body}>
                    {/* TODO: График акции */}
                    <Text style={[typography.subtitle, { marginBottom: 20 }]}>График</Text>
                    <View style={[styles.block, { marginBottom: 50 }]}></View>

                    <Text style={[typography.subtitle, { marginBottom: 20 }]}>О компании</Text>
                    <View style={styles.block}>
                        <Text style={[typography.body, { color: colors.gray }]}>{companyDescr}</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                { backgroundColor: colors.main },
                                pressed ? { backgroundColor: colors.mainDark } : null,

                            ]}
                            onPress={() => navigation.navigate("Sell")}
                        >
                            <Text style={[styles.buttonText, { color: colors.white }]}>Купить</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                pressed ? styles.buttonHover : null
                            ]}
                            onPress={() => navigation.navigate("Sell")}
                        >
                            <Text style={styles.buttonText}>Продать</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: colors.main,
        flex: 1,
        padding: 20,
        paddingBottom: 40,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    body: {
        padding: 20,
        justifyContent: 'top',
        backgroundColor: colors.background,
        paddingBottom: 200,
    },
    block: {
        backgroundColor: colors.white,
        color: colors.black,
        borderRadius: 20,
        padding: 20,
    },
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
        backgroundColor: colors.white,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 15,
        alignItems: 'center',
        width: '45%',
        height: 60,
        justifyContent: 'center',
    },
    buttonHover: {
        backgroundColor: colors.grayLight,
    },
    buttonText: {
        color: colors.black,
        fontWeight: fontWeights.bold,
        fontSize: fontSizes.default,
    },
});