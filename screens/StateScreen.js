// src/screens/ViewStateScreen.js

import React from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet ,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 
const StateScreen = () => {
  // Use useSelector to get the state from Redux store
  const city = useSelector((state) => state.city);
  const role = useSelector((state) => state.role);
  const full_name = useSelector((state) => state.full_name);
  const phone_number = useSelector((state) => state.phone_number);
  const gender = useSelector((state) => state.gender);
  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const response = await axios.patch('https://ride-together-mybackend-manaal.onrender.com/api/v1/user/user-details-add', {
        full_name,
        phone_number,
        city,
        role,
      }
    ,
    {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.data.success) {
    console.log(response.data);
  } else {
    console.log('Error', response.data.message || 'Failed to send the notification.');
  }
} catch (error) {
  if (error.response) {
    console.log('Error', error.response.data.message || 'Failed to send notification.');
  } else {
    console.log('Error', 'An unexpected error occurred.');
  }
}
};
  return (
    <View style={styles.container}>
      <Text style={styles.label2}>State Data</Text>
      <Text style={styles.label}>city:</Text>
      <Text style={styles.value}>{city}</Text>
      
      <Text style={styles.label}>User Type:</Text>
      <Text style={styles.value}>{role}</Text>
      
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{full_name}</Text>
      
      <Text style={styles.label}>Phone Number:</Text>
      <Text style={styles.value}>{phone_number}</Text>
      <Text style={styles.label}>Gender:</Text>
      <Text style={styles.value}>{gender}</Text>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label2: {
    marginTop:20,
    justifyContent:'center',
    alignItems:'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#167E72',
    paddingVertical: 10,
    paddingHorizontal: 20,
    
    borderRadius: 50,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign:'center'
  },
});

export default StateScreen;