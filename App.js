import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';

import store from './redux/store';

import RegisterScreen from './screens/RegisterScreen';
import ManageProfile from './screens/myProfile';
// import ManageVehicle from './screens/ManageVehicle';
// import DriverApp from './screens/MainDriverScreen'
import OtpScreen from './screens/OtpScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import FromLhr from './screens/FromLhr';
import DorP from './screens/DorP';
import UserDetails from './screens/UserDetails';
import FindARide from './screens/FindARide';
import PublishARide from './screens/PublishARide';
import DriverDetails from './screens/DriverDetails';
import ViewAvailableRides from './screens/ViewAvailableRides';
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import AppNavigator from './screens/AppNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="WelcomeScreen">
          <Stack.Screen name="DorP" component={DorP} options={{ headerShown: false }} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FromLhr" component={FromLhr} options={{ headerShown: false }} />
          <Stack.Screen name="UserDetails" component={UserDetails} options={{ headerShown: false }} />
          <Stack.Screen name="FindARide" component={FindARide} options={{ headerShown: false }} />
          <Stack.Screen name="PublishARide" component={PublishARide} options={{ headerShown: false }} />
          <Stack.Screen name="DriverDetails" component={DriverDetails} options={{ headerShown: false }} />
          <Stack.Screen name="ViewAvailableRides" component={ViewAvailableRides} options={{ headerShown: false }} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AppNavigator" component={AppNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
