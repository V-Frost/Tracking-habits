import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchLastLoggedInEmail = async () => {
      const lastEmail = await AsyncStorage.getItem('lastLoggedInEmail');
      setEmail(lastEmail);
      console.log('Отриманий email:', lastEmail);
    };

    fetchLastLoggedInEmail();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('lastLoggedInEmail');
      await AsyncStorage.removeItem('userLoggedIn');
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginPage' }],
      });
    } catch (error) {
      console.error('Помилка при виході з системи:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профіль</Text>
      <Text style={styles.text}>Email: {email}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Вийти з облікового запису</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#1A1A2E',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'white' },
  text: { fontSize: 18, marginBottom: 20, color: 'white'},
  logoutButton: {
    backgroundColor: '#0f2f57',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderRadius: 3,
    elevation: 3, // Тінь для Android
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
