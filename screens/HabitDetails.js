import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HabitDetails({ route }) {
  const { habit } = route.params; // Отримання звички через параметри

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Деталі звички</Text>
      <Text style={styles.habitName}>Назва: {habit.habitName}</Text>
      <Text style={styles.description}>Опис: {habit.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E', // Темний фон
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F7F7F7',
    marginBottom: 20,
  },
  habitName: {
    fontSize: 18,
    color: '#F7F7F7',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
  },
});
