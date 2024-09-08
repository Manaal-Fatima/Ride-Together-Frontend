import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


const OPENROUTESERVICE_API_KEY = '5b3ce3597851110001cf6248973e10c8f9034fc08fe2934c5eeb1a8f';;

export default function FindARide() {
  const navigation = useNavigation();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropCoordinates, setDropCoordinates] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [region, setRegion] = useState({
    latitude: 31.5499,
    longitude: 74.3473,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  // Combine selected date and time
  const handleFindRide = () => {
    const combinedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );

    if (pickupCoordinates && combinedDateTime) {
      navigation.navigate('ViewAvailableRides', { pickupCoordinates, date: combinedDateTime });
    } else {
      console.error('Pickup location and date are required');
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) {
      setSelectedTime(time);
    }
  };

  const geocodeLocation = async (location, setCoordinates) => {
    try {
      const response = await axios.get(`https://api.openrouteservice.org/geocode/search`, {
        params: {
          api_key: OPENROUTESERVICE_API_KEY,
          text: location,
        },
      });
      const { features } = response.data;
      if (features.length > 0) {
        const { geometry } = features[0];
        const coordinates = {
          latitude: geometry.coordinates[1],
          longitude: geometry.coordinates[0],
        };
        setCoordinates(coordinates);
        setRegion({
          ...region,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });
      } else {
        console.error('No location found');
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={region}>
        {pickupCoordinates && (
          <Marker coordinate={pickupCoordinates} pinColor="green" title="Pickup Location" />
        )}
        {dropCoordinates && (
          <Marker coordinate={dropCoordinates} pinColor="red" title="Drop Location" />
        )}
      </MapView>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Select Pickup Location"
          value={pickupLocation}
          onChangeText={(text) => {
            setPickupLocation(text);
            geocodeLocation(text, setPickupCoordinates);
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Select Drop Location"
          value={dropLocation}
          onChangeText={(text) => {
            setDropLocation(text);
            geocodeLocation(text, setDropCoordinates);
          }}
        />

        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
          <Icon name="calendar" size={20} color="gray" />
          <Text style={styles.datePickerText}>{selectedDate.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date(2020, 0, 1)}
            maximumDate={new Date(2030, 11, 31)}
          />
        )}

        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowTimePicker(true)}>
          <Icon name="clock-o" size={20} color="gray" />
          <Text style={styles.datePickerText}>{selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleFindRide}>
          <Text style={styles.buttonText}>Find A Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: height / 1.5,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
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
