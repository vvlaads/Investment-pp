import { Text, StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { palette } from '../../theme/palette';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import { formatValue } from '../../utils/formatValue';
import { formatProcent } from '../../utils/formatProcent';
import BackButton from '../../components/BackButton';
import { useTheme } from '../../theme/ThemeProvider';
import { createCommonStyles } from '../../theme/commonStyles';
import Switch from '../../components/Switch';

export default function SettingsScreen({ navigation }) {
    const { theme, isDark, toggleTheme } = useTheme();
    const common = createCommonStyles(theme);
    const s = styles(theme);

    return (
        <View style={{ flex: 1 }}>
            <BackButton navigation={navigation} />

            <ScrollView style={common.container}
                showsVerticalScrollIndicator={false}>
                <View style={common.header}>

                    <Text style={[typography.title, s.title]}>
                        Настройки
                    </Text>
                </View>
                <View style={common.body}>
                    <Text style={common.sectionName}>Интерфейс</Text>
                    <Switch
                        description={'Темная тема'}
                        value={isDark}
                        onChange={toggleTheme} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = (theme) => StyleSheet.create({
    title: {
        color: theme.headerText,
        marginTop: 90,
        marginBottom: 20
    },
});