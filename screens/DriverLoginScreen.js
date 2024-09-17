import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

export default function Messages() {
  
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      await requestFcmToken();
      configureNotificationChannel();
      handleForegroundNotifications();
    };

    initializeApp();
  }, []);

  // Request FCM Token
  const requestFcmToken = async () => {
    try {
      const authorizationStatus = await messaging().requestPermission();
      if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED || 
          authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
        const token = await messaging().getToken();
        setFcmToken(token);
      } else {
        Alert.alert('Error', 'FCM permission denied');
      }
    } catch (error) {
      console.error('Error requesting FCM token:', error);
    }
  };

  // Configure Notification Channel for Android
  const configureNotificationChannel = () => {
    if (Platform.OS === 'android') {
      PushNotification.createChannel({
        channelId: 'default-channel-id',
        channelName: 'Default Channel',
        channelDescription: 'A default channel for notifications',
        soundName: 'default',
        importance: 4, // High importance for notifications
      });
    }
  };

  // Handle Foreground Notifications
  const handleForegroundNotifications = () => {
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived in the foreground!', remoteMessage);

      // Display local notification
      PushNotification.localNotification({
        channelId: 'default-channel-id',
        title: remoteMessage.notification?.title,
        message: remoteMessage.notification?.body,
      });
    });

    return () => {
      unsubscribeForeground(); // Clean up the listener when the component unmounts
    };
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
          notification: {
            title: 'New Ride Request',
            body: 'A passenger has requested a ride from you.',
          },
        
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
        Alert.alert('Notification Sent', 'Notification has been successfully sent.');
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

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome to Ride Together</Text>
      <Text style={styles.subHeaderText}>Tell us a little bit about yourself</Text>

      
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
 
});