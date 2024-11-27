import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ManageVehicle() {
  const navigation = useNavigation();
  const [carType, setCarType] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  const [numberOfSeats, setNumberOfSeats] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');

  const handleSave = async () => {
    const vehicleDetails = {
      car_type: carType,
      vehicle_model: vehicleModel,
      vehicle_plate_number: vehiclePlateNumber,
      number_of_seats: parseInt(numberOfSeats, 10),
      vehicle_color: vehicleColor,
    };
  
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token not found');
      }
  
      // Make the API request with the Authorization header
      const response = await axios.post(
        'https://ride-together-mybackend-manaal.onrender.com/api/v1/vehicle/vehicle_details_add',
        vehicleDetails,
        {
          headers: {
            'Authorization': `${token}`, // Include the token in the Authorization header
            'Content-Type': 'application/json', // Ensure Content-Type is set
          },
        }
      );
  
      console.log(response.data);
      alert('Vehicle details added successfully');
      navigation.navigate('PublishARide');
    } catch (error) {
      console.error('Error response:', error.response ? error.response.data : error.message);
      alert('Failed to add vehicle details');
    }
  };
  

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Vehicle Details</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={carType}
          style={styles.input}
          onValueChange={(itemValue) => setCarType(itemValue)}
        >
          <Picker.Item label="Select Car Type" value="" />
          <Picker.Item label="Mehran" value="Sedan" />
          <Picker.Item label="Suzuki" value="SUV" />
          <Picker.Item label="Toyota" value="Truck" />
          <Picker.Item label="Altas" value="Van" />
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Vehicle Model"
        value={vehicleModel}
        onChangeText={setVehicleModel}
      />
      <TextInput
        style={styles.input}
        placeholder="Vehicle Plate Number"
        value={vehiclePlateNumber}
        onChangeText={setVehiclePlateNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Seats"
        value={numberOfSeats}
        onChangeText={setNumberOfSeats}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Vehicle Color"
        value={vehicleColor}
        onChangeText={setVehicleColor}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save </Text>
      </TouchableOpacity>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#167E72',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});