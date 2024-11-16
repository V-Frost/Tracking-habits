import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import HabitCard from '../components/HabitCard';
import HabitInput from '../components/HabitInput';
import CustomButton from '../components/CustomButton';

const fetchHabits = async () => {
  const response = await fetch('https://my-json-server.typicode.com/V-Frost/tracking-habits-api/habits');
  if (!response.ok) {
    throw new Error('Failed to fetch habits');
  }
  return response.json();
};

export default function Main() {
  const navigation = useNavigation();
  const { data: habits, isLoading, error } = useQuery({
    queryKey: ['habits'],
    queryFn: fetchHabits
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHabits = useMemo(() => {
    if (!habits) return [];
    return habits.filter((habit) =>
      habit.habitName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [habits, searchQuery]);

  const handleSearch = useCallback((query) => setSearchQuery(query), []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Пошук звичок"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <ScrollView style={styles.habitList}>
        {filteredHabits.map((habit) => (
          <HabitCard key={habit.id} habitName={habit.habitName} description={habit.description} />
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
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
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
