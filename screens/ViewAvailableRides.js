// ViewAvailableRides.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function ViewAvailableRides({ route }) {
  const { pickupCoordinates } = route.params;
  const [availableRides, setAvailableRides] = useState([]);

  useEffect(() => {
    const fetchAvailableRides = async () => {
      try {
        const response = await axios.post(
          'https://ride-together-mybackend.onrender.com/api/v1/vehicle/is_nearestVehicle',
          { passengerCoordinates: pickupCoordinates }
        );
        setAvailableRides(response.data);
      } catch (error) {
        console.error('Error fetching available rides:', error);
        Alert.alert('Error', 'Failed to fetch available rides');
      }
    };

    fetchAvailableRides();
  }, [pickupCoordinates]);

  const renderRide = ({ item }) => (
    <TouchableOpacity style={styles.rideContainer}>
      <Text style={styles.rideText}>Model: {item.vehicle_model}</Text>
      <Text style={styles.rideText}>Driver: {item.driver_name}</Text>
      <Text style={styles.rideText}>Seats Available: {item.seats_available}</Text>
      <Text style={styles.rideText}>Price per Seat: {item.price_per_person}</Text>
      <Text style={styles.rideText}>Distance: {item.distance.toFixed(2)} km</Text>
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
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  rideContainer: {
    backgroundColor: '#fff',
    padding: 16,}
   
  })