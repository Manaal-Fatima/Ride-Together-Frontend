// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import WelcomeScreen from './screens/WelcomeScreen';
// import FrstScreen from './screens/FrstScreen'
// import RegisterScreen from './screens/RegisterScreen';
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
//         <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="OtpScreen" component= {OtpScreeen} options={{headerShown:false}}/>
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './redux/store';

import ManageVehicle from './screens/manageVehicle';
import RegisterScreen from './screens/RegisterScreen';
import ManageProfile from './screens/myProfile';
import OtpScreen from './screens/OtpScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import FromLhr from './screens/FromLhr';
import DorP from './screens/DorP';
import UserDetails from './screens/UserDetails';
import FindARide from './screens/FindARide';
import PublishARide from './screens/PublishARide';
import DriverDetails from './screens/DriverDetails';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="WelcomeScreen">
          <Stack.Screen name="DorP" component={DorP} options={{ headerShown: false }} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FromLhr" component={FromLhr} options={{ headerShown: false }} />
          <Stack.Screen name="UserDetails" component={UserDetails} options={{ headerShown: false }} />
          <Stack.Screen name="FindARide" component={FindARide} options={{ headerShown: false }} />
          <Stack.Screen name="PublishARide" component={PublishARide} options={{ headerShown: false }} />
          <Stack.Screen name="ManageVehicle" component={ManageVehicle} options={{ headerShown: false }} />
          <Stack.Screen name="DriverDetails" component={DriverDetails} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
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
