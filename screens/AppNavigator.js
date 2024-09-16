// AppNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import DriverDetails from './DriverDetails';
import ManageVehicle from './manageVehicle'; // Ensure this component is defined
import ViewRiderRequests from './ViewRiderRequests';
import PublishARide from './PublishARide';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const Drawer = createDrawerNavigator();

const DrawerContent = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/5.png')} // Replace with your car image
      style={styles.drawerBackground}
    >
      <View style={styles.drawerContent}>
        <TouchableOpacity onPress={() => navigation.navigate('ManageVehicle')} style={styles.drawerItem}>
          <Text style={styles.drawerItemText}>Manage Vehicle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ViewRiderRequests')} style={styles.drawerItem}>
          <Text style={styles.drawerItemText}>View Ride Details</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PublishARide')} style={styles.drawerItem}>
          <Text style={styles.drawerItemText}>Publish a Ride</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name="DriverDetails" component={DriverDetails} />
        <Drawer.Screen name="ManageVehicle" component={ManageVehicle} />
        <Drawer.Screen name="ViewRiderRequests" component={ViewRiderRequests} />
        <Drawer.Screen name="PublishARide" component={PublishARide} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerBackground: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  drawerItemText: {
    fontSize: 18,
  },
});
