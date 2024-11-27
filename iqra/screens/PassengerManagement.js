import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PassengerManagement = () => {
  const [passengers, setPassengers] = useState([]);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    city: '',
  });
//  fetchPassengers()a function that retrieves a list of passengers from an API or database when the component loads
  useEffect(() => {
    fetchPassengers();
  }, []);

  const fetchPassengers = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    try {
      const response = await axios.get(
        'https://ride-together-mybackend-manaal.onrender.com/api/v1/admin/getAllPassengers',
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data.data.passengers);

      setPassengers(response.data.data.passengers);
    } catch (error) {
      console.error('Error fetching passengers:', error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response ? error.response.data.message : error.message);
    }
  };

  const deletePassenger = async (passengerId) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    try {
      const response = await axios.delete(
        `https://ride-together-mybackend-manaal.onrender.com/api/v1/admin/deletePassenger/${passengerId}`,
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Passenger deleted successfully');
        setPassengers((prevPassengers) =>
          prevPassengers.filter((passenger) => passenger._id !== passengerId)
        );
      } else {
        Alert.alert('Error', 'Failed to delete the passenger');
      }
    } catch (error) {
      console.error('Error deleting passenger:', error);
      Alert.alert('Error', 'An error occurred while deleting the passenger');
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      'Delete Passenger',
      'Are you sure you want to delete this passenger?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deletePassenger(id) },
      ]
    );
  };

  const updatePassenger = async (passengerId) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    try {
      const response = await axios.patch(
        `https://ride-together-mybackend-manaal.onrender.com/api/v1/admin/updatePassenger/${passengerId}`,
        updatedData,
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
     console.log(response.data);
      if (response.data.success) {
        Alert.alert('Success', 'Passenger details updated successfully');
        setPassengers((prevPassengers) =>
          prevPassengers.map((passenger) =>
            passenger._id === passengerId ? response.data.data : passenger
          )
        );
        // Clear the selected passenger and input fields
        setSelectedPassenger(null);
        setUpdatedData({ full_name: '', phone_number: '', email: '', city: '' });
      } else {
        Alert.alert('Error', 'Failed to update passenger details');
      }
    } catch (error) {
      console.error('Error updating passenger:', error);
      Alert.alert('Error', 'An error occurred while updating the passenger');
    }
  };

  const handleUpdate = (passenger) => {
    setSelectedPassenger(passenger);
    setUpdatedData({
      full_name: passenger.full_name || '',
      phone_number: passenger.phone_number || '',
      email: passenger.email || '',
      city: passenger.city || '',
    });
  };

  const renderPassengerItem = ({ item }) => (
    <View style={styles.passengerCard}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Name: {item.full_name || 'N/A'}</Text>
        <Text>Email: {item.email}</Text>
        <Text>City: {item.city || 'N/A'}</Text>
        <Text>Phone: {item.phone_number || 'N/A'}</Text>
        <View style={styles.buttonContainer}>
        <TouchableOpacity
            style={styles.updateButton}
            onPress={() => handleUpdate(item)}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => confirmDelete(item._id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
         
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Passenger Management</Text> */}
      {selectedPassenger && (
        <View style={styles.updateForm}>
          <Text style={styles.updateHeader}>Update Passenger</Text>
          <TextInput
            placeholder="Full Name"
            value={updatedData.full_name}
            onChangeText={(text) => setUpdatedData({ ...updatedData, full_name: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Phone Number"
            value={updatedData.phone_number}
            onChangeText={(text) => setUpdatedData({ ...updatedData, phone_number: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={updatedData.email}
            onChangeText={(text) => setUpdatedData({ ...updatedData, email: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="City"
            value={updatedData.city}
            onChangeText={(text) => setUpdatedData({ ...updatedData, city: text })}
            style={styles.input}
          />
          <Button
            title="Update Passenger"
            onPress={() => updatePassenger(selectedPassenger._id)}
          />
        </View>
      )}
      <FlatList
        data={passengers}
        keyExtractor={(item) => item._id}
        renderItem={renderPassengerItem}
        ListEmptyComponent={<Text>No passengers available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  passengerCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: 'red',
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#167E72',
    padding: 10,
    marginRight: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  updateForm: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  updateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default PassengerManagement;
