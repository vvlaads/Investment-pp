import BalanceOperationScreen from "./BalanceOperationScreen";

//Пополнение счета
export default function DepositScreen({ navigation }) {
    return (
        <BalanceOperationScreen
            navigation={navigation}
            type="deposit"
            onSubmit={(cardNumber, value) => {
                console.log('deposit', cardNumber, value);
                navigation.goBack();
            }}
        />
    );
}