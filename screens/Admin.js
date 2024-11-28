import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Admin() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Admin Dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Optional: Adds a light background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Optional: Title color
  },
});
