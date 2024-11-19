import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HabitDetails({ route }) {
  const { habit } = route.params;

  const [reminderText, setReminderText] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const loadReminder = async () => {
      try {
        const storedReminder = await AsyncStorage.getItem(`reminder-${habit.id}`);
        if (storedReminder) {
          const { text, time } = JSON.parse(storedReminder);
          setReminderText(text);
          setSelectedTime(new Date(time));
        }
      } catch (error) {
        console.error('Помилка завантаження нагадування:', error);
      }
    };

    loadReminder();
  }, [habit.id]);

  const convertToUTC = (date) => {
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );
  };
  

  const handleAddReminder = async () => {
    if (!reminderText) {
      Alert.alert('Помилка', 'Будь ласка, введіть текст нагадування.');
      return;
    }
  
    try {
      const now = new Date();
      let triggerTime = new Date(selectedTime);
  
      triggerTime.setFullYear(now.getFullYear());
      triggerTime.setMonth(now.getMonth());
      triggerTime.setDate(now.getDate());
  
      if (triggerTime <= now) {
        triggerTime.setDate(triggerTime.getDate() + 1);
      }
  
      const utcTriggerTime = convertToUTC(triggerTime);
  
      console.log('Запланований час нагадування (UTC):', utcTriggerTime.toISOString());
  
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Помилка', 'Немає дозволу на сповіщення.');
        return;
      }
  
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Нагадування',
          body: reminderText,
          sound: true,
        },
        trigger: {
          date: utcTriggerTime,
        },
      });
  
      await AsyncStorage.setItem(
        `reminder-${habit.id}`,
        JSON.stringify({ text: reminderText, time: triggerTime.toISOString() })
      );
  
      // Вібрація з перевіркою
      try {
        console.log('Спроба виклику Haptics.notificationAsync');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
        // Резервний виклик вібрації
        console.log('Спроба виклику Vibration.vibrate з шаблоном');
        Vibration.vibrate([500, 200, 500]); // Шаблон вібрації
      } catch (error) {
        console.log('Помилка вібрації:', error);
      
        // Альтернативний виклик
        console.log('Спроба виклику простого Vibration.vibrate');
        Vibration.vibrate(500); // Простий виклик вібрації
      }
      
  
      console.log('Додатковий виклик Vibration API для перевірки');
      Vibration.vibrate(500); // Додатковий виклик на випадок відсутності Haptics
  
      Alert.alert(
        'Успіх',
        `Нагадування "${reminderText}" встановлено на ${triggerTime.toLocaleTimeString()}.`
      );
    } catch (error) {
      console.error('Помилка встановлення нагадування:', error);
      Alert.alert('Помилка', 'Не вдалося встановити нагадування.');
    }
  };
  
  
  
  
  

  const showTimePicker = () => {
    setShowPicker(true);
  };

  const handleTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedTime;
    setShowPicker(false);
    setSelectedTime(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Деталі звички</Text>
      <Text style={styles.habitName}>Назва: {habit.habitName}</Text>
      <Text style={styles.description}>Опис: {habit.description}</Text>

      <TextInput
        style={styles.input}
        placeholder="Введіть текст нагадування"
        placeholderTextColor="#888"
        value={reminderText}
        onChangeText={setReminderText}
      />

      <Button title="Вибрати час" onPress={showTimePicker} />

      <Text style={styles.time}>Час нагадування: {selectedTime.toLocaleTimeString()}</Text>

      {showPicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <Button title="Зберегти нагадування" onPress={handleAddReminder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A1A2E',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F7F7F7',
    marginBottom: 20,
    textAlign: 'center',
  },
  habitName: {
    fontSize: 18,
    color: '#F7F7F7',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: '#F7F7F7',
    backgroundColor: '#2E2E3A',
  },
  time: {
    fontSize: 16,
    color: '#F7F7F7',
    marginBottom: 20,
    textAlign: 'center',
  },
});