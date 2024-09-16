// import React, { useEffect } from 'react';
// import { Platform, Alert } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import messaging from '@react-native-firebase/messaging';
// import PushNotification from 'react-native-push-notification';
// import Messages from './screens/Messages'; // Import your Messages screen

// const Stack = createNativeStackNavigator();

// export default function App() {
//   useEffect(() => {
//     const initializeApp = async () => {
//       // Request FCM token and log it
//       const token = await messaging().getToken();
//       console.log('FCM Token:', token);

//       // Handle the case where the app is opened from a notification when in the quit state
//       const initialNotification = await messaging().getInitialNotification();
//       if (initialNotification) {
//         console.log('App opened from quit state due to notification');
//         // navigateToNotification(initialNotification.data); // Make sure navigateToNotification is defined
//       }

//       // Configure push notification settings
//       PushNotification.configure({
//         permissions: {
//           alert: true,
//           badge: true,
//           sound: true,
//         },
//         popInitialNotification: true,
//         requestPermissions: true,

//         // Handle notification when clicked
//         onNotification: function (notification) {
//           console.log('Notification received:', notification);

//           if (notification.userInteraction) {
//             console.log('Notification clicked', notification);
//             navigateToNotification(notification.data); // Handle navigation on notification click
//           }
//         },
//         onRegistrationError: (err) => {
//           console.error('Notification registration error:', err.message, err);
//         },
//       });

//       // Create a notification channel for Android
//       PushNotification.createChannel(
//         {
//           channelId: 'default-channel-id', // Use the same ID as in your Messages.js
//           channelName: 'Default Channel',
//           channelDescription: 'A default channel for general notifications',
//           importance: 4, // High importance for notifications
//           soundName: 'default', // Default notification sound
//         },
//         (created) => console.log(`createChannel returned '${created}'`) // Log channel creation status
//       );
//     };

//     // Initialize app
//     initializeApp();

//     // Background message handler
//     messaging().setBackgroundMessageHandler(async remoteMessage => {
//       console.log('Message handled in the background:', remoteMessage);
//       if (Platform.OS === 'android' && remoteMessage.notification) {
//         PushNotification.localNotification({
//           channelId: 'default-channel-id', // Ensure this matches the channel ID created earlier
//           title: remoteMessage.notification.title,
//           message: remoteMessage.notification.body,
//         });
//       }
//     });

//     // Foreground message handler
//     const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
//       console.log('Foreground FCM message:', JSON.stringify(remoteMessage));
//       if (remoteMessage.notification) {
//         PushNotification.localNotification({
//           channelId: 'default-channel-id',
//           title: remoteMessage.notification.title,
//           message: remoteMessage.notification.body,
//         });
//       }
//     });

//     // Cleanup on unmount
//     return () => {
//       unsubscribeForeground(); // Clean up the foreground listener
//     };
//   }, []);

//   // Dummy function for navigation when clicking a notification
//   // const navigateToNotification = (data) => {
//   //   // Handle navigation to specific screen based on notification data
//   //   console.log('Navigating to notification screen with data:', data);
//   //   // Implement navigation logic here, such as:
//   //   // navigation.navigate('NotificationScreen', { data });
//   // };

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Messages" component={Messages} options={{ headerShown: false }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
