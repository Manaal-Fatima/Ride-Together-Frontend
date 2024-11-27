import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import OpenRouteService from 'openrouteservice-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function PublishARide() {
  const navigation = useNavigation();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [seats, setSeats] = useState('');
  const [pricePerSeat, setPricePerSeat] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const ORS_API_KEY =
    '5b3ce3597851110001cf6248973e10c8f9034fc08fe2934c5eeb1a8f';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('ViewRiderRequests')}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>View Requests</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const geocodeLocation = async (location) => {
    const Geocode = new OpenRouteService.Geocode({ api_key: ORS_API_KEY });
    try {
      const response = await Geocode.geocode({ text: location });
      if (response?.features?.length > 0) {
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
      if (!pickupLocation || !dropLocation || !seats || !pricePerSeat) {
        Alert.alert('Error', 'All fields are required.');
        return;
      }

      const pickupCoords = await geocodeLocation(pickupLocation);
      const dropCoords = await geocodeLocation(dropLocation);

      const formattedDate = date.toDateString();
      const formattedStartTime = startTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const formattedEndTime = endTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const rideDetails = {
        pickup_location: { type: 'Point', coordinates: pickupCoords },
        dropLocation: { type: 'Point', coordinates: dropCoords },
        date: formattedDate,
        starttime: formattedStartTime,
        endtime: formattedEndTime,
        numSeats: parseInt(seats, 10),
        pricePerSeat: parseFloat(pricePerSeat),
      };

      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      const response = await axios.post(
        'https://ride-together-mybackend-manaal.onrender.com/api/v1/vehicle/publish-ride',
        rideDetails,
        { headers: { Authorization: `${token}`, 'Content-Type': 'application/json' } }
      );

      console.log('API Response:', response.data);
      const vehicleId = response.data.data.ride.vehicleId;
      if (vehicleId) {
        await AsyncStorage.setItem('vehicleId', vehicleId);
        Alert.alert('Success', 'Ride created successfully');
        navigation.navigate('SuccessScreen');
      } else {
        Alert.alert('Error', 'Vehicle ID not returned from the server.');
      }
    } catch (error) {
      console.error('Error creating ride:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data.message || error.message);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate || date);
  };

  const onStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    setStartTime(selectedTime || startTime);
  };

  const onEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    setEndTime(selectedTime || endTime);
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
      <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.datePickerText}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
      )}
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowStartTimePicker(true)}
      >
        <Text style={styles.datePickerText}>
          Start Time: {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker value={startTime} mode="time" display="default" onChange={onStartTimeChange} />
      )}
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowEndTimePicker(true)}
      >
        <Text style={styles.datePickerText}>
          End Time: {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker value={endTime} mode="time" display="default" onChange={onEndTimeChange} />
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
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#f4f4f4' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 16, backgroundColor: 'white' },
  datePickerButton: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 16, backgroundColor: 'white' },
  datePickerText: { color: 'gray' },
  button: { backgroundColor: '#167E72', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16 },
  headerButton: { marginRight: 10 },
  headerButtonText: { color: '#007bff', fontSize: 16 },
});
