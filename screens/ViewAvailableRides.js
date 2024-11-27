// // // import React, { useEffect, useState } from 'react';
// // // import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
// // // import axios from 'axios';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // export default function ViewAvailableRides({ route, navigation }) {
// // //   const { pickupCoordinates, date } = route.params;
// // //   const [availableRides, setAvailableRides] = useState([]);

// // //   useEffect(() => {
// // //     const fetchAvailableRides = async () => {
// // //       try {
// // //         const token = await AsyncStorage.getItem('token');
// // //         if (!token) {
// // //           Alert.alert('Error', 'Token not found');
// // //           return;
// // //         }

// // //         const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// // //         console.log('Pickup Coordinates:', pickupCoordinates);
// // //         console.log('Requested Time:', formattedTime);

// // //         const response = await axios.post(
// // //           'https://ride-together-mybackend-manaal.onrender.com/api/v1/vehicle/is_nearestVehicle',
// // //           {
// // //             passengerLocation: pickupCoordinates,
// // //             requestedTime: formattedTime,
// // //           },
// // //           {
// // //             headers: {
// // //               Authorization: `${token}`,
// // //               'Content-Type': 'application/json',
// // //             },
// // //           }
// // //         );

// // //         console.log('Response Data:', response.data);
// // //         setAvailableRides(response.data || []);
// // //       } catch (error) {
// // //         console.error('Error fetching available rides:', error.response?.data || error.message);
// // //         Alert.alert('Error', 'Failed to fetch available rides');
// // //       }
// // //     };

// // //     fetchAvailableRides();
// // //   }, [pickupCoordinates, date]);

// // //   const renderRide = ({ item }) => (
// // //     <TouchableOpacity style={styles.rideContainer}>
// // //       <Text style={styles.rideText}>Model: {item.vehicleDetails?.vehicle_model || 'N/A'}</Text>
// // //       <Text style={styles.rideText}>Color: {item.vehicleDetails?.vehicle_color || 'N/A'}</Text>
// // //       <Text style={styles.rideText}>
// // //         Plate Number: {item.vehicleDetails?.vehicle_plate_number || 'N/A'}
// // //       </Text>

// // //       <Text style={styles.rideText}>Seats Available: {item.numSeats || 'N/A'}</Text>
// // //       <Text style={styles.rideText}>Price per Seat: {item.pricePerSeat || 'N/A'}</Text>
// // //       <Text style={styles.rideText}>
// // //         Distance: {item.distance ? item.distance.toFixed(2) : 'N/A'} km
// // //       </Text>
// // //       <Text style={styles.rideText}>
// // //         Start Time: {new Date(item.starttime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'N/A'}
// // //       </Text>
// // //       <Text style={styles.rideText}>
// // //         End Time: {new Date(item.endtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'N/A'}
// // //       </Text>
// // //       <Text style={styles.rideText}>Status: {item.status || 'N/A'}</Text>

// // //       {/* Horizontal Button Container */}
// // //       <View style={styles.buttonContainer}>
// // //         {/* Call Button */}
// // //         <TouchableOpacity
// // //           style={styles.callButton}
// // //           onPress={() => handleCallDriver(item.driverPhone)}
// // //         >
// // //           <Text style={styles.buttonText}>Call</Text>
// // //         </TouchableOpacity>

// // //         {/* Request Button */}
// // //         <TouchableOpacity
// // //           style={styles.requestButton}
// // //           onPress={() => handleSendRequest(item.driverId)}
// // //         >
// // //           <Text style={styles.buttonText}>Request</Text>
// // //         </TouchableOpacity>
// // //       </View>
// // //     </TouchableOpacity>
// // //   );

// // //   // Function to handle sending request
// // //   const handleSendRequest = async (driverId) => {
// // //     try {
// // //       // Retrieve token and passengerId from AsyncStorage
// // //       const [tokenData, idData] = await AsyncStorage.multiGet(['token', 'id']);
// // //       const token = tokenData[1];
// // //       const passengerId = idData[1];

// // //       console.log('Token:', token);
// // //       console.log('Passenger ID:', passengerId);

// // //       const pickupLocation = route.params.pickupCoordinates; // Get pickup location from route.params

