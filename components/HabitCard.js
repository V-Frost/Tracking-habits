// components/HabitCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HabitCard({ habitName, description }) {
  return (
    <View style={styles.card}>
      <Text style={styles.habitName}>{habitName}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f6faff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 10,
    width: '100%',
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E2E0D',
  },
  description: {
    fontSize: 14,
    color: '#3E3E3E',
  },
 
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

