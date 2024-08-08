import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import haversine from 'haversine-distance';
import Geocoder from 'react-native-geocoding';

// Initialize the Geocoder with your Google API key
Geocoder.init('AIzaSyAeW3Koz65c90su2x0c0M2Flsx2NLfaVhM');

export default function FindARide() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropCoordinates, setDropCoordinates] = useState(null);
  const [distance, setDistance] = useState(null);

  const handleFindRide = () => {
    console.log('Find a ride with:', { pickupLocation, dropLocation, date });
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'android');
    setTime(currentTime);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const getCoordinates = async (location, type) => {
    try {
      const response = await Geocoder.from(location);
      const coordinates = response.results[0].geometry.location;
      if (type === 'pickup') {
        setPickupCoordinates({ latitude: coordinates.lat, longitude: coordinates.lng });
      } else {
        setDropCoordinates({ latitude: coordinates.lat, longitude: coordinates.lng });
      }
    } catch (error) {
      console.error('Error getting coordinates:', error);
    }

    if (pickupCoordinates && dropCoordinates) {
      const distance = haversine(pickupCoordinates, dropCoordinates) / 1000; // Distance in kilometers
      setDistance(distance.toFixed(2));
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: pickupCoordinates?.latitude || 31.515424215570537,
          longitude: pickupCoordinates?.longitude || 74.30828335635269,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        {pickupCoordinates && (
          <Marker
            coordinate={pickupCoordinates}
            title="Pickup Location"
            pinColor="green"
          />
        )}
        {dropCoordinates && (
          <Marker
            coordinate={dropCoordinates}
            title="Drop Location"
            pinColor="red"
          />
        )}
      </MapView>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Select Pickup Location"
          value={pickupLocation}
          onChangeText={(value) => {
            setPickupLocation(value);
            getCoordinates(value, 'pickup');
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Select Drop Location"
          value={dropLocation}
          onChangeText={(value) => {
            setDropLocation(value);
            getCoordinates(value, 'drop');
          }}
        />

        <TouchableOpacity style={styles.datePickerButton} onPress={showDatePickerModal}>
          <Icon name="calendar" size={20} color="gray" />
          <Text style={styles.datePickerText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date(2020, 0, 1)}
            maximumDate={new Date(2030, 11, 31)}
          />
        )}

        <TouchableOpacity style={styles.datePickerButton} onPress={showTimePickerModal}>
          <Icon name="clock-o" size={20} color="gray" />
          <Text style={styles.datePickerText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        {distance && (
          <Text style={styles.distanceText}>Distance: {distance} km</Text>
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
  distanceText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
  },
});