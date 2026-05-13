import { withdrawApi } from "../../api/wallet.api";
import BalanceOperationScreen from "./BalanceOperationScreen";

//Вывод средств
export default function WithdrawScreen({ navigation }) {
    return (
        <BalanceOperationScreen
            navigation={navigation}
            type="withdraw"
            onSubmit={(cardNumber, value) => {
                console.log('withdraw', cardNumber, value);
                withdrawApi(value);
                navigation.goBack();
            }}
        />
    );
}