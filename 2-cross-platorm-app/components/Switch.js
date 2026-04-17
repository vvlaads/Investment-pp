import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { palette } from "../theme/palette";
import { fontSizes, fontWeights, typography } from "../theme/typography";
import { useApp } from "../utils/AppProvider";
import { createCommonStyles } from "../theme/commonStyles";

export default function Switch({ description, value, onChange }) {
    const { theme } = useApp();
    const common = createCommonStyles(theme);
    const s = styles(theme);

    return (
        <View style={[common.block, s.container]}>
            <Text style={s.description}>{description}</Text>
            <Pressable
                style={() => [
                    s.switchContainer,
                    { backgroundColor: value ? theme.primary : theme.alternativeSurface }
                ]}
                onPress={() => { onChange(!value); }}
            >
                <View style={[s.switchCircle, value ? { right: 3 } : { left: 3 }]}></View>
            </Pressable >
        </View>
    );
}

const styles = (theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    switchContainer: {
        width: 62,
        height: 30,
        borderRadius: 20,
        justifyContent: 'center',
        padding: 3,
    },

    switchCircle: {
        backgroundColor: theme.surface,
        width: 24,
        height: 24,
        borderRadius: 12,
        position: 'absolute',
        top: 3,
    },

    description: {
        color: theme.primaryText,
        fontSize: fontSizes.default,
        fontWeight: fontWeights.bold,
    }
});
