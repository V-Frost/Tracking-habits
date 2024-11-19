// components/CustomButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'grey',
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    borderRadius: 12,
    marginHorizontal: 5, 
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 14, 
    fontWeight: 'bold',
  },
});