// // //       if (!token) {
// // //         Alert.alert('Error', 'Token not found');
// // //         return;
// // //       }

// // //       if (!passengerId) {
// // //         Alert.alert('Error', 'Passenger ID not found');
// // //         return;
// // //       }

// // //       if (!pickupLocation) {
// // //         Alert.alert('Error', 'Pickup location not found');
// // //         return;
// // //       }

// // //       const response = await axios.post(
// // //         'https://ride-together-mybackend-manaal.onrender.com/api/v1/vehicle/send-request',
// // //         {
// // //           driverId: driverId,
// // //           passengerId: passengerId, // Use the passengerId from AsyncStorage
// // //           pickupLocation: pickupLocation, // Use the pickup location from route.params
// // //           requestedDate: new Date().toISOString().split('T')[0], // Today's date
// // //           requestedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Current time
// // //         },
// // //         {
// // //           headers: {
// // //             Authorization: `${token}`,
// // //             'Content-Type': 'application/json',
// // //           },
// // //         }
// // //       );

// // //       Alert.alert('Request Sent', response.data.message);
// // //     } catch (error) {
// // //       console.error('Error sending request:', error.response?.data || error.message);
// // //       Alert.alert('Error', 'Failed to send request');
// // //     }
// // //   };





// // //   // Function to handle making a call
// // //   const handleCallDriver = (phoneNumber) => {
// // //     const phoneUrl = `tel:${phoneNumber || '03234117247'}`; // Use backticks for template literals
// // //     Linking.openURL(phoneUrl).catch((err) => Alert.alert('Error', 'Failed to make the call'));
// // //   };


// // //   return (
// // //     <View style={styles.container}>

// // //       <FlatList
// // //         data={availableRides}
// // //         renderItem={renderRide}
// // //         keyExtractor={(item) => item._id.toString()}
// // //       />

// // // <TouchableOpacity onPress={() => navigation.navigate('Rating')}>
// // //       <Text style={styles.buttonContainer}>Complete</Text>
// // //     </TouchableOpacity>
// // //     </View>

// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     padding: 20,
// // //     backgroundColor: '#fff',
// // //   },
// // //   title: {
// // //     fontSize: 24,
// // //     fontWeight: 'bold',
// // //     marginBottom: 20,
// // //   },
// // //   rideContainer: {
// // //     padding: 15,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#ddd',
// // //     marginBottom: 10,
// // //   },
// // //   rideText: {
// // //     fontSize: 16,
// // //     color: '#333',
// // //   },
// // //   buttonContainer: {
// // //     flexDirection: 'row', // Horizontal layout
// // //     justifyContent: 'space-between',
// // //     marginTop: 10,
// // //   },
// // //   callButton: {
// // //     flex: 1,
// // //     backgroundColor: '#4CAF50',
// // //     padding: 10,
// // //     marginRight: 5,
// // //     borderRadius: 5,
// // //     alignItems: 'center',
// // //   },
// // //   requestButton: {
// // //     flex: 1,
// // //     backgroundColor: '#167E72',
// // //     padding: 10,
// // //     marginLeft: 5,
// // //     borderRadius: 5,
// // //     alignItems: 'center',
// // //   },
// // //   buttonText: {
// // //     color: '#fff',
// // //     fontWeight: 'bold',
// // //   },
// // // });


// // ///////////////////////////////////
// // import React, { useEffect, useState } from 'react';
// // import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
// // import axios from 'axios';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // export default function ViewAvailableRides({ route, navigation }) {
// //   const { pickupCoordinates, date } = route.params;
// //   const [availableRides, setAvailableRides] = useState([]);

// //   useEffect(() => {
// //     const fetchAvailableRides = async () => {
// //       try {
// //         const token = await AsyncStorage.getItem('token');
// //         if (!token) {
// //           Alert.alert('Error', 'Token not found');
// //           return;
// //         }

// //         const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// //         console.log('Pickup Coordinates:', pickupCoordinates);
// //         console.log('Requested Time:', formattedTime);

// //         const response = await axios.post(
// //           'https://ride-together-mybackend-manaal.onrender.com/api/v1/vehicle/is_nearestVehicle',
// //           {
// //             passengerLocation: pickupCoordinates,
// //             requestedTime: formattedTime,
// //           },
// //           {
// //             headers: {
// //               Authorization: `${token}`,
// //               'Content-Type': 'application/json',
// //             },
// //           }
// //         );

