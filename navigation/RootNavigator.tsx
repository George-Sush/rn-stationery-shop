import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import MedicineListScreen from '../screens/MedicineListScreen';
import MedicineDetailsScreen from '../screens/MedicineDetailsScreen';
import CartScreen from '../screens/CartScreen';
import HeaderCartButton from '../components/HeaderCartButton';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#20372b',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#f6f8f5' },
        }}
      >
        <Stack.Screen
          name="MedicineList"
          component={MedicineListScreen}
          options={{
            title: 'Здоровая аптека',
            headerRight: () => <HeaderCartButton />,
          }}
        />
        <Stack.Screen
          name="MedicineDetails"
          component={MedicineDetailsScreen}
          options={{
            title: 'О препарате',
            headerRight: () => <HeaderCartButton />,
          }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: 'Моя корзина' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}