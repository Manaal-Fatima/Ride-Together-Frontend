import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Icon from "react-native-feather";

// Import your screens
import ManageVehicle from './ManageVehicle';
import ViewBookedPassengers from './screens/ViewBookedPassengers';
import PublishARide from './screens/PublishARide';
import ViewRiderRequests from './screens/ViewRiderRequests'; 
import DriverDetails from './DriverDetails';
import ManageProfile from './ManageProfile';
import DrawerContent from './DrawerContent';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Stack Navigator
const StackNav = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Dashboard"
                component={DriverDetails} // Replace with your actual default screen
                options={({ navigation }) => ({
                    headerLeft: () => (
                        <TouchableOpacity
                            style={styles.menuIcon}
                            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        >
                            <Icon.Menu height={25} width={25} stroke="black" />
                        </TouchableOpacity>
                    ),
                    title: 'Dashboard',
                })}
            />
            <Stack.Screen name="ViewBookedPassengers" component={ViewBookedPassengers} />
            <Stack.Screen name="ManageVehicle" component={ManageVehicle} options={{ headerShown: false }} />
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
            <Stack.Screen name="ViewRiderRequests" component={ViewRiderRequests} options={{ title: 'Rider Requests' }} />
            <Stack.Screen name="DriverDetails" component={DriverDetails} options={{ headerShown: false }} />
            <Stack.Screen name="ManageProfile" component={ManageProfile} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

// Drawer Navigator
const DrawerNav = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Drawer.Screen name="Stack" component={StackNav} />
        </Drawer.Navigator>
    );
};

// Main App
export default function App() {
    return (
        <NavigationContainer>
            <DrawerNav />
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    menuIcon: {
        marginLeft: 10,
    },
    headerButton: {
        marginRight: 15,
        padding: 5,
        backgroundColor: '#167E72',
        borderRadius: 5,
    },
    headerButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
