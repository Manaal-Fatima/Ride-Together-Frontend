import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
// Set notification handler for how notifications are displayed
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
export default function ViewAvailableRides({ route, navigation }) {
  const { pickupCoordinates,dropCoordinates, date } = route.params;
  const [availableRides, setAvailableRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  useEffect(() => {
    fetchAvailableRides();
  }, [pickupCoordinates, dropCoordinates, date]);

  const fetchAvailableRides = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }

      const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      console.log('Pickup Coordinates:', pickupCoordinates);
      console.log('Drop Coordinates:', dropCoordinates);
      console.log('Requested Time:', formattedTime);

      const response = await axios.post(
        'https://ride-together-mybackend-manaal.onrender.com/api/v1/vehicle/is_nearestVehicle',
        {
          passengerLocation: pickupCoordinates,
          requestedTime: formattedTime,
        },
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response Data:', response.data.rides);

      // console.log('Response Data:', response.data);
      setAvailableRides(response.data.rides || []);
    } catch (error) {
      console.error('Error fetching available rides:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch available rides');
    } finally {
      setLoading(false);
    }
  };
 

const savePushTokenToBackend = async (pushToken) => {
  try {
   
    const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }

    const response = await axios.patch(
      'https://ride-together-mybackend-manaal.onrender.com/api/v1/user/token-add',
      { pushToken: pushToken},
      { headers: { Authorization: `${token}`, 'Content-Type': 'application/json' } }
    );
   

    console.log('Push token saved successfully:', response.data);
  } catch (error) {
    console.error('Error saving push token to backend:', error);
  }
};

  // useEffect(() => {
  //   async function registerForPushNotificationsAsync() {
  //     if (Platform.OS === 'android') {
  //       Notifications.setNotificationChannelAsync('default', {
  //         name: 'default',
  //         importance: Notifications.AndroidImportance.MAX,
  //       });
  //     }

  //     if (Device.isDevice) {
  //       const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //       let finalStatus = existingStatus;

  //       if (existingStatus !== 'granted') {
  //         const { status } = await Notifications.requestPermissionsAsync();
  //         finalStatus = status;
  //       }

  //       if (finalStatus !== 'granted') {
  //         console.log('Permission not granted');
  //         return;
  //       }

  //       try {
  //         const pushTokenString = (await Notifications.getExpoPushTokenAsync()).data;
  //         setExpoPushToken(pushTokenString);
  //         console.log('expoPushToken', pushTokenString);
  //         await AsyncStorage.setItem('expoPushToken', pushTokenString); 
  //         // await AsyncStorage.setItem('expoPushToken', token); // Save to AsyncStorage
  //         Alert.alert('Success', 'Push token saved locally'); // Save token to AsyncStorage
  //       } catch (e) {
  //         console.log('Error getting push token:', e);
  //       }
  //     } else {
  //       console.log('Must use physical device for push notifications');
  //     }
  //   }

  //   registerForPushNotificationsAsync();
  // }, []);
  useEffect(() => {
    const registerForPushNotifications = async () => {
      try {
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            Alert.alert('Error', 'Failed to get push token for push notifications!');
            return;
          }
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log('Generated Push Token:', token); // Log the generated token
          await savePushTokenToBackend(token); 
          // Store the token in AsyncStorage
          
        } else {
          Alert.alert('Error', 'Must use physical device for push notifications');
        }
      } catch (error) {
        console.error('Error generating push token:', error);
      }
    };
  
    registerForPushNotifications();
  
}, []);
useEffect(() => {
  
  const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
    console.log('Notification Received:', notification); // Check if the notification is being received
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('Notification Response:', response); // Check if the user interacts with the notification
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}, []);


  const renderRide = ({ item }) => (
    <TouchableOpacity style={styles.rideContainer}>
      <Text style={styles.rideText}>Model: {item.vehicleDetails?.vehicle_model || 'N/A'}</Text>
      <Text style={styles.rideText}>Color: {item.vehicleDetails?.vehicle_color || 'N/A'}</Text>
      <Text style={styles.rideText}>Plate Number: {item.vehicleDetails?.vehicle_plate_number || 'N/A'}</Text>
      <Text style={styles.rideText}>Seats Available: {item.availableSeats || 'N/A'}</Text>
      <Text style={styles.rideText}>Price per Seat: {item.pricePerSeat || 'N/A'}</Text>
      <Text style={styles.rideText}>Distance: {item.distance||'0'} km</Text>
      <Text style={styles.rideText}>DriverName: {item.driverDetails?.name||'N/A'} </Text>
      <Text style={styles.rideText}>DiscountedPrice: {item.discountedPrice||'No Discout yet'} </Text>
      
     


      <Text style={styles.rideText}>Status: {item.status || 'N/A'}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCallDriver(item.driverDetails?.phone)}
        >
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.requestButton}
          onPress={() => handleSendRequest(item.driverId)}
        >
          <Text style={styles.buttonText}>Request</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.requestButton}
  onPress={() => {
    
    console.log('Driver ID:', item.driverId);
  
    navigation.navigate('Rating', {
     
      driverId: item.driverId,
    
    });
  }}
