import { StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useApp } from "../utils/AppProvider";

export default function StockChart({ width, height, data }) {
    const { theme } = useApp();

    return (
        <View style={styles.container}>
            <LineChart
                data={data}
                width={width}
                height={height}
                yAxisSuffix=" ₽"
                chartConfig={{
                    decimalPlaces: 2,
                    backgroundGradientFrom: `${theme.surface}`,
                    backgroundGradientTo: `${theme.surface}`,
                    color: (opacity = 1) => `${theme.profit}`,
                    labelColor: (opacity = 1) => `${theme.secondaryText}`,
                }}
                bezier
            />
        </View>
    )
}

const styles = (theme) => StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
});