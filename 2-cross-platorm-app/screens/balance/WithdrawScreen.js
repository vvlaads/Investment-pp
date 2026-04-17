import BalanceOperationScreen from "./BalanceOperationScreen";

//Вывод средств
export default function WithdrawScreen({ navigation }) {
    return (
        <BalanceOperationScreen
            navigation={navigation}
            type="withdraw"
            balance={120000}
            onSubmit={(cardNumber, value) => {
                console.log('withdraw', cardNumber, value);
                navigation.goBack();
            }}
        />
    );
}