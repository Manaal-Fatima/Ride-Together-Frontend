// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const NotificationScreen = ({ route }) => {
//   const { notificationData } = route.params; // Receiving data passed from notification

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Notification Details</Text>
//       <Text style={styles.notificationText}>Title: {notificationData.title}</Text>
//       <Text style={styles.notificationText}>Message: {notificationData.body}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   notificationText: {
//     fontSize: 16,
//     color: '#333',
//   },
// });

// export default NotificationScreen;
import PushNotification from 'react-native-push-notification';

class Notifications {
  constructor() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      popInitialNotification: true,
      requestPermissions: true,
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: false,
        sound: false,
      },
    });

    PushNotification.createChannel(
      {
        channelId: 'reminders', // (required)
        channelName: 'Task reminder notifications', // (required)
        channelDescription: 'Reminder for any tasks',
      },
      () => {},
    );

    PushNotification.getScheduledLocalNotifications(rn => {
      console.log('SN --- ', rn);
    });
  }

  schduleNotification(date) {
    PushNotification.localNotificationSchedule({
      channelId: 'reminders',
      title: '🔔 Reminder!',
      message: 'You have set this reminder',
      date,
    });
  }
}

export default new Notifications();