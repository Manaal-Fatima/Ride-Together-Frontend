import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert, TouchableOpacity,Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing a specific icon set

const DriverManagement = () => {
  const [Drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
   const [isVerified, setIsVerified] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: '',
    phone: '',
    cnic: '', 
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    try {
      const response = await axios.get(
        'https://ride-together-mybackend-manaal.onrender.com/api/v1/admin/getAllDrivers',
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setDrivers(response.data.data.drivers);
    } catch (error) {
      console.error('Error fetching Drivers:', error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response ? error.response.data.message : error.message);
    }
  };

  const deleteDriver = async (DriverId) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    try {
      const response = await axios.delete(
        `https://ride-together-mybackend-manaal.onrender.com/api/v1/admin/deleteDriver/${DriverId}`,
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Driver deleted successfully');
        setDrivers((prevDrivers) =>
          prevDrivers.filter((driver) => driver._id !== DriverId)
        );
      } else {
        Alert.alert('Error', 'Failed to delete the Driver');
      }
    } catch (error) {
      console.error('Error deleting Driver:', error);
      Alert.alert('Error', 'An error occurred while deleting the Driver');
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      'Delete Driver',
      'Are you sure you want to delete this Driver?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteDriver(id) },
      ]
    );
  };

  const updateDriver = async (DriverId) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    try {
      const response = await axios.patch(
        `https://ride-together-mybackend-manaal.onrender.com/api/v1/admin/updateDriver/${DriverId}`,
        updatedData,
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Driver details updated successfully');
        setDrivers((prevDrivers) =>
          prevDrivers.map((driver) =>
            driver._id === DriverId ? response.data.data : driver
          )
        );
        // Clear the selected Driver and input fields
        setSelectedDriver(null);
        setUpdatedData({ name: '', phone: '', cnic: '' });
      } else {
        Alert.alert('Error', 'Failed to update Driver details');
      }
    } catch (error) {
      console.error('Error updating Driver:', error);
      Alert.alert('Error', 'An error occurred while updating the Driver');
    }
  };

  const handleUpdate = (Driver) => {
    setSelectedDriver(Driver);
    setUpdatedData({
      name: Driver.name || '',
      phone: Driver.phone || '',
      
      cnic: Driver.cnic || '',
    });
  };
  const handleVerify = async (driverId, verifyStatus) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token not found');
  
    try {
      const response = await axios.patch(
        `https://ride-together-mybackend-manaal.onrender.com/api/v1/driver/verifyDriverLicense/${driverId}`,
        { is_verified: verifyStatus },
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data.success) {
        Alert.alert('Success', 'Driver verification status updated successfully');
        setDrivers((prevDrivers) =>
          prevDrivers.map((driver) =>
            driver._id === driverId ? { ...driver, is_driver_verified: verifyStatus } : driver
          )
        );
      } else {
        Alert.alert('Error', 'Failed to update driver verification status');
      }
    } catch (error) {
      console.error('Error verifying driver:', error);
      Alert.alert('Error', 'An error occurred while updating verification status');
    }
  };
  const handleMessageDriver = (phoneNumber, message) => {
    const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    Linking.openURL(smsUrl).catch((error) =>
      Alert.alert('Error', 'Could not open SMS app')
    );
  };

  
  
  const renderDriverItem = ({ item }) => (
    
       
    <View style={styles.DriverCard}>
    <View style={styles.infoContainer}>
      <View style={styles.nameRow}>
        <Text style={styles.name}>Name: {item.name || 'N/A'}</Text>
        <TouchableOpacity
          onPress={() =>
            handleMessageDriver(item.phone, 'Hello, this is a message for you!')
          }
          style={styles.messageIconContainer}
        >
          <Icon name="message" size={24} color= '#167E72' />
        </TouchableOpacity>
      </View>
      <Text>CNIC: {item.cnic}</Text>
      <Text>Average Rating: {item.avgRating || 'No ratings yet'}</Text>
      <Text>Phone: {item.phone || 'N/A'}</Text>
      <Text>
        Verification Status: {item.is_driver_verified ? 'true' : 'false'}
      </Text>
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
        <TouchableOpacity
          style={[
            styles.verifyButton,
            {
              backgroundColor: item.is_driver_verified ? '#5cb85c' : '#DC143C',
            },
          ]}
          onPress={() => handleVerify(item._id, !item.is_driver_verified)}
        >
          <Text style={styles.buttonText}>
            {item.is_driver_verified ? 'Verified' : 'Unverified'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Driver Management</Text> */}
      {selectedDriver && (
        <View style={styles.updateForm}>
          <Text style={styles.updateHeader}>Update Driver</Text>
          <TextInput
            placeholder="Full Name"
            value={updatedData.name}
            onChangeText={(text) => setUpdatedData({ ...updatedData, name: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Phone Number"
            value={updatedData.phone}
            onChangeText={(text) => setUpdatedData({ ...updatedData, phone: text })}
            style={styles.input}
          />
         
          <TextInput
            placeholder="Cnic"
            value={updatedData.cnic}
            onChangeText={(text) => setUpdatedData({ ...updatedData, cnic: text })}
            style={styles.input}
          />
          <Button
            title="Update Driver"
            onPress={() => updateDriver(selectedDriver._id)}
          />
        </View>
        // data prop that we want o/p
        //  renderItem is a func that returns some jsx
      )}
      
      <FlatList
        data={Drivers}
        keyExtractor={(item) => item._id}
        renderItem={renderDriverItem}
        ListEmptyComponent={<Text>No Drivers available</Text>}
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
  DriverCard: {
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
  nameRow: {
    flexDirection: 'row', // Arrange items horizontally
    justifyContent: 'space-between', // Space out the text and icon
    alignItems: 'center', // Center vertically for better alignment
    marginBottom: 4, // Space below the row for better separation
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageIconContainer: {
    
    padding: 4, // Add some padding around the icon for better touch area
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
  verifyButton: {
    flex: 1,
    backgroundColor: '#869986', // Green color for verification
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default DriverManagement;
