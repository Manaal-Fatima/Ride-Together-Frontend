import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewAvailableRides({ route, navigation }) {
  const { pickupCoordinates, date } = route.params;
  const [availableRides, setAvailableRides] = useState([]);

  useEffect(() => {
    const fetchAvailableRides = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'Token not found');
          return;
        }

        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        console.log('Pickup Coordinates:', pickupCoordinates);
        console.log('Requested Time:', formattedTime);

        const response = await axios.post(
          'https://ride-together-mybackend.onrender.com/api/v1/vehicle/is_nearestVehicle',
          {
            passengerLocation: pickupCoordinates,
            requestedTime: formattedTime,
          },
          {
            headers: {
              Authorization: `${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Response Data:', response.data);
        setAvailableRides(response.data || []);
      } catch (error) {
        console.error('Error fetching available rides:', error.response?.data || error.message);
        Alert.alert('Error', 'Failed to fetch available rides');
      }
    };

    fetchAvailableRides();
  }, [pickupCoordinates, date]);

  const renderRide = ({ item }) => (
    <TouchableOpacity style={styles.rideContainer}>
      <Text style={styles.rideText}>Model: {item.vehicleDetails?.vehicle_model || 'N/A'}</Text>
      <Text style={styles.rideText}>Color: {item.vehicleDetails?.vehicle_color || 'N/A'}</Text>
      <Text style={styles.rideText}>
        Plate Number: {item.vehicleDetails?.vehicle_plate_number || 'N/A'}
      </Text>
     
      <Text style={styles.rideText}>Seats Available: {item.numSeats || 'N/A'}</Text>
      <Text style={styles.rideText}>Price per Seat: {item.pricePerSeat || 'N/A'}</Text>
      <Text style={styles.rideText}>
        Distance: {item.distance ? item.distance.toFixed(2) : 'N/A'} km
      </Text>
      <Text style={styles.rideText}>
        Start Time: {new Date(item.starttime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'N/A'}
      </Text>
      <Text style={styles.rideText}>
        End Time: {new Date(item.endtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'N/A'}
      </Text>
      <Text style={styles.rideText}>Status: {item.status || 'N/A'}</Text>

      {/* Horizontal Button Container */}
      <View style={styles.buttonContainer}>
        {/* Call Button */}
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCallDriver(item.driverPhone)}
        >
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>

        {/* Request Button */}
        <TouchableOpacity
          style={styles.requestButton}
          onPress={() => handleSendRequest(item.driverId)}
        >
          <Text style={styles.buttonText}>Request</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Function to handle sending request
  const handleSendRequest = async (driverId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }
  
      const response = await axios.post(
        'https://ride-together-mybackend.onrender.com/api/v1/ride/send-request',
        {
          driverId: driverId,
          passengerId: 'yourPassengerId', // Replace with actual passenger ID
          pickupLocation: 'yourPickupLocation', // Replace with actual pickup location
          requestedDate: new Date().toISOString().split('T')[0], // Today's date
          requestedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Current time
        },
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      Alert.alert('Request Sent', response.data.message);
    } catch (error) {
      console.error('Error sending request:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to send request');
    }
  };
  

  // Function to handle making a call
  const handleCallDriver = (phoneNumber) => {
    const phoneUrl = `tel:``${phoneNumber}```;
    Linking.openURL(phoneUrl).catch((err) => Alert.alert('Error', 'Failed to make the call'));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Rides</Text>
      <FlatList
        data={availableRides}
        renderItem={renderRide}
        keyExtractor={(item) => item._id.toString()}
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
    flexDirection: 'row', // Horizontal layout
    justifyContent: 'space-between',
    marginTop: 10,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 10,
    marginRight: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  requestButton: {
    flex: 1,
    backgroundColor: '#167E72',
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});