import TradeScreen from "./TradeScreen";

export default function SellScreen({ navigation }) {
    return (
        <TradeScreen
            navigation={navigation}
            type="sell"
            stockName="AAPL"
            price={600}
            availableAmount={12}
            onSubmit={(amount) => {
                console.log('SELL', amount);
                navigation.goBack();
            }}
        />
    );
}