// //         console.log('Response Data:', response.data);
// //         setAvailableRides(response.data || []);
// //       } catch (error) {
// //         console.error('Error fetching available rides:', error.response?.data || error.message);
// //         Alert.alert('Error', 'Failed to fetch available rides');
// //       }
// //     };

// //     fetchAvailableRides();
// //   }, [pickupCoordinates, date]);

// //   const renderRide = ({ item }) => (
// //     <TouchableOpacity style={styles.rideContainer}>
// //       <Text style={styles.rideText}>Model: {item.vehicleDetails?.vehicle_model || 'N/A'}</Text>
// //       <Text style={styles.rideText}>Color: {item.vehicleDetails?.vehicle_color || 'N/A'}</Text>
// //       <Text style={styles.rideText}>
// //         Plate Number: {item.vehicleDetails?.vehicle_plate_number || 'N/A'}
// //       </Text>

// //       <Text style={styles.rideText}>Seats Available: {item.numSeats || 'N/A'}</Text>
// //       <Text style={styles.rideText}>Price per Seat: {item.pricePerSeat || 'N/A'}</Text>
// //       <Text style={styles.rideText}>
// //         Distance: {item.distance ? item.distance.toFixed(2) : 'N/A'} km
// //       </Text>
// //       <Text style={styles.rideText}>
// //         Start Time:{' '}
// //         {new Date(item.starttime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ||
// //           'N/A'}
// //       </Text>
// //       <Text style={styles.rideText}>
// //         End Time:{' '}
// //         {new Date(item.endtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ||
// //           'N/A'}
// //       </Text>
// //       <Text style={styles.rideText}>Status: {item.status || 'N/A'}</Text>

// //       {/* Horizontal Button Container */}
// //       <View style={styles.buttonContainer}>
// //         {/* Call Button */}
// //         <TouchableOpacity style={styles.callButton} onPress={() => handleCallDriver(item.driverPhone)}>
// //           <Text style={styles.buttonText}>Call</Text>
// //         </TouchableOpacity>

// //         {/* Request Button */}
// //         <TouchableOpacity style={styles.requestButton} onPress={() => handleSendRequest(item.driverId)}>
// //           <Text style={styles.buttonText}>Request</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </TouchableOpacity>
// //   );

// //   // Function to handle sending request
// //   const handleSendRequest = async (driverId) => {
// //     try {
// //       // Retrieve token and passengerId from AsyncStorage
// //       const [tokenData, idData] = await AsyncStorage.multiGet(['token', 'id']);
// //       const token = tokenData[1];
// //       const passengerId = idData[1];

// //       console.log('Token:', token);
// //       console.log('Passenger ID:', passengerId);

// //       const pickupLocation = route.params.pickupCoordinates; // Get pickup location from route.params

// //       if (!token) {
// //         Alert.alert('Error', 'Token not found');
// //         return;
// //       }

// //       if (!passengerId) {
// //         Alert.alert('Error', 'Passenger ID not found');
// //         return;
// //       }

// //       if (!pickupLocation) {
// //         Alert.alert('Error', 'Pickup location not found');
// //         return;
// //       }

// //       const response = await axios.post(
// //         'https://ride-together-mybackend-manaal.onrender.com/api/v1/vehicle/send-request',
// //         {
// //           driverId: driverId,
// //           passengerId: passengerId, // Use the passengerId from AsyncStorage
// //           pickupLocation: pickupLocation, // Use the pickup location from route.params
// //           requestedDate: new Date().toISOString().split('T')[0], // Today's date
// //           requestedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Current time
// //         },
// //         {
// //           headers: {
// //             Authorization: `${token}`,
// //             'Content-Type': 'application/json',
// //           },
// //         }
// //       );

// //       Alert.alert('Request Sent', response.data.message);
// //     } catch (error) {
// //       console.error('Error sending request:', error.response?.data || error.message);
// //       Alert.alert('Error', 'Failed to send request');
// //     }
// //   };

