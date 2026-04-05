import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Menu from '../components/Menu';
import PortfolioScreen from '../screens/PortfolioScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MarketScreen from '../screens/MarketScreen';

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
            <Tab.Screen name="Market" options={{ title: 'Рынок' }} component={MarketScreen} />
            <Tab.Screen name="Profile" options={{ title: 'Профиль' }} component={ProfileScreen} />
        </Tab.Navigator>
    );
}