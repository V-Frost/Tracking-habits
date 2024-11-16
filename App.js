
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Main from './screens/Main';
import HabitDetails from './screens/HabitDetails';
import Statistics from './screens/Statistics';
import Reminders from './screens/Reminders';
import Settings from './screens/Settings';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="HabitDetails" component={HabitDetails} />
          <Stack.Screen name="Statistics" component={Statistics} />
          <Stack.Screen name="Reminders" component={Reminders} />
          <Stack.Screen name="Settings" component={Settings} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
    