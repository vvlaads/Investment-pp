import { Text, StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { palette } from '../../theme/palette';
import { fontSizes, fontWeights, typography } from '../../theme/typography';
import { formatValue } from '../../utils/formatValue';
import BackButton from '../../components/BackButton';
import { TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { useApp } from '../../utils/AppProvider';
import { createCommonStyles } from '../../theme/commonStyles';
import LoadPage from '../../components/LoadPage';
import { getStockInfoApi } from '../../api/stocks.api';
import { getBalanceApi } from '../../api/wallet.api';

export default function TradeScreen({ navigation, type, ticker, onSubmit }) {
    const [loading, setLoading] = useState(true);
    const [stock, setStock] = useState(null);
    const [balance, setBalance] = useState(0);

    const [quantity, setQuantity] = useState('');

    const { theme } = useApp();
    const common = createCommonStyles(theme);
    const s = styles(theme);

    useEffect(() => {
        async function loadStock() {
            try {
                const data = await getStockInfoApi(ticker);
                setStock(data);

                const balance = await getBalanceApi();
                setBalance(balance);
            } finally {
                setLoading(false);
            }
        }

        loadStock();
    }, [ticker]);

    if (loading) return (<LoadPage />);

    const isSell = type === 'sell';
    const numericQuantity = Number(quantity);

    const handleChange = (text) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        setQuantity(cleaned);
    };

    const price = stock.currentPrice;

    let error = '';
    if (quantity === '') {
        error = '';
    } else if (!Number.isFinite(numericQuantity)) {
        error = 'Введите число';
    } else if (numericQuantity <= 0) {
        error = 'Больше 0';
    } else if (isSell && numericQuantity > stock.quantity) {
        error = `Макс: ${stock.quantity}`;
    } else if (!isSell && numericQuantity * price > balance) {
        error = 'Недостаточно средств';
    }

    const isDisabled = !!error || quantity === '';
    const total = isDisabled ? 0 : numericQuantity * price;


    return (
        <View style={{ flex: 1 }}>
            <BackButton navigation={navigation} />

            <ScrollView style={common.container}
                showsVerticalScrollIndicator={false}>
                <View style={common.header}>
                    <Text style={[typography.title, { color: theme.headerText, marginTop: 90, marginBottom: 20 }]}>
                        {isSell ? 'Продать' : 'Купить'} акцию
                    </Text>
                </View>


                <View style={common.body}>
                    <View style={s.inputContainer}>
                        <TextInput
                            placeholder="Количество"
                            value={quantity}
                            onChangeText={handleChange}
                            keyboardType="numeric"
                            style={[s.input, typography.subtitle, error ? s.inputError : null]}
                        />

                        {!!error && (
                            <Text style={s.errorText}>{error}</Text>
                        )}
                    </View>


                    <View style={common.block}>
                        <View style={s.row}>
                            <Text style={s.left}>Название акции:</Text>
                            <Text style={s.right}>{stock.name}</Text>
                        </View>

                        <View style={s.row}>
                            <Text style={s.left}>Стоимость акции:</Text>
                            <Text style={s.right}>
                                {formatValue(price, true)}
                            </Text>
                        </View>

                        <View style={s.row}>
                            <Text style={s.left}>Количество:</Text>
                            <Text style={s.right}>
                                {error ? 0 : numericQuantity} шт.
                            </Text>
                        </View>
                    </View>


                    <View style={common.block}>
                        <View style={s.row}>
                            <Text style={[typography.subtitle, { flex: 1, fontWeight: fontWeights.default, color: theme.primaryText }]}>
                                Итого:
                            </Text>
                            <Text style={[typography.subtitle, { flex: 2, textAlign: 'right', color: theme.primaryText }]}>
                                {formatValue(total, true)}
                            </Text>
                        </View>
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
                    onPress={() => onSubmit(numericQuantity)}
                >
                    <Text style={[
                        s.buttonText,
                        isDisabled && s.buttonTextDisabled
                    ]}>
                        {isSell ? 'Продать' : 'Купить'}
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
        flex: 2,
        color: theme.primaryText,
        fontSize: fontSizes.medium,
    },

    right: {
        flex: 1,
        color: theme.primaryText,
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