import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import CustomButton from '../components/CustomButton';

const fetchHabitDetails = async (habitId) => {
  const response = await fetch(`https://my-json-server.typicode.com/<YourGitHubUsername>/<RepositoryName>/habits/${habitId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch habit details');
  }
  return response.json();
};

export default function HabitDetails({ route, navigation }) {
  const { habitId } = route.params;
  const { data: habit, isLoading, error } = useQuery({
    queryKey: ['habit', habitId],
    queryFn: () => fetchHabitDetails(habitId)
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading habit details.</Text>;

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
