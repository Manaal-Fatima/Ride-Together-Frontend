import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import OpenRouteService from 'openrouteservice-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PublishARide() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [seats, setSeats] = useState('');
  const [pricePerSeat, setPricePerSeat] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const ORS_API_KEY = '5b3ce3597851110001cf6248973e10c8f9034fc08fe2934c5eeb1a8f';

  const geocodeLocation = async (location) => {
    if (!location) throw new Error('Location is required for geocoding');
    const Geocode = new OpenRouteService.Geocode({ api_key: ORS_API_KEY });
    try {
      const response = await Geocode.geocode({ text: location });
      if (response && response.features.length > 0) {
        return response.features[0].geometry.coordinates;
      } else {
        throw new Error('No coordinates found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  };

  const handleOfferRide = async () => {
    try {
      // Ensure all fields are filled before proceeding
      if (!pickupLocation || !dropLocation || !seats || !pricePerSeat) {
        Alert.alert('Error', 'All fields are required.');
        return;
      }

      const pickupCoords = await geocodeLocation(pickupLocation);
      const dropCoords = await geocodeLocation(dropLocation);

      // Format the date and time as required by the backend
      const formattedDate = date.toDateString(); // e.g., "Sat Aug 24 2024"
      const formattedStartTime = time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
      const formattedEndTime = formattedStartTime; // Adjust if end time differs

      // Create ride details matching backend expectations
      const rideDetails = {
        pickup_location: pickupCoords,
        dropLocation: dropCoords,
        date: formattedDate,
        starttime: formattedStartTime,
        endtime: formattedEndTime,
        numSeats: parseInt(seats, 10),
        pricePerSeat: parseFloat(pricePerSeat),
      };

      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      const response = await axios.post(
        'https://ride-together-mybackend.onrender.com/api/v1/vehicle/publish-ride',
        rideDetails,
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response.data);
      Alert.alert('Success', 'Ride created successfully');
    } catch (error) {
      console.error('Error creating ride:', error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response ? error.response.data.data : error.message);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Publish A Ride</Text>
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
      <TouchableOpacity style={styles.datePickerButton} onPress={showDatePickerModal}>
        <Text style={styles.datePickerText}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
      )}
      <TouchableOpacity style={styles.datePickerButton} onPress={showTimePickerModal}>
        <Text style={styles.datePickerText}>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker value={time} mode="time" display="default" onChange={onTimeChange} />
      )}
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
        value={pricePerSeat}
        onChangeText={setPricePerSeat}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleOfferRide}>
        <Text style={styles.buttonText}>Publish A Ride</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  datePickerText: {
    marginLeft: 10,
    color: 'gray',
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
