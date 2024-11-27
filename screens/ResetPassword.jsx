import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

export default function ResetPassword() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [email, setEmail] = useState('');
  const [newpass, setNewpass] = useState('');
  const [error, setError] = useState({});
  const navigation = useNavigation();
  const inputRefs = useRef([]);

  const handleOTPChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!email) errors.email = 'Email is required';
    if (!newpass) errors.newpass = 'New Password is required';
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReset = async () => {
    if (validateForm()) {
      const otp_code = otp.join('');
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }
      try {
        const response = await axios.post(
          'https://ride-together-mybackend-manaal.onrender.com/api/v1/auth/reset',
          { email, otp_code, newPassword: newpass },
          {
            headers: {
              Authorization: `${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        Alert.alert('Success', 'Password reset successful');
        navigation.navigate('FromLhr');
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        Alert.alert('Error', error.response ? error.response.data.message : error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 38, marginBottom: 10, fontStyle: 'italic' }}>Reset Password</Text>
        <Text style={{ marginBottom: 30, fontSize: 15, textAlign: 'center' }}>Enter a password to reset code</Text>
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
        placeholder="Enter your Password"
        secureTextEntry={true}
        onChangeText={(text) => setNewpass(text)}
        value={newpass}
      />
      {error.newpass && <Text style={styles.errorText}>{error.newpass}</Text>}
      <View style={styles.inputContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            maxLength={1}
            onChangeText={(value) => handleOTPChange(index, value)}
            value={digit}
            keyboardType="numeric"
            ref={(el) => (inputRefs.current[index] = el)}
          />
        ))}
      </View>
   

      <TouchableOpacity style={styles.button} onPress={handleReset}>
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
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  otpInput: {
    height: 50, // Increased height for better visibility
    width: 50,  // Square boxes
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 5,
    textAlign: 'center',
    fontSize: 20, // Larger font size for clear visibility
    fontWeight: 'bold', // Bold font for emphasis
    color: 'black', // Ensures the digits are visible
    backgroundColor: 'white', // Adds contrast
    borderRadius: 5, // Optional: to soften edges
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

