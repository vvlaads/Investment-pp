import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import AssetCard from '../components/AssetCard';
import arrow from '../assets/icons/white/portfolio.png'
export default function MarketScreen({ navigation }) {
    return (
        <ScrollView style={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={[typography.title, { color: colors.white, marginTop: 50, marginBottom: 20 }]}>
                    Рынок
                </Text>
            </View>


            <View style={styles.body}>
                <Text style={[typography.subtitle, { marginBottom: 20 }]}>Выгодные предложения</Text>

                <View style={styles.assetsContainer}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: colors.main,
        height: 160,
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
    assetsContainer: {
        flexDirection: 'column',
        gap: 10,
    },
});