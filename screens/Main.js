import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HabitCard from '../components/HabitCard';
import HabitInput from '../components/HabitInput';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Main() {
  const [habits, setHabits] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadHabits = async () => {
      try {
        const storedHabits = await AsyncStorage.getItem('habits');
        if (storedHabits) {
          setHabits(JSON.parse(storedHabits));
        }
      } catch (error) {
        console.log('Помилка завантаження звичок:', error);
      }
    };
    loadHabits();
  }, []);

  const saveHabits = async (newHabits) => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(newHabits));
    } catch (error) {
      console.log('Помилка збереження звичок:', error);
    }
  };

  const handleAddHabit = (habitName, description) => {
    if (!habitName) {
      Alert.alert('Помилка', 'Введіть назву для звички.');
      return;
    }
    const newHabits = [...habits, { habitName, description }];
    setHabits(newHabits);
    saveHabits(newHabits);
  };

  return (
    <View style={styles.container}>
      <HabitInput onAddHabit={handleAddHabit} />

      <ScrollView style={styles.habitList}>
        {habits.map((habit, index) => (
          <HabitCard key={index} habitName={habit.habitName} description={habit.description} />
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <CustomButton title="Статистика" onPress={() => navigation.navigate('Statistics')} />
        <CustomButton title="Нагадування" onPress={() => navigation.navigate('Reminders')} />
        <CustomButton title="Налаштування" onPress={() => navigation.navigate('Settings')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#c5deff',
  },
  habitList: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});
