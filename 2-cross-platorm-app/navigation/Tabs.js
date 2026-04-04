import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Menu from '../components/Menu';
import PortfolioScreen from '../screens/PortfolioScreen';
import ProfileScreen from '../screens/ProfileScreen';

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
            <Tab.Screen name="Profile" options={{ title: 'Профиль' }} component={ProfileScreen} />
        </Tab.Navigator>
    );
}