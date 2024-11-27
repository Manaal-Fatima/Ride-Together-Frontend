import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';

const DrawerList = [
    { label: 'Rider Requests', navigateTo: 'ViewRiderRequests' },
    { label: 'Publish A Ride', navigateTo: 'PublishARide' },
    { label: 'Booked Passengers', navigateTo: 'ViewBookedPassengers' },
    { label: 'Manage Profile', navigateTo: 'ManageProfile' },
];

const DrawerLayout = ({ label, navigateTo, navigation }) => {
    return (
        <DrawerItem
            label={label}
            onPress={() => navigation.navigate(navigateTo)}
            icon={({ color, size }) => <Icon name="user" size={size} color={color} />}
        />
    );
};

export default function DrawerContent(props) {
    const { navigation } = props;

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.userInfoSection}>
                    <Avatar.Image
                        source={require('./assets/profile.png')}
                        size={50}
                    />
                    <Title style={styles.title}>Admin</Title>
                </View>
                <View style={styles.drawerSection}>
                    {DrawerList.map((item, index) => (
                        <DrawerLayout
                            key={index}
                            label={item.label}
                            navigateTo={item.navigateTo}
                            navigation={navigation}
                        />
                    ))}
                </View>
            </DrawerContentScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    userInfoSection: {
        paddingLeft: 20,
        marginTop: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: 'bold',
    },
    drawerSection: {
        marginTop: 20,
    },
});
