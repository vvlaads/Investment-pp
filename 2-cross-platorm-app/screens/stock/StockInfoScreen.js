import { Text, StyleSheet, ScrollView, View, Pressable, Dimensions } from 'react-native';
import { palette } from '../../theme/palette';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import { formatValue } from '../../utils/formatValue';
import { formatPercent } from '../../utils/formatPercent';
import BackButton from '../../components/BackButton';
import { useApp } from '../../utils/AppProvider';
import { createCommonStyles } from '../../theme/commonStyles';
import Option from '../../components/Option';
import { useEffect, useState } from 'react';
import { GraphType } from '../../utils/GraphType';
import StockChart from '../../components/StockChart';
import LoadPage from '../../components/LoadPage';
import { getStockInfoApi } from '../../api/stocks.api';

export default function StockInfoScreen({ navigation, route }) {
    const { ticker } = route.params;

    const [loading, setLoading] = useState(true);
    const [stock, setStock] = useState(null);

    const { theme } = useApp();
    const common = createCommonStyles(theme);
    const s = styles(theme);

    const screenWidth = Dimensions.get('window').width;
    const blockSize = screenWidth - common.body.padding * 2;
    const chartBlockPadding = 10;

    const [graphType, setGraphType] = useState(GraphType.DAY);
    const selectGraphType = (type) => {
        setGraphType(type);
        console.log('Выбрано', type);
    }

    const getStockData = () => {
        switch (graphType) {
            case GraphType.HOUR:
                return stockData.hour;
            case GraphType.DAY:
                return stockData.day;
            case GraphType.MONTH:
                return stockData.month;
            case GraphType.YEAR:
                return stockData.year;
            default:
                return stockData.day;
        }
    }

    useEffect(() => {
        async function loadStock() {
            try {
                const data = await getStockInfoApi(ticker);
                setStock(data);
            } finally {
                setLoading(false);
            }
        }

        loadStock();
    }, [ticker]);

    if (loading) return (<LoadPage />)

    const companyName = stock.name;
    const companyDescr = stock.description;
    const quantity = stock.quantity;
    const currentPrice = stock.currentPrice;
    const avgPurchasePrice = stock.avgPurchasePrice;
    const stockData = stock.history;

    const diff = (currentPrice - avgPurchasePrice) * quantity;
    const procents = avgPurchasePrice ?
        ((currentPrice - avgPurchasePrice) / avgPurchasePrice) * 100
        : 0;

    return (
        <View style={{ flex: 1 }}>
            <BackButton navigation={navigation} />

            <ScrollView style={common.container}
                showsVerticalScrollIndicator={false}>
                <View style={common.header}>

                    <Text style={[typography.title, s.title]}>
                        {companyName}
                    </Text>

                    <View style={[common.block, { flexDirection: 'column', gap: 10 }]}>
                        <Text style={[typography.subtitle, { color: theme.primaryText }]}>{formatValue(quantity * currentPrice, true)}</Text>
                        <Text style={[typography.body, { color: diff > 0 ? theme.profit : theme.loss, fontWeight: fontWeights.bold }]}>{formatValue(diff, true)} ({formatPercent(procents, true)})</Text>
                        <Text style={{ fontSize: fontSizes.default, color: theme.secondaryText, fontWeight: fontWeights.bold }}>{quantity} шт.</Text>
                    </View>
                </View>
                <View style={common.body}>
                    <Text style={common.sectionName}>График</Text>

                    <View style={common.filterContainer}>
                        <Option description={'Час'} value={graphType === GraphType.HOUR} onClick={() => selectGraphType(GraphType.HOUR)} />
                        <Option description={'День'} value={graphType === GraphType.DAY} onClick={() => selectGraphType(GraphType.DAY)} />
                        <Option description={'Месяц'} value={graphType === GraphType.MONTH} onClick={() => selectGraphType(GraphType.MONTH)} />
                        <Option description={'Год'} value={graphType === GraphType.YEAR} onClick={() => selectGraphType(GraphType.YEAR)} />
                    </View>

                    <View style={[common.block, { padding: chartBlockPadding, height: blockSize }]}>
                        <StockChart
                            width={blockSize - chartBlockPadding * 2}
                            height={blockSize - chartBlockPadding * 2}
                            data={getStockData()} />
                    </View>

                    <Text style={common.sectionName}>О компании</Text>
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
                            onPress={() => navigation.navigate("Buy", { ticker })}
                        >
                            <Text style={[s.buttonText, { color: theme.headerText }]}>Купить</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                s.button,
                                pressed ? s.buttonHover : null
                            ]}
                            onPress={() => navigation.navigate("Sell", { ticker })}
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
    title: {
        color: theme.headerText,
        marginTop: 90,
        marginBottom: 20,
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