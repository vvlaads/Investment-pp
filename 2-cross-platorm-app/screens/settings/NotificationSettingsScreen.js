import { Text, StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { palette } from '../../theme/palette';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import { formatValue } from '../../utils/formatValue';
import { formatPercent } from '../../utils/formatPercent';
import BackButton from '../../components/BackButton';

import { createCommonStyles } from '../../theme/commonStyles';
import Switch from '../../components/Switch';
import { useState } from 'react';
import { useApp } from '../../utils/AppProvider';

export default function NotificationSettingsScreen({ navigation }) {
    const { theme, notifications, setNotifications } = useApp();
    const common = createCommonStyles(theme);
    const s = styles(theme);

    const [isShowing, setIsShowing] = useState(true);

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
                    <Text style={common.sectionName}>Уведомления</Text>
                    <Switch
                        description={'Показывать уведомления'}
                        value={notifications}
                        onChange={setNotifications} />
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