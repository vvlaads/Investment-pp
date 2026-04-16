import TradeScreen from "./TradeScreen";

export default function BuyScreen({ navigation }) {
    return (
        <TradeScreen
            navigation={navigation}
            type="buy"
            stockName="AAPL"
            price={600}
            balance={100000}
            onSubmit={(amount) => {
                console.log('BUY', amount);
                navigation.goBack();
            }}
        />
    );
}