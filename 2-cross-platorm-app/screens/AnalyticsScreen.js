import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { fontSizes, fontWeights, typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { PieChart } from '../components/PieChart';
import Svg, { Circle } from 'react-native-svg';
import { formatValue } from '../utils/formatValue';

export default function AnalyticsScreen() {
    const stocks = 500
    const bonds = 300
    const gold = 200
    const total = stocks + bonds + gold

    const chartData = [
        {
            name: 'Акции',
            color: colors.purple,
            value: stocks,
        },
        {
            name: 'Облигации',
            color: colors.pink,
            value: bonds,
        },
        {
            name: 'Золото',
            color: colors.orange,
            value: gold,
        },
    ];

    return (
        <ScrollView style={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={[typography.title, { color: colors.white, marginTop: 50, marginBottom: 20 }]}>
                    Аналитика
                </Text>
            </View>


            <View style={styles.body}>
                <Text style={[typography.subtitle, { marginBottom: 20 }]}>Общее</Text>

                <View style={styles.block}>
                    <PieChart
                        size={200}
                        strokeWidth={20}
                        data={chartData}
                        totalValue={total}
                    />
                </View>

                <View style={styles.block}>
                    <View style={styles.statisticsContainer}>
                        {chartData.map((item, index) => (
                            <View key={index} style={styles.statisticsOption}>
                                <Svg viewBox='0 0 10 10' style={styles.statisticsOptionColor}>
                                    <Circle cx={5} cy={5} r={5} fill={item.color} />
                                </Svg>
                                <Text style={[typography.body, { flex: 1 }]}>{item.name}</Text>
                                <Text style={styles.statisticsOptionValue}>{formatValue(item.value, true)}</Text>
                            </View>
                        ))}
                    </View>
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
    block: {
        borderRadius: 15,
        backgroundColor: colors.white,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    statisticsContainer: {
        flexDirection: 'column',
        gap: 10,
        width: '100%',
        height: '100%',
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
        color: colors.black,
        fontSize: fontSizes.default,
        fontWeight: fontWeights.bold,
    },
});