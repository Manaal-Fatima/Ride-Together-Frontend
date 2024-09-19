import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function SuccessScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/SS.png')} style={styles.image} />
      <Text style={styles.message}>Waiting for Riders</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ViewRiderRequests')}
      >
        <Text style={styles.buttonText}>View Requests</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  message: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#167E72',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
