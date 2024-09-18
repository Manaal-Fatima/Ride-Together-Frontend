import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import store from './redux/store';

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
import ViewAvailableRides from './screens/ViewAvailableRides';
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import StateScreen from './screens/StateScreen';
import ViewRiderRequests from './screens/ViewRiderRequests'; // Import this if it's in a separate file
import ManageVehicle from './ManageVehicle';

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
          <Stack.Screen name="ManageVehicle" component={ManageVehicle} options={{ headerShown: false }} />
          <Stack.Screen name="UserDetails" component={UserDetails} options={{ headerShown: false }} />
          <Stack.Screen name="FindARide" component={FindARide} options={{ headerShown: false }} />
          <Stack.Screen
            name="PublishARide"
            component={PublishARide}
            options={({ navigation }) => ({
              title: 'Publish A Ride',
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('ViewRiderRequests')}
                  style={styles.headerButton}
                >
                  <Text style={styles.headerButtonText}>View Requests</Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="ViewRiderRequests"
            component={ViewRiderRequests}
            options={{ title: 'Rider Requests' }}
          />
          <Stack.Screen name="DriverDetails" component={DriverDetails} options={{ headerShown: false }} />
          <Stack.Screen name="ViewAvailableRides" component={ViewAvailableRides} options={{ headerShown: true }} />
          <Stack.Screen name="StateScreen" component={StateScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

