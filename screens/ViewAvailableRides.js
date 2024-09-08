import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ViewAvailableRides({ route, navigation }) {
  const { pickupCoordinates, date } = route.params;
  const [availableRides, setAvailableRides] = useState([]);
  useEffect(() => {
    const mockData = [
      {
        vehicleDetails: {
          vehicle_model: '2023',
          vehicle_color: 'red',
        },
        driver_name: 'John Doe',
        seats_available: 4,
        price_per_person: 90,
        distance: 5,
      },
    ];
    setAvailableRides(mockData);
  }, []);

  useEffect(() => {
    
    const fetchAvailableRides = async () => {
      const token = await AsyncStorage.getItem('token');
  
      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }
  
      try {
        const response = await axios.post(
          'https://ride-together-mybackend.onrender.com/api/v1/vehicle/is_nearestVehicle',
          {
            passengerLocation: pickupCoordinates,
            requestedTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            requestedDate: date.toISOString().split('T')[0],
          },
          {
            headers: {
              Authorization: ` ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        console.log('Response Data:', response.data);
        // Assuming response.data is an array of ride objects
        setAvailableRides(response.data);
      } catch (error) {
        console.error('Error fetching available rides:', error.response ? error.response.data : error.message);
        Alert.alert('Error', 'Failed to fetch available rides');
      }
    };
  
    fetchAvailableRides();
  }, [pickupCoordinates, date]);
  

  const handleChat = (driverId) => {
    // Navigate to the chat screen with the driver's details
    navigation.navigate('ChatScreen', { driverId });
  };

  const handleRequest = async (driverId) => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }

      // Send a request to the driver
      await axios.post(
        'https://ride-together-mybackend.onrender.com/api/v1/vehicle/send-request',
        {
          driverId,
        },
        {
          headers: {
            Authorization: ` ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      Alert.alert('Success', 'Request sent to the driver');
    } catch (error) {
      console.error('Error sending request:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to send request to the driver');
    }
  };

  const renderRide = ({ item }) => (
    <TouchableOpacity style={styles.rideContainer}>
      <Text style={styles.rideText}>Model: {item.vehicle_model || 'N/A'}</Text>
      <Text style={styles.rideText}>Driver: {item.driver_name || 'N/A'}</Text>
      <Text style={styles.rideText}>Seats Available: {item.seats_available || 'N/A'}</Text>
      <Text style={styles.rideText}>Price per Seat: {item.price_per_person || 'N/A'}</Text>
      <Text style={styles.rideText}>
        Distance: {item.distance ? item.distance.toFixed(2) : 'N/A'} km
      </Text>

      {/* Chat and Request Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.chatButton} onPress={() => handleChat(item.driver_id)}>
          <Icon name="comments" size={20} color="#fff" />
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.requestButton} onPress={() => handleRequest(item.driver_id)}>
          <Text style={styles.buttonText}>Request</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Rides</Text>
      <FlatList
        data={availableRides}
        renderItem={renderRide}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rideContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  rideText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  chatButton: {
    flexDirection: 'row',
    backgroundColor: '#167E72',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  requestButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
});