// //   // Function to handle making a call
// //   const handleCallDriver = (phoneNumber) => {
// //     const phoneUrl = `tel:${phoneNumber || '03234117247'}`;
// //     Linking.openURL(phoneUrl).catch((err) => Alert.alert('Error', 'Failed to make the call'));
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <FlatList data={availableRides} renderItem={renderRide} keyExtractor={(item) => item._id.toString()} />

// //       {/* Navigate to Rating Screen */}
// //       <TouchableOpacity
// //         onPress={async () => {
// //           try {
// //             const idData = await AsyncStorage.getItem('id'); // Get passengerId
// //             if (idData) {
// //               await AsyncStorage.setItem('passengerId', idData); // Save it as passengerId for Rating screen
// //               console.log('Passenger ID saved:', idData);
// //               navigation.navigate('Rating');
// //             } else {
// //               Alert.alert('Error', 'Passenger ID not found');
// //             }
// //           } catch (error) {
// //             console.error('Error saving passenger ID:', error);
// //             Alert.alert('Error', 'Failed to navigate to Rating screen');
// //           }
// //         }}
// //       >
// //         <Text style={styles.completeButton}>Complete</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: '#fff',
// //   },
// //   rideContainer: {
// //     padding: 15,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#ddd',
// //     marginBottom: 10,
// //   },
// //   rideText: {
// //     fontSize: 16,
// //     color: '#333',
// //   },
// //   buttonContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginTop: 10,
// //   },
// //   callButton: {
// //     flex: 1,
// //     backgroundColor: '#4CAF50',
// //     padding: 10,
// //     marginRight: 5,
// //     borderRadius: 5,
// //     alignItems: 'center',
// //   },
// //   requestButton: {
// //     flex: 1,
// //     backgroundColor: '#167E72',
// //     padding: 10,
// //     marginLeft: 5,
// //     borderRadius: 5,
// //     alignItems: 'center',
// //   },
// //   buttonText: {
// //     color: '#fff',
// //     fontWeight: 'bold',
// //   },
// //   completeButton: {
// //     marginTop: 20,
// //     textAlign: 'center',
// //     color: '#fff',
// //     backgroundColor: '#167E72',
// //     padding: 10,
// //     borderRadius: 5,
// //   },
// // });
// /////////////////////////
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function ViewAvailableRides({ route, navigation }) {
//   const { pickupCoordinates, dropCoordinates, date } = route.params;
//   const {rideId}=route.params;
//   // const driverId= populatedRide.driverId;
//   // const passenger=populatedRide.bookedPassenger;
//   const driverId = route.params?.populatedRide?.driverId || ''; // Use default values if undefined
// const passengers = route.params?.populatedRide?.bookedPassengers || [];

//   const [availableRides, setAvailableRides] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchAvailableRides();
//   }, [pickupCoordinates, dropCoordinates, date]);

//   const fetchAvailableRides = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         Alert.alert('Error', 'Token not found');
//         return;
//       }

//       const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
//       console.log('Pickup Coordinates:', pickupCoordinates);
//       console.log('Drop Coordinates:', dropCoordinates);
//       console.log('Requested Time:', formattedTime);

//       const response = await axios.post(
//         'https://ride-together-mybackend-manaal.onrender.com/api/v1/vehicle/is_nearestVehicle',
//         {
//           passengerLocation: pickupCoordinates,
//           requestedTime: formattedTime,
//         },
//         {
//           headers: {
//             Authorization: `${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       console.log('Response Data:', response.data.rides);

//       // console.log('Response Data:', response.data);
//       setAvailableRides(response.data.rides || []);
//     } catch (error) {
//       console.error('Error fetching available rides:', error.response?.data || error.message);
//       Alert.alert('Error', error.response?.data?.message || 'Failed to fetch available rides');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderRide = ({ item }) => (
//     <TouchableOpacity style={styles.rideContainer}>
//       <Text style={styles.rideText}>Model: {item.vehicleDetails?.vehicle_model || 'N/A'}</Text>
//       <Text style={styles.rideText}>Color: {item.vehicleDetails?.vehicle_color || 'N/A'}</Text>
//       <Text style={styles.rideText}>Plate Number: {item.vehicleDetails?.vehicle_plate_number || 'N/A'}</Text>
//       <Text style={styles.rideText}>Seats Available: {item.availableSeats || 'N/A'}</Text>
//       <Text style={styles.rideText}>Price per Seat: {item.pricePerSeat || 'N/A'}</Text>
//       <Text style={styles.rideText}>Distance: {item.distance || 'N/A'} km</Text>
//       <Text style={styles.rideText}>
//         Start Time: {new Date(item.starttime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) || 'N/A'}
//       </Text>
//       <Text style={styles.rideText}>
//         End Time: {new Date(item.endtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) || 'N/A'}
//       </Text>
//       <Text style={styles.rideText}>Status: {item.status || 'N/A'}</Text>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={styles.callButton}
//           onPress={() => handleCallDriver(item.driverDetails?.phone)}
//         >
//           <Text style={styles.buttonText}>Call</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.requestButton}
//           onPress={() => handleSendRequest(item.driverId)}
//         >
//           <Text style={styles.buttonText}>Request</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//   style={styles.requestButton}
//   onPress={() => {
//     const passengers = item.populatedRide?.bookedPassengers; // Access nested bookedPassengers
//     console.log('Ride ID:', item._id);
//     console.log('Driver ID:', item.driverId);
//     console.log('Passengers:', passengers);

//     navigation.navigate('Rating', {
//       rideId: item._id,              // Pass the rideId
//       driverId: item.driverId,       // Pass the driverId
//       passengers: passengers || [],  // Pass the bookedPassengers array
//     });
//   }}
// >
//   <Text style={styles.buttonText}>Complete</Text>
// </TouchableOpacity>

        
//       </View>
//     </TouchableOpacity>
//   );

// //   const handleSendRequest = async (driverId) => {
// //     try {
// //       const result = await AsyncStorage.multiGet(['token', 'id']);
// // const token = result[0][1]; // First key-value pair for 'token'
// // const passengerId = result[1][1]; // Second key-value pair for 'id'


// //       if (!token) {
// //         Alert.alert('Error', 'Token not found');
// //         return;
// //       }
// //       if (!passengerId) {
// //         Alert.alert('Error', 'Passenger ID not found');
// //         return;
// //       }

// //       const response = await axios.post(
// //         'https://ride-together-mybackend-manaal.onrender.com/api/v1/vehicle/book-ride',
// //         {
// //           driverId: driverId,
// //           passengerId: passengerId, // Use the passengerId from AsyncStorage
// //           pickupLocation: pickupCoordinates, // Use the pickup location from route.params
// //           dropCoordinates: dropCoordinates, //Use the drop location from route.params
// //           requestedDate: new Date().toISOString().split('T')[0], // Today's date
// //           requestedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Current time
// //         },
// //         {
// //           headers: {
// //             Authorization: `${token}`,
// //             'Content-Type': 'application/json',
// //           },
// //         }
// //       );

// //       console.log('Booking Success:', response.data);
// //       fetchAvailableRides(); // Refresh the available rides after a successful booking
// //       Alert.alert('Success', response.data.message || 'Passenger added to ride successfully.'
        
// //       );
     
// //     } catch (error) {
// //       console.error('Error booking ride:', error.response?.data || error.message);
// //       Alert.alert('Error', error.response?.data?.message || 'Failed to book ride');
// //     }
// //   };
// const handleSendRequest = async (driverId) => {
//   try {
//     // const result = await AsyncStorage.multiGet(['token', 'id']);
//     // console.log('AsyncStorage Result:', result); // Debugging log
    
//     // const token = result[0][1]; // First key-value pair for 'token'
//     // const passengerId = result[1][1]; // Second key-value pair for 'id'
//     const result = await AsyncStorage.multiGet(['token', 'id']);
// const token = result?.find(([key]) => key === 'token')?.[1];
// const passengerId = result?.find(([key]) => key === 'id')?.[1];

// console.log('Retrieved Token:', token); // Debugging log
// console.log('Retrieved Passenger ID:', passengerId); // Debugging log

// if (!token) {
//   Alert.alert('Error', 'Token not found in AsyncStorage');
//   return;
// }
// if (!passengerId) {
//   Alert.alert('Error', 'Passenger ID not found in AsyncStorage');
//   return;
// }


//     console.log('Token:', token); // Debugging log
//     console.log('Passenger ID:', passengerId); // Debugging log

//     if (!token) {
//       Alert.alert('Error', 'Token not found');
//       return;
//     }
//     if (!passengerId) {
//       Alert.alert('Error', 'Passenger ID not found');
//       return;
//     }

//     const response = await axios.post(
//       'https://ride-together-mybackend-manaal.onrender.com/api/v1/vehicle/book-ride',
//       {
//         driverId: driverId,
//         passengerId: passengerId,
//         pickupLocation: pickupCoordinates,
//         dropCoordinates: dropCoordinates,
//         requestedDate: new Date().toISOString().split('T')[0],
//         requestedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       },
//       {
//         headers: {
//           Authorization: `${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     console.log('Booking Success:', response.data);
//     fetchAvailableRides();
//     Alert.alert('Success', response.data.message || 'Passenger added to ride successfully.');
//   } catch (error) {
//     console.error('Error booking ride:', error.response?.data || error.message);
//     Alert.alert('Error', error.response?.data?.message || 'Failed to book ride');
//   }
// };


//   const handleCallDriver = (phone) => {
//     console.log("Phone number:", phone);
//     if (phone) {

//       Linking.openURL(`tel:${phone}`);
//     } else {
//       Alert.alert('Error', 'Driver phone number not available');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <Text style={styles.loadingText}>Loading available rides...</Text>
//       ) : (
//         <FlatList
//           data={availableRides}
//           keyExtractor={(item) => item._id}
//           renderItem={renderRide}
//           ListEmptyComponent={() => (
//             <Text style={styles.noRidesText}>No available rides at the moment.</Text>
//           )}
//         />
//       )}
//       {/* <TouchableOpacity onPress={() => navigation.navigate('Rating', { rideId: request._id })}>
//         <Text style={styles.buttonContainer}>Complete</Text>
//       </TouchableOpacity> */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#f5f5f5',
//   },
//   loadingText: {
//     textAlign: 'center',
//     marginVertical: 20,
//     fontSize: 16,
//   },
//   noRidesText: {
//     textAlign: 'center',
//     marginVertical: 20,
//     fontSize: 16,
//     color: '#888',
//   },
//   rideContainer: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   rideText: {
//     fontSize: 14,
//     marginBottom: 5,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   callButton: {
//     backgroundColor: '#4CAF50',
//     padding: 10,
//     borderRadius: 5,
//     flex: 1,
//     marginRight: 5,
//     alignItems: 'center',
//   },
//   requestButton: {
//     backgroundColor: '#167E72',
//     padding: 10,
//     borderRadius: 5,
//     flex: 1,
//     marginLeft: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 14,
//   },
// });



//////////////////////////////////////////////////////////////////////////////////////////////////////
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewAvailableRides({ route, navigation }) {
  const { pickupCoordinates,dropCoordinates, date } = route.params;
  
  const [availableRides, setAvailableRides] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const renderRide = ({ item }) => (
    <TouchableOpacity style={styles.rideContainer}>
      <Text style={styles.rideText}>Model: {item.vehicleDetails?.vehicle_model || 'N/A'}</Text>
      <Text style={styles.rideText}>Color: {item.vehicleDetails?.vehicle_color || 'N/A'}</Text>
      <Text style={styles.rideText}>Plate Number: {item.vehicleDetails?.vehicle_plate_number || 'N/A'}</Text>
      <Text style={styles.rideText}>Seats Available: {item.availableSeats || 'N/A'}</Text>
      <Text style={styles.rideText}>Price per Seat: {item.pricePerSeat || 'N/A'}</Text>
      <Text style={styles.rideText}>Distance: {item.distance||'N/A'} km</Text>
      <Text style={styles.rideText}>
        Start Time: {new Date(item.starttime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) || 'N/A'}
      </Text>
      <Text style={styles.rideText}>
        End Time: {new Date(item.endtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) || 'N/A'}
      </Text>
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
    console.log('Ride ID:', item._id);
  
    navigation.navigate('Rating', {
     
      driverId: item.driverId,
      rideId: item._id, 
     
    
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
           dropCoordinates:dropCoordinates, //Use the drop location from route.params
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