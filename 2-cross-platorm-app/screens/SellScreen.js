import { Text, StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { fontSizes, fontWeights, typography } from '../theme/typography';
import { formatValue } from '../utils/formatValue';
import BackButton from '../components/BackButton';
import { TextInput } from 'react-native';
import { useState } from 'react';

export default function SellScreen({ navigation }) {
    const stockName = "AAPL";
    const availableAmount = 12;
    const [amount, setAmount] = useState('');
    const numericAmount = Number(amount) || 0;

    let error = '';

    if (amount === '') {
        error = '';
    } else if (!Number.isFinite(numericAmount)) {
        error = 'Введите число';
    } else if (numericAmount <= 0) {
        error = 'Больше 0';
    } else if (numericAmount > availableAmount) {
        error = `Макс: ${availableAmount}`;
    }
    const currentPricePerUnit = 600;
    const isValidAmount = numericAmount > 0 && numericAmount <= availableAmount;
    const isDisabled = !isValidAmount;

    const handleChange = (text) => {
        // удаляем всё кроме цифр
        const cleaned = text.replace(/[^0-9]/g, '');
        setAmount(cleaned);
    };

    const total = error ? 0 : numericAmount * currentPricePerUnit;

    return (
        <View style={{ flex: 1 }}>
            <BackButton navigation={navigation} />

            <ScrollView style={styles.container}
                showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={[typography.title, { color: colors.white, marginTop: 90, marginBottom: 20 }]}>
                        Продать акцию
                    </Text>
                </View>


                <View style={styles.body}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Количество"
                            value={amount}
                            onChangeText={handleChange}
                            keyboardType="numeric"
                            style={[styles.input, typography.subtitle, error ? styles.inputError : null]}
                        />

                        {!!error && (
                            <Text style={styles.errorText}>{error}</Text>
                        )}
                    </View>


                    <View style={styles.block}>
                        <View style={styles.row}>
                            <Text style={[styles.left, { flex: 2 }]}>Название акции:</Text>
                            <Text style={[styles.right, { flex: 1 }]}>{stockName}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={[styles.left, { flex: 2 }]}>Стоимость акции:</Text>
                            <Text style={[styles.right, { flex: 1 }]}>
                                {formatValue(currentPricePerUnit, true)}
                            </Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={[styles.left, { flex: 2 }]}>Количество:</Text>
                            <Text style={[styles.right, { flex: 1 }]}>
                                {error ? 0 : numericAmount} шт.
                            </Text>
                        </View>
                    </View>


                    <View style={styles.block}>
                        <View style={styles.row}>
                            <Text style={[typography.subtitle, { flex: 1, fontWeight: fontWeights.default }]}>
                                Итого:
                            </Text>
                            <Text style={[typography.subtitle, { flex: 2, textAlign: 'right' }]}>
                                {formatValue(total, true)}
                            </Text>
                        </View>
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
                    onPress={() => navigation.goBack()}
                >
                    <Text style={[
                        styles.buttonText,
                        isDisabled && styles.buttonTextDisabled
                    ]}>
                        Продать
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