import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

export default function Rating() {
  const [avgRating, setAvgRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(null);
  const [token, setToken] = useState('');
  const route = useRoute();  // Get route params
  const { driverId } = route.params;
  

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken || '');
      } catch (error) {
        console.error('Error fetching initial data:', error);
        Alert.alert('Error loading data. Please try again.');
      }
    };

    fetchInitialData();
  }, [route.params]);

  // Fetch driver's average rating
  const fetchDriverRating = async (driverId, token) => {
    try {
      const response = await axios.get(
        `https://ride-together-mybackend-manaal.onrender.com/api/v1/driver/get-rating/${driverId}`,
        {
          headers: { Authorization: ` ${token}` },
        }
      );
      setAvgRating(response.data.avgRating);
      setRatingCount(response.data.ratingCount);
    } catch (error) {
      console.error('Error fetching driver rating:', error);
      Alert.alert('Error fetching driver rating. Please try again.');
    }
  };

  // Fetch rating when the component is loaded
  useEffect(() => {
    if (token) {
      fetchDriverRating(driverId, token);
    }
  }, [token, driverId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Rating</Text>

      <TouchableOpacity style={styles.button} onPress={() => fetchDriverRating(driverId, token)}>
        <Text style={styles.buttonText}>Load Rating</Text>
      </TouchableOpacity>

      {avgRating !== null && ratingCount !== null && (
        <View style={styles.ratingInfoContainer}>
          <Text style={styles.ratingInfoText}>Average Rating: {avgRating}</Text>
          <Text style={styles.ratingInfoText}>Total Ratings: {ratingCount}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#167E72',
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
  ratingInfoContainer: {
    marginTop: 20,
  },
  ratingInfoText: {
    fontSize: 18,
    color: '#167E72',
    marginVertical: 5,
  },
});
