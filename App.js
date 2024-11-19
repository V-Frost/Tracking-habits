import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SQLiteProvider } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Main from './screens/Main';
import HabitDetails from './screens/HabitDetails';
import Statistics from './screens/Statistics';
import Reminders from './screens/Reminders';
import Settings from './screens/Settings';
import LoginPage from './screens/LoginPage';
import SignUpPage from './screens/SignUpPage';
import Profile from './screens/Profile';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const initializeDatabase = async (db) => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);
    console.log('База даних успішно ініціалізована.');
  } catch (error) {
    console.error('Помилка під час ініціалізації бази даних:', error);
  }
};

const requestNotificationPermission = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      console.error('Дозвіл на сповіщення не надано.');
      return false;
    }
  }
  console.log('Дозвіл на сповіщення отримано.');
  return true;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [initialRoute, setInitialRoute] = useState('LoginPage');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
      if (userLoggedIn) {
        setInitialRoute('Main');
      }
    };

    requestNotificationPermission();
    checkLoginStatus();
  }, []);

  return (
    <SQLiteProvider databaseName="habitsApp.db" onInit={initializeDatabase}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen name="LoginPage" component={LoginPage} />
            <Stack.Screen name="SignUpPage" component={SignUpPage} />
            <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
            <Stack.Screen name="HabitDetails" component={HabitDetails} />
            <Stack.Screen name="Statistics" component={Statistics} />
            <Stack.Screen name="Reminders" component={Reminders} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </SQLiteProvider>
  );
}
