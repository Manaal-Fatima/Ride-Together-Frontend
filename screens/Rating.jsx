import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function Rating() {
  const [selectedRating, setSelectedRating] = useState(null);
  const [comment, setComment] = useState('');
  const [avgRating, setAvgRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(null);
  //const [driverId, setDriverId] = useState('');
  const [passengerId, setPassengerId] = useState('');
  const [token, setToken] = useState('');
  const route = useRoute();  // Get route params
  const navigation = useNavigation();
  const {driverId}=route.params;
  

  
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
       ` https://ride-together-mybackend-manaal.onrender.com/api/v1/driver/get-rating/${driverId}`,
        {
          headers: { Authorization:` ${token}` },
        }
      );
      setAvgRating(response.data.avgRating);
      setRatingCount(response.data.ratingCount);
    } catch (error) {
      console.error('Error fetching driver rating:', error);
      Alert.alert('Error fetching driver rating. Please try again.');
    }
  };

  // Submit a new rating
  const submitRating = async () => {
    if (!selectedRating) {
      Alert.alert('Please select a rating');
      return;
    }

    try {
      const [tokenData, idData] = await AsyncStorage.multiGet(['token', 'id']);
      const token = tokenData[1];
      const passengerId = idData[1];

      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }
      if (!passengerId) {
        Alert.alert('Error', 'Passenger ID not found');
        return;
      }
      // if (!passengerId || !driverId) throw new Error('Missing passenger or driver ID');

      // Call the API to submit the new rating
      const response = await axios.patch(
        'https://ride-together-mybackend-manaal.onrender.com/api/v1/driver/new-rating',
        {
          userId: passengerId,
          driverId,
          rating: selectedRating,
          comment,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      
      console.log(response.data);  // Log response data for debugging
      
      if (response.data.message === 'Rating added successfully') {
        Alert.alert('Thank you for your feedback!');
        await fetchDriverRating(driverId, token); // Refresh average rating
      } else {
        Alert.alert('Error submitting rating. Please try again.');
      }
    }catch (error) {
      console.error('API Error:', error.response || error);
      Alert.alert('Error submitting rating. Please try again.');
    }
    
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={['#095859', '#fff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1.5, y: 0.5 }}
    >
      <Text style={styles.title}>Rate the Driver</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity key={rating} onPress={() => setSelectedRating(rating)}>
            <Icon
              name={rating <= selectedRating ? 'star' : 'star-o'}
              size={30}
              color="#167E72"
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Leave a comment"
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity style={styles.button} onPress={submitRating}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {avgRating !== null && ratingCount !== null && (
        <View style={styles.ratingInfoContainer}>
          <Text style={styles.ratingInfoText}>Average Rating: {avgRating}</Text>
          <Text style={styles.ratingInfoText}>Total Ratings: {ratingCount}</Text>
        </View>
      )}
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginVertical: 20,
  },
  input: {
    borderWidth: 3,
    borderColor: '#167E72',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    marginVertical: 20,
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