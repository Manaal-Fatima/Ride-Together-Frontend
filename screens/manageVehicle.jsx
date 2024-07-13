import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function ManageVehicle() {
  const [carType, setCarType] = useState('');
  const [manufacturerName, setManufacturerName] = useState('');
  const [modelName, setModelName] = useState('');
  const [modelYear, setModelYear] = useState('');
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  const [numberOfSeats, setNumberOfSeats] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');

  const handleSave = () => {
    // Handle saving of vehicle details
    const vehicleDetails = {
      carType,
      manufacturerName,
      modelName,
      modelYear,
      vehiclePlateNumber,
      numberOfSeats,
      vehicleColor,
    };
    console.log(vehicleDetails);
    // Add your save functionality here, e.g., sending data to server or storing locally
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicle Details</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={carType}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => setCarType(itemValue)}
        >
          <Picker.Item label="Select Car Type" value="" />
          <Picker.Item label="Sedan" value="Sedan" />
          <Picker.Item label="SUV" value="SUV" />
          <Picker.Item label="Truck" value="Truck" />
          <Picker.Item label="Van" value="Van" />
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Manufacturer Name"
        value={manufacturerName}
        onChangeText={setManufacturerName}
      />
      <TextInput
        style={styles.input}
        placeholder="Model Name"
        value={modelName}
        onChangeText={setModelName}
      />
      <TextInput
        style={styles.input}
        placeholder="Model Year"
        value={modelYear}
        onChangeText={setModelYear}
        keyboardType="numeric"
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
