import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Помилка', 'Будь ласка, заповніть всі поля.');
      return;
    }

    try {
      // Перевірка даних користувача
      const users = JSON.parse(await AsyncStorage.getItem('users')) || {};
      const user = users[email];
      if (user && user.password === password) {
        await AsyncStorage.setItem('userLoggedIn', 'true');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
        Alert.alert('Успіх', 'Авторизація успішна.');
      } else {
        Alert.alert('Помилка', 'Невірний email або пароль.');
      }
    } catch (error) {
      console.error('Помилка авторизації:', error);
      Alert.alert('Помилка', 'Щось пішло не так. Спробуйте ще раз.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вхід</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Пароль"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Увійти" onPress={handleLogin} />
      <Button title="Зареєструватися" onPress={() => navigation.navigate('SignUpPage')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});