>
  <Text style={styles.buttonText}>Complete</Text>
</TouchableOpacity>




      </View>
    </TouchableOpacity>
  );

  const handleSendRequest = async (driverId) => {
    try {
      const [tokenData, idData] = await AsyncStorage.multiGet(['token', 'id']);
      const token = tokenData[1];
      const passengerId = idData[1];

      if (!token) {
        Alert.alert('Error', 'Token not found');
        return;
      }
      if (!passengerId) {
        Alert.alert('Error', 'Passenger ID not found');
        return;
      }

      const response = await axios.post(
        'https://ride-together-mybackend-manaal.onrender.com/api/v1/vehicle/book-ride',
        {
          driverId: driverId,
          passengerId: passengerId, // Use the passengerId from AsyncStorage
          pickupLocation: pickupCoordinates, // Use the pickup location from route.params
          drop_location:dropCoordinates, //Use the drop location from route.params
          requestedDate: new Date().toISOString().split('T')[0], // Today's date
          requestedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Current time
        },
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Booking Success:', response.data);
      
      fetchAvailableRides(); // Refresh the available rides after a successful booking
      Alert.alert('Success', response.data.message || 'Passenger added to ride successfully.');
    } catch (error) {
      console.error('Error booking ride:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to book ride');
    }
  };

  const handleCallDriver = (phone) => {
    console.log("Phone number:", phone);
    if (phone) {
     
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('Error', 'Driver phone number not available');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading available rides...</Text>
      ) : (
        <FlatList
          data={availableRides}
          keyExtractor={(item) => item._id}
          renderItem={renderRide}
          ListEmptyComponent={() => (
            <Text style={styles.noRidesText}>No available rides at the moment.</Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
  noRidesText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#888',
  },
  rideContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  rideText: {
    fontSize: 14,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  callButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  requestButton: {
    backgroundColor: '#167E72',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// export default function ViewRiderRequests() {
//   const [rideRequests, setRideRequests] = useState([]);
//   const [token, setToken] = useState('');
//   const [driverId, setDriverId] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const getTokenAndId = async () => {
//       try {
//         const [tokenData, idData] = await AsyncStorage.multiGet(['token', 'id']);
//         setToken(tokenData[1]);
//         setDriverId(idData[1]);

//         console.log('Token:', tokenData[1]);
//         console.log('Driver ID:', idData[1]);
//       } catch (error) {
//         console.error('Error retrieving token or driverId:', error);
//       }
//     };

//     getTokenAndId();
//   }, []);

//   const fetchRiderRequests = async () => {
//     if (!token || !driverId) {
//       console.log('Token or Driver ID still not available');
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `https://ride-together-mybackend-manaal.onrender.com/api/v1/vehicle/driver/ride-requests/${driverId}`,
//         {
//           headers: {
//             Authorization: `${token}`,
//           },
//         }
//       );
//       setRideRequests(response.data);
//     } catch (error) {
//       console.error('Error fetching rider requests:', error);
//       Alert.alert('Error', 'Failed to fetch rider requests');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderRequest = ({ item }) => {
//     const pickupCoords = item.pickup_location?.coordinates || [];
//     const dropCoords = item.dropLocation?.coordinates || [];

//     return (
//       <TouchableOpacity style={styles.requestContainer}>
//         <Text style={styles.requestText}>Pickup: {pickupCoords[0]}, {pickupCoords[1]}</Text>
//         <Text style={styles.requestText}>Dropoff: {dropCoords[0]}, {dropCoords[1]}</Text>
//         <Text style={styles.requestText}>Seats: {item.numSeats}</Text>
//         <Text style={styles.requestText}>Price per Seat: {item.pricePerSeat}</Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
     

//       {/* Static Placeholder View for Default Request */}
//       <View style={styles.placeholderRequestContainer}>
//         <Text style={styles.requestText}>Pickup: Gulshan Ravi </Text>
//         <Text style={styles.requestText}>Dropoff:  Samnabad </Text>
//         <Text style={styles.requestText}>Seats: 4 </Text>
//         <Text style={styles.requestText}>Price per Seat: 200 </Text>
      
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="#167E72" />
//       ) : rideRequests.length > 0 ? (
//         <FlatList
//           data={rideRequests}
//           renderItem={renderRequest}
//           keyExtractor={(item, index) => item._id || index.toString()}
//         />
//       ) : (
//         <Text style={styles.noRequestsText}></Text>
//       )}
//        <TouchableOpacity style={styles.btn} onPress={fetchRiderRequests}>
//         <Text style={styles.btnText}>Fetch Rider Requests</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   requestContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 },
//   placeholderRequestContainer: { 
//     backgroundColor: '#e0e0e0', 
//     padding: 16, 
//     borderRadius: 8, 
//     marginBottom: 16 
//   },
//   requestText: { fontSize: 16, marginBottom: 8 },
//   noRequestsText: { fontSize: 18, textAlign: 'center', marginTop: 20 },
//   btn: {
//     backgroundColor: '#167E72',
//     padding: 10,
//     alignItems: 'center',
//     borderRadius: 5,
//   },
//   btnText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });
