import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useDispatch } from 'react-redux';

import  {setLocation}  from '../redux/screenAction';

export default function FromLhr() {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLocationChange = (newLocation) => {
    dispatch(setLocation(newLocation));
     navigation.navigate('DorP');
    
  };
   
  

  const handleNo = () => {
    alert('Sorry 😕! This app is currently available only for Lahore.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/loc.png')}
          style={styles.image}
        />
      </View>
      <Text style={{ fontSize: 38, marginBottom: 80, fontStyle: 'italic' }}>Are you in Lahore?</Text>
      <TouchableOpacity
          style={styles.button} 
            onPress={()  => handleLocationChange(("Lahore"))}
             >
        <Text style={styles.buttonText}>Yes, I'm here</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.noButton} onPress={handleNo}>
        <Text style={styles.noButtonText}>No</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#167E72',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 50,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  noButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 50,
  },
  noButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
