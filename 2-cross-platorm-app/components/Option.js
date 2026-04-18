import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { palette } from "../theme/palette";
import { fontSizes, fontWeights, typography } from "../theme/typography";
import { useApp } from "../utils/AppProvider";
import { createCommonStyles } from "../theme/commonStyles";

export default function Option({ description, value, onClick }) {
    const { theme } = useApp();
    const common = createCommonStyles(theme);
    const s = styles(theme);

    return (
        <Pressable
            style={() => [
                s.container,
                { backgroundColor: value ? theme.primary : theme.hover }
            ]}
            onPress={() => { onClick(); }}>
            <Text style={[s.description, { color: value ? theme.alternativeText : theme.secondaryText }]}>{description}</Text>
        </Pressable>
    );
}

const styles = (theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    description: {
        fontSize: fontSizes.default,
        fontWeight: fontWeights.default,
    },
});
