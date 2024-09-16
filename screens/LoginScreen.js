import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    let error = {};
    if (!email) error.email = 'Email is required';
    if (!password) error.password = 'Password is required';
    setError(error);
    return Object.keys(error).length === 0;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        const res = await axios.post('https://ride-together-mybackend.onrender.com/api/v1/auth/login', { email, password });

        if (res.data && res.data.success === true) {
          const { token, user } = res.data.data;
          if (token && user._id) {
            await AsyncStorage.multiSet([['token', token], ['id', user._id]]);
            navigation.navigate('UserDetails'); // Replace 'HomeScreen' with the screen you want to navigate to
          }
        } else {
          setError(res.data.message || 'Login failed.');
        }
      } catch (error) {
        setError(error.response?.data.message || 'An error occurred during login.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      {error.email && <Text style={styles.errorText}>{error.email}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      {error.password && <Text style={styles.errorText}>{error.password}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#167E72',
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
  },
});
