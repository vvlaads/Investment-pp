import { ScrollView, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { fontSizes, fontWeights, typography } from "../../theme/typography";
import BackButton from '../../components/BackButton'
import { StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { useState } from "react";
import { formatValue } from "../../utils/formatValue";
import { TextInput } from "react-native";

export default function BalanceOperationScreen({ navigation, type, balance = 0, onSubmit }) {
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
            <ScrollView style={styles.container}
                showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={[typography.title, { color: colors.white, marginTop: 90, marginBottom: 20 }]}>
                        {isDeposit ? 'Пополнение счета' : 'Вывести со счета'}
                    </Text>
                </View>


                <View style={styles.body}>
                    <View style={[styles.block, { flexDirection: 'column', gap: 10 }]}>
                        <Text style={[typography.body, { color: colors.gray }]}>Брокерский счет</Text>
                        <Text style={typography.subtitle}>{formatValue(1200000, true)}</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Номер карты"
                            value={cardNumber}
                            onChangeText={handleChangeCardNumber}
                            keyboardType="numeric"
                            style={[styles.input, typography.subtitle, errorCardNumber ? styles.inputError : null]}
                        />

                        {!!errorCardNumber && (
                            <Text style={styles.errorText}>{errorCardNumber}</Text>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Сумма"
                            value={value}
                            onChangeText={handleChangeValue}
                            keyboardType="numeric"
                            style={[styles.input, typography.subtitle, errorValue ? styles.inputError : null]}
                        />

                        {!!errorValue && (
                            <Text style={styles.errorText}>{errorValue}</Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <Pressable
                    disabled={isDisabled}
                    style={({ pressed }) => [
                        styles.button,
                        !isDisabled && pressed && styles.buttonHover,
                        isDisabled && styles.buttonDisabled,
                    ]}
                    onPress={() => onSubmit(Number(cardNumber), Number(value))}
                >
                    <Text style={[
                        styles.buttonText,
                        isDisabled && styles.buttonTextDisabled
                    ]}>
                        {isDeposit ? 'Пополнить' : 'Перевести'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: colors.main,
        flex: 1,
        padding: 20,
        paddingBottom: 40,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    body: {
        padding: 20,
        justifyContent: 'top',
        backgroundColor: colors.background,
        paddingBottom: 200,
    },
    block: {
        backgroundColor: colors.white,
        color: colors.black,
        borderRadius: 20,
        padding: 20,
        marginBottom: 50,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        zIndex: 1000,
        width: '100%',
        padding: 20
    },
    button: {
        backgroundColor: colors.main,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 15,
        alignItems: 'center',
        height: 60,
        justifyContent: 'center',
        width: '100%',
    },
    buttonHover: {
        backgroundColor: colors.mainDark,
    },
    buttonDisabled: {
        backgroundColor: colors.grayLight,
    },
    buttonTextDisabled: {
        color: colors.gray,
    },
    buttonText: {
        color: colors.white,
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
        color: colors.black,
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
        borderColor: colors.grayLight,
        backgroundColor: colors.white,
        color: colors.black,
        placeholderTextColor: colors.gray,
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