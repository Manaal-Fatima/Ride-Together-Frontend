// import React,{useEffect} from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// export default function Messages()
// {
//     const requestUserPermission=async()=>{
//         const authStatus = await messaging().requestPermission();
//         const enabled =
//           authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//           authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
//         if (enabled) {
//           console.log('Authorization status:', authStatus);
//         }
//       }
//       useEffect(()=>{
//       if (requestUserPermission()){
//         // return from token for the device
//         messaging().getToken().then(token=>{
//             console.log("token:",token);
//         });
//       }
//       else {
//         console.log("failed token status",authStatus);
//       }
//       messaging()
//       .getInitialNotification()
//       .then(async (remoteMessage) => {
//         if(remoteMessage){
//             console.log('Notification caused app to open from quite state:',JSON.stringify(remoteMessage.notification));
//         }
//       });
//       // onNotificationOpenedApp: When the application is running, but in the background.
// //      messaging().onNotificationOpenedApp(async (remoteMessage) => {
       
// //             console.log('Notification caused app to open from background state:',
// //                 remoteMessage.notification);
        
// //       });
// //       // Register background handler
// // messaging().setBackgroundMessageHandler(async remoteMessage => {
// //     console.log('Message handled in the background!', remoteMessage);
// //   });
//   const unsubscribe = messaging().onMessage(async remoteMessage => {
//     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
//   });

//   return unsubscribe;
  
//       },[])

// return(
//     <View>
//         <Text>hi hjhgf</Text>
//     </View>
// )
// }
import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export default function App() {
  useEffect(() => {
    // Request notification permissions and get the FCM token
    const requestPermissionAndToken = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        // You can send the token to your server here if needed
      } else {
        console.log('Notification permission not granted');
      }
    };

    requestPermissionAndToken();

    // Handle foreground messages
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    // Handle background messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Handle notifications that caused the app to open from a quit state
    messaging().getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.notification);
      }
    });

    return () => {
      // Clean up message listeners
      unsubscribeOnMessage();
    };
  }, []);

  return (
    <View>
      <Text>Welcome to FCM Notification App!</Text>
    </View>
  );
}
