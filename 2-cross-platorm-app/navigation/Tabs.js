import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Menu from '../components/Menu';
import PortfolioScreen from '../screens/PortfolioScreen';

const Tab = createBottomTabNavigator();

export default function Tabs() { 
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => <Menu {...props} />}
        >
            <Tab.Screen name="Portfolio" options={{ title: 'Портфель' }} component={PortfolioScreen} />
        </Tab.Navigator>
    );
}