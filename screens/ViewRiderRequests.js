// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// export default function ViewRiderRequests({ navigation }) {
//   const [rideRequests, setRideRequests] = useState([]);
//   const [token, setToken] = useState('');
//   const [driverId, setDriverId] = useState('');
//   const [loading, setLoading] = useState(false);
//   // const {driverId}=route.params;
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
//         <TouchableOpacity
//      style={styles.requestButton}
//      onPress={() => {
       
//        console.log('Driver ID:', driverId);
//        console.log('Ride ID:', item._id);
     
//        navigation.navigate('DriverShowRating', {
        
//           driverId: driverId,
//          rideId: item._id, 
        
       
//        });
//      }}
//    >
//      <Text style={styles.btnText}>View Rating</Text>
//    </TouchableOpacity>
       
//       </TouchableOpacity>

//     );
  
     
    
   
//   };

//   return (
//     <View style={styles.container}>
//       {/* Placeholder Request */}
//       <View style={styles.placeholderRequestContainer}>
//         <Text style={styles.requestText}>Pickup: Gulshan Ravi </Text>
//         <Text style={styles.requestText}>Dropoff: Samnabad </Text>
//         <Text style={styles.requestText}>Seats: 4 </Text>
//         <Text style={styles.requestText}>Price per Seat: 200 </Text>
//         <TouchableOpacity
//           style={styles.btn}
//           onPress={() => Alert.alert('Placeholder Request', 'This is a static example')}
//         >
//           <Text style={styles.btnText}>Book/Accept</Text>
//         </TouchableOpacity>
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
//         <Text style={styles.noRequestsText}>No rider requests available.</Text>
//       )}

//       {/* Fetch Requests Button */}
//       <TouchableOpacity style={styles.btn} onPress={fetchRiderRequests}>
//         <Text style={styles.btnText}>Fetch Rider Requests</Text>
//       </TouchableOpacity>
      
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   requestContainer: { 
//     backgroundColor: '#fff', 
//     padding: 16, 
//     borderRadius: 8, 
//     marginBottom: 16, 
//     shadowColor: '#000', 
//     shadowOpacity: 0.2, 
//     shadowOffset: { width: 0, height: 2 }, 
//     shadowRadius: 5, 
//     elevation: 3 
//   },
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
//     marginTop: 10,
//   },
//   btnText: {
//     color: '#167E72',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   headerButton: {
//     marginRight: 10,
//   },
//   headerButtonText: {
//     color: '#007bff',
//     fontSize: 16,
//   },
// });

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ViewRiderRequests({ navigation }) {
  const [rideRequests, setRideRequests] = useState([]);
  const [token, setToken] = useState('');
  const [driverId, setDriverId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTokenAndId = async () => {
      try {
        const [tokenData, idData] = await AsyncStorage.multiGet(['token', 'id']);
        setToken(tokenData[1]);
        setDriverId(idData[1]);

        console.log('Token:', tokenData[1]);
        console.log('Driver ID:', idData[1]);
      } catch (error) {
        console.error('Error retrieving token or driverId:', error);
      }
    };

    getTokenAndId();

    // Set up the header button
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('DriverShowRating', { driverId })}
        >
          <Text style={styles.headerButtonText}>Driver Rating</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, driverId]);

  const fetchRiderRequests = async () => {
    if (!token || !driverId) {
      console.log('Token or Driver ID still not available');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `https://ride-together-mybackend-manaal.onrender.com/api/v1/vehicle/driver/ride-requests/${driverId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setRideRequests(response.data);
    } catch (error) {
      console.error('Error fetching rider requests:', error);
      Alert.alert('Error', 'Failed to fetch rider requests');
    } finally {
      setLoading(false);
    }
  };

  const renderRequest = ({ item }) => {
    const pickupCoords = item.pickup_location?.coordinates || [];
    const dropCoords = item.dropLocation?.coordinates || [];

    return (
      <TouchableOpacity style={styles.requestContainer}>
        <Text style={styles.requestText}>Pickup: {pickupCoords[0]}, {pickupCoords[1]}</Text>
        <Text style={styles.requestText}>Dropoff: {dropCoords[0]}, {dropCoords[1]}</Text>
        <Text style={styles.requestText}>Seats: {item.numSeats}</Text>
        <Text style={styles.requestText}>Price per Seat: {item.pricePerSeat}</Text>
        {/* <TouchableOpacity
          style={styles.requestButton}
          onPress={() =>
            navigation.navigate('DriverShowRating', {
              driverId,
              rideId: item._id,
            })
          }
        >
          <Text style={styles.btnText}>View Rating</Text>
        </TouchableOpacity> */}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#167E72" />
      ) : rideRequests.length > 0 ? (
        <FlatList
          data={rideRequests}
          renderItem={renderRequest}
          keyExtractor={(item, index) => item._id || index.toString()}
        />
      ) : (
        <Text style={styles.noRequestsText}>No rider requests available.</Text>
      )}

      <TouchableOpacity style={styles.btn} onPress={fetchRiderRequests}>
        <Text style={styles.btnText}>Fetch Rider Requests</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  requestContainer: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 8, 
    marginBottom: 16, 
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 5, 
    elevation: 3 
  },
  requestText: { fontSize: 16, marginBottom: 8 },
  noRequestsText: { fontSize: 18, textAlign: 'center', marginTop: 20 },
  btn: {
    backgroundColor: '#167E72',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerButton: {
    marginRight: 10,
    padding: 10,
  },
  headerButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
});
