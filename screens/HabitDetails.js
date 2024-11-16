import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function HabitDetails({ route, navigation }) {
  const { habit } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Деталі звички</Text>
      <Text style={styles.habitName}>{habit.habitName}</Text>
      <Text style={styles.description}>{habit.description}</Text>

      <CustomButton
        title="Повернутись на головну"
        onPress={() => navigation.navigate('Main')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
});
