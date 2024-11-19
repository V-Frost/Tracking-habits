import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';

const colors = {
  primary: '#E94560',
  secondary: '#F0A500',
  background: '#1A1A2E',
  cardBackground: '#16213E',
  border: '#222831',
  textPrimary: '#F7F7F7',
  textSecondary: '#CCCCCC',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
  danger: '#E94560',
};

const fetchHabits = async () => {
  const response = await fetch(
    'https://my-json-server.typicode.com/V-Frost/tracking-habits/habits'
  );
  if (!response.ok) {
    throw new Error('Failed to fetch habits');
  }
  return response.json();
};

export default function Main({ navigation }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['habits'],
    queryFn: fetchHabits,
  });

  const [localHabits, setLocalHabits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
      if (!userLoggedIn) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginPage' }],
        });
      }
    };
    checkLoginStatus();
  }, [navigation]);

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
        'Помилка',
        'Будь ласка, заповніть всі поля перед додаванням звички.',
        [{ text: 'OK', onPress: () => console.log('Alert закрито') }],
        { cancelable: true }
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

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('HabitDetails', { habit: item })}
        >
          <View style={styles.habitCard}>
            <Text style={styles.habitName}>{item.habitName}</Text>
            <Text style={styles.habitDescription}>{item.description}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading habits...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Пошук звичок..."
        placeholderTextColor="#beb6c8"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
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
            <TextInput
              style={styles.input}
              placeholder="Назва звички"
              value={newHabitName}
              onChangeText={setNewHabitName}
              placeholderTextColor="#B0B0B0"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Опис звички"
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#B0B0B0"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={addNewHabit}
              >
                <Text style={styles.buttonText}>Додати</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={toggleModal}
              >
                <Text style={styles.buttonText}>Скасувати</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Statistics')}>
          <Image
            source={require('../assets/statistics.png')}
            style={[styles.navIcon, { tintColor: '#FFFFFF' }]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image
            source={require('../assets/settings.png')}
            style={[styles.navIcon, { tintColor: '#FFFFFF' }]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../assets/profile.png')}
            style={[styles.navIcon, { tintColor: '#FFFFFF' }]}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Відступ для статус-бара

  },
  logoutText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchBar: {
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 30,
    marginTop: 45,
    backgroundColor: '#645874',
    color: colors.textPrimary,
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
    bottom: 80, // Розташовуємо над панелькою
    right: 15, // Відступ від правого краю
    backgroundColor: '#0b2442',
    borderRadius: 50,
    padding: 15,
    elevation: 3, // Тінь для Android
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#1F1F3B',
    borderRadius: 15,
    padding: 20,
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
    backgroundColor: '#2D2D4D',
    marginBottom: 15,
    fontSize: 16,
    color: colors.textPrimary,
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
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#3A3A5E',
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#252541',
    borderTopWidth: 1,
    borderColor: colors.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0, // Забезпечує, що панель впирається в правий край
    elevation: 5, // Тінь для Android
    shadowColor: '#000', // Тінь для iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  navIcon: {
    width: 40,
    height: 40,
    
  },
});