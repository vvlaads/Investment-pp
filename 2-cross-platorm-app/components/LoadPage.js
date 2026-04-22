import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useApp } from "../utils/AppProvider";
import { createCommonStyles } from "../theme/commonStyles";

export default function LoadPage() {
    const { theme } = useApp();
    const common = createCommonStyles(theme);

    return (
        <View style={common.container, styles.center}>
            <ActivityIndicator
                size={50}
                color={theme.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
});
