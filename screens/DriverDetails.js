
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { setContactInfo } from '../redux/screenAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

export default function DriverDetails() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [licenseImage, setLicenseImage] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      await requestFcmToken();
      configureNotificationChannel();
      handleForegroundNotifications();
    };

    initializeApp();
  }, []);

  const requestFcmToken = async () => {
    try {
      const authorizationStatus = await messaging().requestPermission();
      if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED || authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
        const token = await messaging().getToken();
        setFcmToken(token);
      } else {
        Alert.alert('Error', 'FCM permission denied');
      }
    } catch (error) {
      console.error('Error requesting FCM token:', error);
    }
  };

  const configureNotificationChannel = () => {
    if (Platform.OS === 'android') {
      PushNotification.createChannel({
        channelId: '1',
        channelName: 'Default Channel',
        channelDescription: 'A default channel for notifications',
        soundName: 'default',
        importance: 4,
      });
    }
  };

  const handleForegroundNotifications = () => {
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', remoteMessage.notification?.body);
  
      PushNotification.localNotification({
        channelId: '1',
        title: remoteMessage.notification?.title,
        message: remoteMessage.notification?.body,
      });
    });
  
    return unsubscribeForeground;
  };
  
  const handleNext = async () => {
    if (!name || !phone || !cnic || !licenseImage) {
      Alert.alert('Error', 'Please fill all fields and upload your license image.');
      return;
    }

    if (!fcmToken) {
      Alert.alert('Error', 'Failed to retrieve FCM Token.');
      return;
    }

    dispatch(setContactInfo(name, phone));

    try {
      const [tokenData, idData] = await AsyncStorage.multiGet(['token', 'id']);
      const token = tokenData[1];
      const id = idData[1];

      const driverDetailsResponse = await axios.post(
        `https://ride-together-mybackend.onrender.com/api/v1/driver/driver-details/${id}`,
        {
          name,
          phone,
          cnic,
          fcmToken,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (driverDetailsResponse.data.success) {
        Alert.alert('Driver Registered');
        console.log(driverDetailsResponse.data);
        // navigation.navigate('ViewAvailableRides'); // Uncomment if you want to navigate
      } else {
        Alert.alert('Error', driverDetailsResponse.data.message || 'Failed to update driver details.');
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Request failed.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  const sendNotification = async (driverFcmToken) => {
    if (!driverFcmToken) {
      Alert.alert('Error', 'No FCM Token found.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      const response = await axios.post(
        'https://ride-together-mybackend.onrender.com/api/v1/driver/ride-request',
        {
          token: driverFcmToken,
          title: 'New Ride Request',
          body: 'A passenger has requested a ride from you.',
        },
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        console.log(response.data);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to send the notification.');
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Failed to send notification.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const { uri } = pickerResult.assets[0];
      setLicenseImage({ uri });
    } else {
      console.log('Image picker was canceled');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome to Ride Together</Text>
      <Text style={styles.subHeaderText}>Tell us a little bit about yourself</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#999"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone No"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        onChangeText={setPhone}
        value={phone}
      />
      <TextInput
        style={styles.input}
        placeholder="CNIC"
        placeholderTextColor="#999"
        keyboardType="numeric"
        onChangeText={setCnic}
        value={cnic}
      />

      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload License Image</Text>
      </TouchableOpacity>

      {licenseImage && (
        <Image source={{ uri: licenseImage.uri }} style={styles.imagePreview} />
      )}

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => sendNotification(fcmToken)}>
        <Text style={styles.buttonText}>Send Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subHeaderText: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
  },
  input: {
    height: 40,
    width: '90%',
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#F0F0F0',
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePickerButton: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});

