import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setContactInfo } from '../redux/screenAction';

export default function UserDetails() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Retrieve city and role from Redux store
  const city = useSelector((state) => state.city);
  const role = useSelector((state) => state.role);
  
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const response = await axios.patch('https://ride-together-mybackend.onrender.com/api/v1/user/user-details-add', {
        full_name: name,
        phone_number: phone,
        city,  // Use city from Redux
        role,  // Use role from Redux
      },
      {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        // Save data to Redux
        dispatch(setContactInfo(name, phone));
        console.log(response.data);

        // Navigate to the next screen
        navigation.navigate('FindARide');
      } else {
        console.log('Error', response.data.message || 'Failed to save details.');
      }
    } catch (error) {
      if (error.response) {
        console.log('Error', error.response.data.message || 'Failed to save details.');
      } else {
        console.log('Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome to Ride Together </Text>
      <Text style={styles.subHeaderText}>Tell us a little bit about yourself</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#999"
        onChangeText={text => setName(text)}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone No"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        onChangeText={text => setPhone(text)}
        value={phone}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save and Continue</Text>
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
    backgroundColor: '#FFF',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subHeaderText: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
  },
  input: {
    height: 40,
    width: '90%',
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#F0F0F0',
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
