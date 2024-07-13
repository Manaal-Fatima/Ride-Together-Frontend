import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker } from 'react-native';
import DatePicker from 'react-native-datepicker';

export default function OfferARide() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [vehicle, setVehicle] = useState('');
  const [seats, setSeats] = useState('');
  const [price, setPrice] = useState('');

  const handleOfferRide = () => {
    // Handle offering a ride logic here
    console.log('Offer a ride with:', { pickupLocation, dropLocation, date, vehicle, seats, price });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Offer A Ride</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Pickup Location"
        value={pickupLocation}
        onChangeText={setPickupLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Drop Location"
        value={dropLocation}
        onChangeText={setDropLocation}
      />
      <DatePicker
        style={styles.datePicker}
        date={date}
        mode="date"
        placeholder="Departure Date & Time"
        format="YYYY-MM-DD HH:mm"
        minDate="2020-01-01"
        maxDate="2030-12-31"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        onDateChange={(date) => { setDate(date) }}
      />
      <TextInput
        style={styles.input}
        placeholder="Select Vehicle"
        value={vehicle}
        onChangeText={setVehicle}
      />
      <TextInput
        style={styles.input}
        placeholder="No of Seats"
        value={seats}
        onChangeText={setSeats}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Price Per Seat"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      
      <TouchableOpacity style={styles.button} onPress={handleOfferRide}>
        <Text style={styles.buttonText}>Offer A Ride</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  datePicker: {
    width: '100%',
    marginBottom: 20,
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
