import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
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

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        const res = await axios.post('https://ride-together-mybackend-manaal.onrender.com/api/v1/auth/register', { email, password });
        
        if (res.data.success === true) {  
          Alert.alert('Registration successful!');
    
          const { token } = res.data.data;
          const id = res.data.data.user._id;
    
          if (token && id) {
            await AsyncStorage.multiSet([['token', token], ['id', id]]);
            navigation.navigate('OtpScreen'); // Or navigate to the Home screen if OTP is not required
          } else {
            setError('Token or ID not found in response.');
          }
        } else {
          setError(res.data.message || 'Something went wrong.');
        }
      } catch (error) {
        const msg = error.response?.data.message || 'An error occurred during registration.'
        Alert.alert(msg);
        setError(msg);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Join us via Email</Text>
        <Text style={styles.subtitle}>We'll send you a verification code</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      {error.email && <Text style={styles.errorText}>{error.email}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      {error.password && <Text style={styles.errorText}>{error.password}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
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
  title: {
    fontSize: 38,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  subtitle: {
    marginBottom: 30,
    fontSize: 15,
    textAlign: 'center',
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
  linkText: {
    marginTop: 20,
    color: '#167E72',
    textDecorationLine: 'underline',
  },
});

