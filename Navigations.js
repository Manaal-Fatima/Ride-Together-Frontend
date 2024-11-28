import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';

import DriverManagement from './screens/DriverManagement';
import PassengerManagement from './screens/PassengerManagement';
import DrawerContent from './DrawerContent';
import Admin from './screens/Admin';

// Stack Navigator for internal screens
const Stack = createStackNavigator();

const StackNav = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="Admin">
      {/* Dashboard Screen */}
      <Stack.Screen
        name="Admin"
        component={Admin}
        options={{
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
              <Icon
                name="menu"
                size={30}
                color="black"
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())} // Open the drawer when icon is clicked
              />
            </View>
          ),
          headerTitle: 'Admin Dashboard', // Title for the screen
        }}
      />
      {/* Driver Management Screen */}
      <Stack.Screen
        name="DriverManagement"
        component={DriverManagement}
        options={{
          headerShown: true,
          title: 'Driver Management',
        }}
      />
      {/* Passenger Management Screen */}
      <Stack.Screen
        name="PassengerManagement"
        component={PassengerManagement}
        options={{
          headerShown: true,
          title: 'Passenger Management',
        }}
      />
    </Stack.Navigator>
  );
};

// Drawer Navigator setup
const Drawer = createDrawerNavigator();

const DrawerNav = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false, // Hide header for drawer screens
      }}
    >
      <Drawer.Screen name="Home" component={StackNav} />
    </Drawer.Navigator>
  );
};

// Exported Main Navigation
export default function Navigations() {
  return <DrawerNav />;
}
