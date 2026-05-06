import { Text, StyleSheet, ScrollView, View, Pressable, Dimensions } from 'react-native';
import { palette } from '../../theme/palette';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import { formatValue } from '../../utils/formatValue';
import { formatPercent } from '../../utils/formatPercent';
import BackButton from '../../components/BackButton';
import { useApp } from '../../utils/AppProvider';
import { createCommonStyles } from '../../theme/commonStyles';
import Option from '../../components/Option';
import { useState } from 'react';
import { GraphType } from '../../utils/GraphType';
import StockChart from '../../components/StockChart';

export default function StockInfoScreen({ navigation }) {
    const { theme } = useApp();
    const common = createCommonStyles(theme);
    const s = styles(theme);

    const screenWidth = Dimensions.get('window').width;

    const companyName = 'Apple';
    const companyDescr = 'Apple Inc. — ведущая технологическая компания, специализирующаяся на разработке инновационных продуктов и услуг для потребителей по всему миру.'
    const amount = 2;
    const currentPricePerUnit = 600;
    const previousPricePerUnit = 650;
    const diff = (currentPricePerUnit - previousPricePerUnit) * amount;
    const procents = 100 * currentPricePerUnit / previousPricePerUnit - 100;

    const [graphType, setGraphType] = useState(GraphType.DAY);
    const selectGraphType = (type) => {
        setGraphType(type);
        console.log('Выбрано', type);
    }

    const blockSize = screenWidth - common.body.padding * 2;
    const chartBlockPadding = 10;
    const stockData = {
        hour: {
            labels: ['12:00', '12:10', '12:20', '12:30', '12:40', '12:50', '13:00'],
            datasets: [{ data: [22.56, 22.80, 22.81, 22.80, 22.75, 22.79] }],
        },

        day: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
            datasets: [{
                data: [23.78, 24.54, 23.59, 24.01, 24.77, 25.06, 24.68]
            }],
        },

        month: {
            labels: ['1', '5', '10', '15', '20', '25', '30'],
            datasets: [{ data: [23.56, 24.80, 25.6, 23.20, 22.7, 23.79] }],
        },

        year: {
            labels: ['Янв', 'Март', 'Июнь', 'Сент', 'Дек'],
            datasets: [{ data: [22.56, 24.89, 29.34, 26.56, 22.5] }],
        }
    };

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
                        <Text style={[typography.subtitle, { color: theme.primaryText }]}>{formatValue(amount * currentPricePerUnit, true)}</Text>
                        <Text style={[typography.body, { color: diff > 0 ? theme.profit : theme.loss, fontWeight: fontWeights.bold }]}>{formatValue(diff, true)} ({formatPercent(procents, true)})</Text>
                        <Text style={{ fontSize: fontSizes.default, color: theme.secondaryText, fontWeight: fontWeights.bold }}>{amount} шт.</Text>
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