import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import StockInfoScreen from './screens/StockInfoScreen';
import Tabs from './navigation/Tabs';
import { StatusBar } from 'react-native';
import { colors } from './theme/colors';
import SellScreen from './screens/SellScreen';
import BuyScreen from './screens/BuyScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar backgroundColor={colors.main} />
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
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}