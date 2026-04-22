import { Text, StyleSheet, ScrollView, View, Pressable, TextInput } from 'react-native';
import { palette } from '../../theme/palette';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import { formatValue } from '../../utils/formatValue';
import { formatPercent } from '../../utils/formatPercent';
import BackButton from '../../components/BackButton';
import { createCommonStyles } from '../../theme/commonStyles';
import Switch from '../../components/Switch';
import { useState } from 'react';
import { useApp } from '../../utils/AppProvider';

export default function HelpScreen({ navigation }) {
    const { theme, notifications, setNotifications } = useApp();
    const common = createCommonStyles(theme);
    const s = styles(theme);

    const [inputHeight, setInputHeight] = useState(120);
    const [message, setMessage] = useState('');
    const isTooLong = message.length > 300;
    const isDisabled = message === '' || isTooLong;

    const handleChange = (text) => {
        setMessage(text);
    };

    return (
        <View style={{ flex: 1 }}>
            <BackButton navigation={navigation} />

            <ScrollView style={common.container}
                showsVerticalScrollIndicator={false}>
                <View style={common.header}>
                    <Text style={[typography.title, s.title]}>
                        Помощь
                    </Text>
                </View>


                <View style={common.body}>
                    <Text style={common.sectionName}>Описание</Text>
                    <TextInput
                        style={[
                            s.textArea,
                            { height: inputHeight },
                            isTooLong && { borderColor: theme.error }
                        ]}
                        value={message}
                        onChangeText={handleChange}
                        multiline
                        placeholder="Опишите свою проблему"
                        placeholderTextColor={theme.secondaryText}
                        onContentSizeChange={(e) => {
                            const h = e.nativeEvent.contentSize.height;
                            setInputHeight(Math.min(h, 200));
                        }}
                    />

                    <View style={s.inputHelper}>
                        {isTooLong && (
                            <Text style={s.errorText}>
                                Максимум 300 символов
                            </Text>
                        )}
                        <Text style={[
                            s.counter,
                            isTooLong && { color: theme.error }
                        ]}>
                            {message.length}/300
                        </Text>
                    </View>
                </View>
            </ScrollView>


            <View style={s.buttonContainer}>
                <Pressable
                    disabled={isDisabled}
                    style={({ pressed }) => [
                        s.button,
                        !isDisabled && pressed && s.buttonHover,
                        isDisabled && s.buttonDisabled,
                    ]}
                    onPress={() => {
                        console.log('send', message);
                        setMessage('');
                    }}>
                    <Text style={s.buttonText}>Отправить</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = (theme) => StyleSheet.create({
    title: {
        color: theme.headerText,
        marginTop: 90,
        marginBottom: 20
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        zIndex: 100,
        width: '100%',
        padding: 20,
    },
    button: {
        backgroundColor: theme.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 15,
        alignItems: 'center',
        height: 60,
        justifyContent: 'center',
        width: '100%',
    },
    buttonHover: {
        backgroundColor: theme.primaryDark,
    },
    buttonDisabled: {
        backgroundColor: theme.hover,
    },
    buttonText: {
        color: theme.alternativeText,
        fontSize: fontSizes.default,
        fontWeight: fontWeights.bold,
    },
    textArea: {
        backgroundColor: theme.surface,
        minHeight: 120,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.surface,
        color: theme.primaryText,
        borderRadius: 10,
        padding: 12,
        textAlignVertical: 'top',
        fontSize: fontSizes.medium,
        fontWeight: fontWeights.default,
    },
    counter: {
        color: theme.secondaryText,
        fontSize: fontSizes.default,
        marginTop: 5,
        marginLeft: 'auto',
    },
    errorText: {
        color: theme.error,
        fontSize: fontSizes.default,
        marginTop: 5,
    },
    inputHelper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});