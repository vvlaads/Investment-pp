import { Text, StyleSheet, ScrollView, View, Pressable } from 'react-native';
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
import { Area, CartesianChart, Line } from "victory-native";

export default function StockInfoScreen({ navigation }) {
    const { theme } = useApp();
    const common = createCommonStyles(theme);
    const s = styles(theme);

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

    const data = [
        { time: new Date('2026-04-25'), value: 580 },
        { time: new Date('2026-04-26'), value: 590 },
        { time: new Date('2026-04-27'), value: 605 },
        { time: new Date('2026-04-28'), value: 600 },
    ];

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

                    <View style={common.block}>
                        {/* <CartesianChart data={data} xKey="time" yKeys={["value"]}>
                            {({ points, chartBounds }) =>
                                <>
                                    <Area points={points.value} y0={chartBounds.bottom} color="red" />
                                </>
                            }
                        </CartesianChart> */}
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