import React from 'react';
import {View, StyleSheet, Text,TouchableOpacity } from "react-native";
import {DrawerContentScrollView,DrawerItem} from '@react-navigation/drawer';
import {Avatar, Title} from 'react-native-paper';

import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const DrawerList = [
  { label: 'DriverManagement', navigateTo: 'DriverManagement'},
  { label: 'PassengerManagement', navigateTo: 'PassengerManagement'},
  // { label: 'Profile', navigateTo: 'DriverDetails'},
  
];
// layput of our drawer items
const DrawerLayout = ({icon, label, navigateTo}) => {
  const navigation = useNavigation();
  // console.log(userData);
  return (
<DrawerItem
      icon={({color, size}) => <Icon name={icon} color={color} size={size} />}
      label={label}
      onPress={() => {
        navigation.navigate(navigateTo);
      }}
      
    />
  );
};

const DrawerItems = props => {
    return DrawerList.map((el, i) => {
      return (
        <DrawerLayout
          key={i}
          icon={el.icon}
          label={el.label}
          navigateTo={el.navigateTo}
        />
     
      );
    });
  };
function DrawerContent(props) {
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <TouchableOpacity activeOpacity={0.8}>
            <View style={styles.userInfoSection}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                
                
                  <Title style={styles.title}>Admin</Title>
                 
         
                  
               
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.drawerSection}>
            <DrawerItems />
          </View>
        </View>
      </DrawerContentScrollView>
     
    </View>
  );
}
export default DrawerContent;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
   marginTop:14,
    marginLeft: 13,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 13,
    lineHeight: 14,
    // color: '#6e6e6e',
    width: '100%',
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    
    marginTop: 15,
    marginLeft: -21,
    
   

  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#dedede',
    borderTopWidth: 1,
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});