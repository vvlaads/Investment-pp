import { buyStockApi } from "../../api/stocks.api";
import TradeScreen from "./TradeScreen";

export default function BuyScreen({ navigation, route }) {
    const { ticker } = route.params;

    return (
        <TradeScreen
            navigation={navigation}
            type="buy"
            ticker={ticker}
            onSubmit={(quantity) => {
                console.log('BUY', quantity);
                buyStockApi({ ticker: ticker, quantity: quantity });
                navigation.goBack();
            }}
        />
    );
}