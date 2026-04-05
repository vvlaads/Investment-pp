import { StyleSheet, Text } from "react-native";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { typography } from "../theme/typography";
import { colors } from "../theme/colors";
import { formatValue } from "../utils/formatValue";

export function PieChart({ size, strokeWidth, data, totalValue }) {
    const center = size / 2
    const radius = (size - strokeWidth) / 2
    const cicrumference = 2 * Math.PI * radius

    let angle = 90;
    const angles = [];
    data.forEach((item) => {
        angles.push(angle)
        angle += (item.value / totalValue) * 360
    });

    return (
        <View style={styles.container}>
            <Svg viewBox={`0 0 ${size} ${size}`} >
                {data.map((item, index) => (
                    <Circle
                        key={index}
                        cy={center}
                        cx={center}
                        r={radius}
                        fill={'transparent'}
                        strokeWidth={strokeWidth}
                        stroke={item.color}
                        strokeDasharray={cicrumference}
                        strokeDashoffset={cicrumference * (1 - (item.value / totalValue))}
                        originX={center}
                        originY={center}
                        rotation={angles[index]}
                    />
                ))}
            </Svg>
            <Text style={[styles.centerText, typography.subtitle]}>
                {formatValue(totalValue, true)}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerText: {
        position: 'absolute',
        textAlign: 'center',
        color: colors.black,
    },
})