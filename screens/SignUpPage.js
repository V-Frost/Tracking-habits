import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Помилка', 'Будь ласка, заповніть всі поля.');
      return;
    }

    try {
      // Збереження даних користувача
      const users = JSON.parse(await AsyncStorage.getItem('users')) || {};
      if (users[email]) {
        Alert.alert('Помилка', 'Користувач із таким email вже існує.');
        return;
      }
      users[email] = { email, password };
      await AsyncStorage.setItem('users', JSON.stringify(users));

      Alert.alert('Успіх', 'Реєстрація успішна.', [
        { text: 'OK', onPress: () => navigation.navigate('LoginPage') },
      ]);
    } catch (error) {
      console.error('Помилка під час реєстрації:', error);
      Alert.alert('Помилка', 'Щось пішло не так. Спробуйте ще раз.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Реєстрація</Text>
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
      <Button title="Зареєструватись" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 },
});
