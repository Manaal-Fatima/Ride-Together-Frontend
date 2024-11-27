import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');

  const [error, setError] = useState('');

  const validateForm = () => {
    let error = {};
    if (!email) error.email = 'Email is required';
    
    setError(error);
    return Object.keys(error).length === 0;
  }

  const handleForget = async () => {
    if (validateForm()) {
      
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      try {
        const response = await axios.post('https://ride-together-mybackend-manaal.onrender.com/api/v1/auth/forget',
           {email},
        {
          headers: {
            Authorization:`${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response.data);
      Alert.alert('Success', 'OTP send successfully');
      navigation.navigate('ResetPassword'); 
    } catch (error) {
      console.error('Error creating ride:', error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response ? error.response.data.message : error.message);
    }
  

    }
  };
  

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 38, marginBottom: 10, fontStyle: 'italic' }}>Forgot Password</Text> 
        <Text style={{ marginBottom: 30, fontSize: 15, textAlign: 'center' }}>Enter your email to receive a password reset code</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      {error.email && <Text style={styles.errorText}>{error.email}</Text>}
      
      <TouchableOpacity style={styles.button} onPress={handleForget}>
        <Text style={styles.buttonText}>Next</Text>
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