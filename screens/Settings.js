import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function Settings({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Сторінка налаштувань</Text>
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
});
