import React, { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import DriverDetails from './screens/DriverDetails'; // Import your Messages screen
import Messages from './screens/Messages';
const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    const checkInitialNotification = async () => {
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        console.log('Initial notification:', initialNotification);
        // Handle navigation or other logic based on notification data
      }
    };

    checkInitialNotification();
    // Request permission for notifications and get token
    const requestNotificationPermissions = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        const fcmToken = await messaging().getToken();
        console.log('FCM Token:', fcmToken); // Check if the token is generated
      } else {
        console.log('FCM Permission denied');
      }
    };

    requestNotificationPermissions();

    // Configure the notification channel for Android
    PushNotification.createChannel({
      channelId: 'default-channel-id',
      channelName: 'Default Channel',
      channelDescription: 'A default channel for notifications',
      soundName: 'default',
      importance: 4, // High importance
    });

    // Handle notifications when the app is in the background
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

  }, []);

  // Dummy function for navigation when clicking a notification
  // const navigateToNotification = (data) => {
  //   // Handle navigation to specific screen based on notification data
  //   console.log('Navigating to notification screen with data:', data);
  //   // Implement navigation logic here, such as:
  //   // navigation.navigate('NotificationScreen', { data });
  // };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Messages" component={Messages} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
