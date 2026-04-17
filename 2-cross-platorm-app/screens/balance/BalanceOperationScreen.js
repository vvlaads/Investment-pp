import { ScrollView, Text, View } from "react-native";
import { palette } from "../../theme/palette";
import { fontSizes, fontWeights, typography } from "../../theme/typography";
import BackButton from '../../components/BackButton'
import { StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { useState } from "react";
import { formatValue } from "../../utils/formatValue";
import { TextInput } from "react-native";
import { createCommonStyles } from "../../theme/commonStyles";
import { useApp } from "../../utils/AppProvider";

export default function BalanceOperationScreen({ navigation, type, balance = 0, onSubmit }) {
    const { theme } = useApp();
    const common = createCommonStyles(theme);
    const s = styles(theme);

    const [cardNumber, setCardNumber] = useState('');
    const [value, setValue] = useState('');
    const isDeposit = type === 'deposit';

    let errorCardNumber = '';
    let errorValue = '';
    if (cardNumber === '') {
        errorCardNumber = '';
    } else if (isNaN(Number(cardNumber))) {
        errorCardNumber = 'Номер должен состоять из цифр';
    } else if (cardNumber.length != 16) {
        errorCardNumber = 'Номер карты должен содержать 16 цифр';
    }

    if (value === '') {
        errorValue = '';
    } else if (isNaN(Number(value))) {
        errorValue = 'Введите число';
    } else if (Number(value) <= 0) {
        errorValue = 'Введите число больше 0';
    } else if (!isDeposit && balance < Number(value)) {
        errorValue = 'Недостаточно средств';
    }

    const isDisabled = !!errorCardNumber || !!errorValue || cardNumber === '' || value === '';

    const handleChangeCardNumber = (text) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        setCardNumber(cleaned);
    };

    const handleChangeValue = (text) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        setValue(cleaned);
    };

    return (
        <View style={{ flex: 1 }}>
            <BackButton navigation={navigation} />
            <ScrollView style={common.container}
                showsVerticalScrollIndicator={false}>
                <View style={common.header}>
                    <Text style={[typography.title, { color: theme.headerText, marginTop: 90, marginBottom: 20 }]}>
                        {isDeposit ? 'Пополнение счета' : 'Вывести со счета'}
                    </Text>
                </View>


                <View style={common.body}>
                    <View style={[common.block, { flexDirection: 'column', gap: 10 }]}>
                        <Text style={[typography.body, { color: theme.secondaryText }]}>Брокерский счет</Text>
                        <Text style={[typography.subtitle, { color: theme.primaryText }]}>{formatValue(1200000, true)}</Text>
                    </View>

                    <View style={s.inputContainer}>
                        <TextInput
                            placeholder="Номер карты"
                            value={cardNumber}
                            onChangeText={handleChangeCardNumber}
                            keyboardType="numeric"
                            style={[s.input, typography.subtitle, errorCardNumber ? s.inputError : null]}
                        />

                        {!!errorCardNumber && (
                            <Text style={s.errorText}>{errorCardNumber}</Text>
                        )}
                    </View>

                    <View style={s.inputContainer}>
                        <TextInput
                            placeholder="Сумма"
                            value={value}
                            onChangeText={handleChangeValue}
                            keyboardType="numeric"
                            style={[s.input, typography.subtitle, errorValue ? s.inputError : null]}
                        />

                        {!!errorValue && (
                            <Text style={s.errorText}>{errorValue}</Text>
                        )}
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
                    onPress={() => onSubmit(Number(cardNumber), Number(value))}
                >
                    <Text style={[
                        s.buttonText,
                        isDisabled && s.buttonTextDisabled
                    ]}>
                        {isDeposit ? 'Пополнить' : 'Перевести'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = (theme) => StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        zIndex: 1000,
        width: '100%',
        padding: 20
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
    buttonTextDisabled: {
        color: theme.secondaryText,
    },
    buttonText: {
        color: theme.alternativeText,
        fontWeight: fontWeights.bold,
        fontSize: fontSizes.default,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    left: {
        fontSize: fontSizes.medium,
        color: theme.primaryText,
    },

    right: {
        fontSize: fontSizes.medium,
        fontWeight: fontWeights.bold,
        textAlign: 'right',
    },

    inputContainer: {
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'column',
        gap: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.surface,
        color: theme.primaryText,
        placeholderTextColor: theme.secondaryText,
        borderRadius: 8,
        padding: 10,
    },
    inputError: {
        borderColor: 'red',
    },

    errorText: {
        color: 'red',
        fontSize: fontSizes.medium,
        marginBottom: 10,
        marginLeft: 10,
    },
});