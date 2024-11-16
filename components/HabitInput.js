import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function HabitInput({ onAddHabit }) {
  const [habitName, setHabitName] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    onAddHabit(habitName, description);
    setHabitName('');
    setDescription('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Назва звички"
        value={habitName}
        onChangeText={setHabitName}
      />
      <TextInput
        style={styles.input}
        placeholder="Опис"
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.buttonSpacing}>
        <Button title="Додати звичку" onPress={handleAdd} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonSpacing: {
    marginTop: 10, 
  },
});
