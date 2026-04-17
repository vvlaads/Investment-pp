import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import { palette } from '../../theme/palette';
import { PieChart } from '../../components/PieChart';
import Svg, { Circle } from 'react-native-svg';
import { formatValue } from '../../utils/formatValue';
import { useTheme } from '../../theme/ThemeProvider';
import { createCommonStyles } from '../../theme/commonStyles';

export default function AnalyticsScreen() {
    const { theme } = useTheme();
    const common = createCommonStyles(theme);
    const s = styles(theme);

    const { width } = useWindowDimensions(); // ширина экрана
    const blockSize = width * 0.9;

    const stocks = 500
    const bonds = 300
    const gold = 200
    const total = stocks + bonds + gold

    const chartData = [
        {
            name: 'Акции',
            color: palette.purple,
            value: stocks,
        },
        {
            name: 'Облигации',
            color: palette.pink,
            value: bonds,
        },
        {
            name: 'Золото',
            color: palette.orange,
            value: gold,
        },
    ];

    return (
        <ScrollView style={common.container}
            showsVerticalScrollIndicator={false}>
            <View style={common.header}>
                <Text style={[typography.title, { color: theme.headerText, marginTop: 50, marginBottom: 20 }]}>
                    Аналитика
                </Text>
            </View>


            <View style={common.body}>
                <Text style={common.sectionName}>Общее</Text>

                <View style={[common.block, { maxHeight: blockSize }]}>
                    <PieChart
                        size={200}
                        strokeWidth={20}
                        data={chartData}
                        totalValue={total}
                    />
                </View>

                <View style={common.block}>
                    <View style={s.statisticsContainer}>
                        {chartData.map((item, index) => (
                            <View key={index} style={s.statisticsOption}>
                                <Svg viewBox='0 0 10 10' style={s.statisticsOptionColor}>
                                    <Circle cx={5} cy={5} r={5} fill={item.color} />
                                </Svg>
                                <Text style={[typography.body, { flex: 1, color: theme.primaryText }]}>{item.name}</Text>
                                <Text style={s.statisticsOptionValue}>{formatValue(item.value, true)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = (theme) => StyleSheet.create({
    statisticsContainer: {
        flexDirection: 'column',
        gap: 10,
        width: '100%',
    },
    statisticsOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    statisticsOptionColor: {
        width: 16,
        height: 16
    },
    statisticsOptionValue: {
        color: theme.primaryText,
        fontSize: fontSizes.default,
        fontWeight: fontWeights.bold,
    },
});