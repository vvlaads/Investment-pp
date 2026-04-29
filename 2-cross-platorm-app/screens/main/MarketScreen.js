import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import { palette } from '../../theme/palette';
import AssetCard from '../../components/AssetCard';
import arrow from '../../assets/icons/white/portfolio.png'
import { useApp } from '../../utils/AppProvider';
import { createCommonStyles } from '../../theme/commonStyles';
import Search from '../../components/Search';
import { useEffect, useState } from 'react';
import { FilterType } from '../../utils/FilterType';
import Option from '../../components/Option';
import { usePortfolio } from '../../hooks/usePortfolio';
import LoadPage from '../../components/LoadPage';

export default function MarketScreen({ navigation }) {
    const { assets, loading } = usePortfolio();
    const { theme } = useApp();
    const common = createCommonStyles(theme);
    const [activeFilter, setActiveFilter] = useState(FilterType.ALL);
    const [filteredAssets, setFilteredAssets] = useState([]);
    const s = styles(theme);

    const selectFilter = (type) => {
        setActiveFilter(type);
        console.log('Выбрано', type);
    }

    const handleSearch = (text) => {
        const filtered = assets.filter(asset =>
            asset.company.name.toLowerCase().includes(text.toLowerCase())
        );

        setFilteredAssets(filtered);
    };


    useEffect(() => {
        setFilteredAssets(assets);
    }, [assets]);

    if (loading) return (<LoadPage />);

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
                    onSearch={(text) => handleSearch(text)}
                />

                <Text style={common.sectionName}>Выгодные предложения</Text>

                <View style={common.filterContainer}>
                    <Option description={'Все'} value={FilterType.ALL === activeFilter} onClick={() => selectFilter(FilterType.ALL)} />
                    <Option description={'Акции'} value={FilterType.STOCKS === activeFilter} onClick={() => selectFilter(FilterType.STOCKS)} />
                    <Option description={'Облигации'} value={FilterType.BONDS === activeFilter} onClick={() => selectFilter(FilterType.BONDS)} />
                </View>

                <View style={s.assetsContainer}>
                    {filteredAssets.length > 0 ?
                        filteredAssets.map((asset) => (
                            <AssetCard
                                key={asset.id}
                                company={asset.company}
                                amount={asset.amount}
                                buyPrice={asset.buyPrice}
                                icon={arrow}
                                onPress={() => navigation.navigate('StockInfo')} />
                        ))
                        :
                        (
                            <View style={s.emptyBlock}>
                                <Text style={s.emptyBlockText}>
                                    Не найдено
                                </Text>
                            </View>
                        )
                    }

                </View>
            </View>
        </ScrollView>
    );
}

const styles = (theme) => StyleSheet.create({
    assetsContainer: {
        flexDirection: 'column',
        gap: 10,
    },
    emptyBlock: {
        backgroundColor: theme.hover,
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderColor: theme.border,
        borderStyle: 'dashed',
        borderWidth: 3,
    },

    emptyBlockText: {
        color: theme.secondaryText,
        fontSize: fontSizes.medium,
        fontWeight: fontWeights.bold,
    },
});