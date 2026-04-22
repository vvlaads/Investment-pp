import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import { palette } from '../../theme/palette';
import { formatValue } from '../../utils/formatValue';
import { formatPercent } from '../../utils/formatPercent';
import AssetCard from '../../components/AssetCard';
import arrow from '../../assets/icons/white/portfolio.png'
import { useApp } from '../../utils/AppProvider';
import { createCommonStyles } from '../../theme/commonStyles';
import Search from '../../components/Search';
import Option from '../../components/Option';
import { FilterType } from '../../utils/FilterType';
import { useEffect, useState } from 'react';
import { usePortfolio } from '../../hooks/usePortfolio';
import LoadPage from '../../components/LoadPage';

const icons = {
    plus: {
        light: require('../../assets/icons/black/Plus-circle.png'),
        dark: require('../../assets/icons/white/Plus-circle.png')
    },
    send: {
        light: require('../../assets/icons/black/Send.png'),
        dark: require('../../assets/icons/white/Send.png')
    },
};

export default function PortfolioScreen({ navigation }) {
    const { assets, loading } = usePortfolio();
    const [filteredAssets, setFilteredAssets] = useState([]);

    const { isDark, theme } = useApp();
    const common = createCommonStyles(theme);
    const s = styles(theme);
    const [activeFilter, setActiveFilter] = useState(FilterType.ALL);

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

    const total = assets.reduce(
        (sum, asset) => sum + asset.company.currentPrice * asset.amount,
        0
    );

    const prev = assets.reduce(
        (sum, asset) => sum + asset.buyPrice * asset.amount,
        0
    );

    useEffect(() => {
        setFilteredAssets(assets);
    }, [assets]);

    if (loading) return (<LoadPage />);
    const diff = total - prev;
    const percent = 100 * diff / prev;
    const isProfit = diff > 0;
    return (
        <ScrollView style={common.container}
            showsVerticalScrollIndicator={false}>
            <View style={common.header}>
                <Text style={[typography.title, { color: theme.headerText, marginTop: 50, marginBottom: 20 }]}>
                    Портфель
                </Text>

                <View style={[common.block, { flexDirection: 'column', gap: 10 }]}>
                    <Text style={[typography.subtitle, { color: theme.primaryText }]}>
                        {formatValue(total, true)}
                    </Text>
                    <Text style={[typography.body, { color: isProfit ? theme.profit : theme.loss, fontWeight: fontWeights.bold }]}>
                        {formatValue(diff, true, true)} ({formatPercent(percent, true, true)})
                    </Text>
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
                            source={icons.plus[isDark ? 'dark' : 'light']}
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
                            source={icons.send[isDark ? 'dark' : 'light']}
                        />
                        <Text style={s.buttonText}>Вывести</Text>
                    </Pressable>
                </View>


            </View>
            <View style={common.body}>
                <Search
                    style={common.search}
                    onSearch={(text) => handleSearch(text)}
                />

                <Text style={common.sectionName}>Мои активы</Text>

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
    button: {
        backgroundColor: theme.surface,
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