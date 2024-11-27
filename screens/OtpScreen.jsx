import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OtpCode() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleOTPChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input field automatically
    if (value !== '' && index < otp.length - 1) {
      const nextInput = index + 1;
      inputs[nextInput].focus();
    }
  };

  const inputs = [];

  const verifyOtp = async () => {
    const otpCode = otp.join('');
    try {
      const token = await AsyncStorage.getItem('token');
     
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':` ${token}`
        }
      };
  
      console.log('Request Config:', config);
  
      const response = await axios.post(
        'https://ride-together-mybackend-manaal.onrender.com/api/v1/auth/verify-otp',
        { otp_code: otpCode },
        config
      );
  
      console.log('API Response:', response.data);

  
      if (response.data.success) {
        Alert.alert('OTP verification successful!');
        console.log('API Response:', response.data);
        navigation.navigate('FromLhr');
      } else {
        setError(response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        setError(error.response.data.message || 'An error occurred during verification.');
      } else {
        setError('An error occurred during verification.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>We sent you a code</Text>
        <Text>We sent it via Email</Text>
      </View>
      <View style={styles.inputContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.input}
            maxLength={1}
            onChangeText={(value) => handleOTPChange(index, value)}
            value={digit}
            keyboardType="numeric"
            ref={(input) => { inputs[index] = input; }}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={verifyOtp}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 38,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '20%',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#167E72',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
