// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import WelcomeScreen from './screens/WelcomeScreen';
// import FrstScreen from './screens/FrstScreen'
// import LoginScreen from './screens/LoginScreen';
// import OtpScreeen from './screens/OtpScreen';
// // import Home from './screens/Home';


// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="WelcomeScreen">
//         {/* <Stack.Screen name='Home' component={Home} options={{headerShown:false}}/> */}
//         <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="FrstScreen" component={FrstScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="OtpScreen" component= {OtpScreeen} options={{headerShown:false}}/>
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FindARide from './screens/FindARide';
import OfferARide from './screens/OfferARide';
import ManageVehicle from './screens/manageVehicle';
import LoginScreen from './screens/LoginScreen';
import ManageProfile from './screens/myProfile';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ManageProfile">
        {/* <Stack.Screen name="FindARide" component={FindARide} /> */}
        {/* <Stack.Screen name="OfferARide" component={OfferARide} /> */}
        {/* <Stack.Screen name="manageVehicle" component={ManageVehicle}/> */}
        {/* <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} /> */}
        <Stack.Screen name="myProfile" component={ManageProfile}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// import { StatusBar } from "react-native";
// import { StyleSheet, Text, View } from "react-native";
// import LottieView from "lottie-react-native";

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>  Ride Together  </Text>
//       <View style={styles.lott}>
//         <LottieView
//           style={{ flex: 1 }}
//           source={require('./assets/gari.json')}
//           autoPlay={true}
//           loop
//         />
//       </View>
//       <StatusBar style="auto" />
//     </View>

//   )
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1E90FF',
//     alignItems: 'center',
//     justifyContent: 'space-around'
//   },
//   text: {
//     fontSize: 40,
//     color: 'white'

//   },
//   lott: {
//     height: 400,
//     aspectRatio: 1

//   }
// })
