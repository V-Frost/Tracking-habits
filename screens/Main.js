import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  Button,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';

const colors = {
  primary: '#E94560', // Кремовий акцент для кнопок
  secondary: '#F0A500', // Світло-кремовий для підказок
  background: '#1A1A2E', // Темно-синій фон
  cardBackground: '#16213E', // Синьо-сірий для карток і полів
  border: '#222831', // Трохи світліший темно-синій для рамок
  textPrimary: '#F7F7F7', // Білий текст
  textSecondary: '#CCCCCC', // Світло-сірий текст
  modalOverlay: 'rgba(0, 0, 0, 0.7)', // Прозорий чорний для фону модального вікна
  danger: '#E94560', // Кремовий червоний для помилок
};


const fetchHabits = async () => {
  const response = await fetch('https://my-json-server.typicode.com/V-Frost/tracking-habits/habits');
  if (!response.ok) {
    throw new Error('Failed to fetch habits');
  }
  return response.json();
};

export default function Main() {
  const navigation = useNavigation();
  const { data, isLoading, error } = useQuery({
    queryKey: ['habits'],
    queryFn: fetchHabits,
  });

  const [localHabits, setLocalHabits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setNewHabitName('');
    setNewDescription('');
  };

  const addNewHabit = () => {
    if (newHabitName.trim() && newDescription.trim()) {
      const newHabit = {
        id: Date.now(),
        habitName: newHabitName,
        description: newDescription,
      };
      setLocalHabits((prev) => [...prev, newHabit]);
      toggleModal();
    } else {
      Alert.alert(
        'Помилка', // Заголовок
        'Будь ласка, заповніть всі поля перед додаванням звички.', // Повідомлення
        [
          { text: 'OK', onPress: () => console.log('Alert закрито') }, // Кнопка
        ],
        { cancelable: true } // Закриття по кліку за межами
      );
    }
  };

  const allHabits = useMemo(() => {
    return data ? [...data, ...localHabits] : localHabits;
  }, [data, localHabits]);

  const filteredHabits = useMemo(() => {
    return allHabits.filter((habit) =>
      habit.habitName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allHabits, searchQuery]);

  const renderItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('HabitDetails', { habit: item })}>
        <View style={styles.habitCard}>
          <Text style={styles.habitName}>{item.habitName}</Text>
          <Text style={styles.habitDescription}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  }, [navigation]);
  

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <Text>Loading habits...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Пошук звичок..."
        placeholderTextColor="#beb6c8" // Світло-сірий колір для підказки
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={toggleModal}
      >
        <Text style={styles.addButtonText}>+ Додати звичку</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={toggleModal}
      >
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalHeader}>Додати нову звичку</Text>

      {/* Поле для введення назви звички */}
      <TextInput
        style={styles.input}
        placeholder="Назва звички"
        value={newHabitName}
        onChangeText={setNewHabitName}
        placeholderTextColor="#B0B0B0" // Колір підказки
      />

      {/* Поле для введення опису звички */}
      <TextInput
        style={[styles.input, styles.textArea]} // Використовуємо textArea для багаторядкового тексту
        placeholder="Опис звички"
        value={newDescription}
        onChangeText={setNewDescription}
        multiline
        numberOfLines={4}
        placeholderTextColor="#B0B0B0" // Колір підказки
      />

      {/* Кнопки дій */}
      <View style={styles.modalButtons}>
        <TouchableOpacity style={styles.confirmButton} onPress={addNewHabit}>
          <Text style={styles.buttonText}>Додати</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
          <Text style={styles.buttonText}>Скасувати</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  searchBar: {
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#645874', // Світліший відтінок синього для контрасту
    color: colors.textPrimary,
    placeholder: '#A8A8C1', // Світло-сірий для підказки
  },
  habitCard: {
    backgroundColor: colors.cardBackground,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.modalOverlay,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  habitDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0b2442', // Ніжно-синій для акцентної кнопки
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#1F1F3B', // Темно-синій для фону модального вікна
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#2D2D4D', // Трохи світліший темний відтінок для полів
    marginBottom: 15,
    fontSize: 16,
    color: colors.textPrimary,
    placeholderTextColor: '#A8A8C1',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#4A90E2', // Синій для кнопки "Додати"
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#3A3A5E', // Темно-сірий синій для кнопки "Скасувати"
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
