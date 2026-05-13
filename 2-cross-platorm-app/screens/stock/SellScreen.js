import { sellStockApi } from "../../api/stocks.api";
import TradeScreen from "./TradeScreen";

export default function SellScreen({ navigation, route }) {
    const { ticker } = route.params;

    return (
        <TradeScreen
            navigation={navigation}
            type="sell"
            ticker={ticker}
            onSubmit={(quantity) => {
                console.log('SELL', quantity);
                sellStockApi({ ticker: ticker, quantity: quantity });
                navigation.goBack();
            }}
        />
    );
}