import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { fontSizes, fontWeights, typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { formatValue } from '../utils/formatValue';
import AssetCard from '../components/AssetCard';
import arrow from '../assets/icons/portfolio white.png'

export default function PortfolioScreen() {
    return (
        <ScrollView style={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={[typography.title, { color: colors.white, marginTop: 50, marginBottom: 20 }]}>
                    Портфель
                </Text>

                <View style={[styles.block, { flexDirection: 'column', gap: 10 }]}>
                    <Text style={typography.subtitle}>{formatValue(1200000, true)}</Text>
                    <Text style={[typography.body, { color: colors.green, fontWeight: fontWeights.bold }]}>+{formatValue(100000, true)} (+10%)</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            pressed ? styles.buttonHover : null
                        ]}
                        onPress={() => alert('Click')}
                    >
                        <Text style={styles.buttonText}>Пополнить</Text>
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            pressed ? styles.buttonHover : null
                        ]}
                        onPress={() => alert('Click')}
                    >
                        <Text style={styles.buttonText}>Вывести</Text>
                    </Pressable>
                </View>


            </View>
            <View style={styles.body}>
                <Text style={[typography.subtitle, { marginBottom: 20 }]}>Мои активы</Text>

                <View style={styles.assetsContainer}>
                    <AssetCard companyName={'Apple'} amount={2} pricePerUnit={600} diffPerUnit={10} icon={arrow} />
                    <AssetCard companyName={'Apple'} amount={2} pricePerUnit={600} diffPerUnit={10} icon={arrow} />
                    <AssetCard companyName={'Apple'} amount={2} pricePerUnit={600} diffPerUnit={10} icon={arrow} />
                    <AssetCard companyName={'Apple'} amount={2} pricePerUnit={600} diffPerUnit={10} icon={arrow} />
                    <AssetCard companyName={'Apple'} amount={2} pricePerUnit={600} diffPerUnit={10} icon={arrow} />
                    <AssetCard companyName={'Apple'} amount={2} pricePerUnit={600} diffPerUnit={10} icon={arrow} />
                </View>
            </View>
        </ScrollView>
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
        paddingBottom: 200,
    },
    block: {
        backgroundColor: colors.white,
        color: colors.black,
        borderRadius: 20,
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
    },
    buttonHover: {
        backgroundColor: colors.grayLight,
    },
    buttonText: {
        color: colors.black,
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
});