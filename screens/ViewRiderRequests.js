import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function ViewRiderRequests() {
  const [rideRequests, setRideRequests] = useState([]);

  useEffect(() => {
    const fetchRiderRequests = async () => {
      try {
        const response = await axios.get(
          'https://ride-together-mybackend.onrender.com/api/v1/vehicle/driver-requests'
        );
        setRideRequests(response.data);
      } catch (error) {
        console.error('Error fetching rider requests:', error);
        Alert.alert('Error', 'Failed to fetch rider requests');
      }
    };

    fetchRiderRequests();
  }, []);

  const renderRequest = ({ item }) => (
    <TouchableOpacity style={styles.requestContainer}>
      <Text style={styles.requestText}>Pickup: {item.pickupLocation}</Text>
      <Text style={styles.requestText}>Dropoff: {item.dropLocation}</Text>
      <Text style={styles.requestText}>Seats: {item.numSeats}</Text>
      <Text style={styles.requestText}>Price per Seat: {item.pricePerSeat}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rider Requests</Text>
      <FlatList
        data={rideRequests}
        renderItem={renderRequest}
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
  requestContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  requestText: {
    fontSize: 16,
    marginBottom: 8,
  },
});
