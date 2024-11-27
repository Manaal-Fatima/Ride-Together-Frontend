import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import axios from 'axios';

export default function ViewBookedPassengers({ route }) {
  const { rideId } = route.params; // Ride ID passed from the previous screen
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(''); // State to store token

  // Fetch token from AsyncStorage
  useEffect(() => {
    const getToken = async () => {
      try {
        const tokenData = await AsyncStorage.getItem('token');
        if (tokenData) {
          setToken(tokenData); // Save token in state
          console.log('Token:', tokenData);
        } else {
          console.error('Token not found');
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    getToken();
  }, []);

  // API call to fetch booked passengers
  const fetchBookedPassengers = async () => {
    if (!token) {
      console.log('Token not available');
      return;
    }

    try {
      const response = await axios.get(
        `https://ride-together-mybackend-manaal.onrender.com/api/v1/vehicle/booked-passengers/${rideId}`,
        {
          headers: {
            Authorization: `${token}`, // Add token to headers
          },
        }
      );
      setPassengers(response.data.bookedPassengers);
    } catch (error) {
      console.error('Error fetching passengers:', error);
      setError('Error fetching passengers');
      Alert.alert('Error', 'Failed to fetch booked passengers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookedPassengers(); // Fetch passengers once the token is available
    }
  }, [token]);

  const renderPassenger = ({ item }) => (
    <View style={styles.passengerContainer}>
      <Text style={styles.text}>Name: {item.passengerDetails.name}</Text>
      <Text style={styles.text}>Gender: {item.passengerDetails.gender}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={passengers}
          keyExtractor={(item) => item.passengerId.toString()}
          renderItem={renderPassenger}
          ListEmptyComponent={<Text style={styles.emptyText}>No passengers booked yet</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  passengerContainer: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

