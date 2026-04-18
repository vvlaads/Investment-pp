import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { typography } from '../../theme/typography';
import { palette } from '../../theme/palette';
import AssetCard from '../../components/AssetCard';
import arrow from '../../assets/icons/white/portfolio.png'
import { useApp } from '../../utils/AppProvider';
import { createCommonStyles } from '../../theme/commonStyles';
import Search from '../../components/Search';
export default function MarketScreen({ navigation }) {
    const { theme } = useApp();
    const common = createCommonStyles(theme);

    return (
        <ScrollView style={common.container}
            showsVerticalScrollIndicator={false}>
            <View style={common.header}>
                <Text style={[typography.title, { color: theme.headerText, marginTop: 50, marginBottom: 20 }]}>
                    Рынок
                </Text>
            </View>


            <View style={common.body}>
                <Search
                    style={common.search}
                    onSearch={(text) => {
                        console.log("Ищем", text);
                    }}
                />

                <Text style={common.sectionName}>Выгодные предложения</Text>

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
    assetsContainer: {
        flexDirection: 'column',
        gap: 10,
    },
});