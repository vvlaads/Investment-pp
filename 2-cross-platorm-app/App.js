import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import StockInfoScreen from './screens/stock/StockInfoScreen';
import Tabs from './navigation/Tabs';
import { StatusBar } from 'react-native';
import { palette } from './theme/palette';
import SellScreen from './screens/stock/SellScreen';
import BuyScreen from './screens/stock/BuyScreen';
import WithdrawScreen from './screens/balance/WithdrawScreen';
import DepositScreen from './screens/balance/DepositScreen';
import SettingsScreen from './screens/settings/SettingsScreen';
import NotificationSettingsScreen from './screens/settings/NotificationSettingsScreen';
import { AppProvider } from './utils/AppProvider';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <StatusBar backgroundColor={palette.main} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">

          {/* Без меню */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />

          {/* Без меню */}
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />

          {/* С меню */}
          <Stack.Screen
            name="Main"
            component={Tabs}
            options={{ headerShown: false }}
          />

          {/* Без меню */}
          <Stack.Screen
            name="StockInfo"
            component={StockInfoScreen}
            options={{ headerShown: false }}
          />

          {/* Без меню */}
          <Stack.Screen
            name="Sell"
            component={SellScreen}
            options={{ headerShown: false }}
          />

          {/* Без меню */}
          <Stack.Screen
            name="Buy"
            component={BuyScreen}
            options={{ headerShown: false }}
          />

          {/* Без меню */}
          <Stack.Screen
            name="Deposit"
            component={DepositScreen}
            options={{ headerShown: false }}
          />

          {/* Без меню */}
          <Stack.Screen
            name="Withdraw"
            component={WithdrawScreen}
            options={{ headerShown: false }}
          />
          {/* Без меню */}
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
          {/* Без меню */}
          <Stack.Screen
            name="NotificationSettings"
            component={NotificationSettingsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}