import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('RegisterScreen');
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <Text style={styles.text}> Ride Together </Text>
      </View>
      <View style={styles.bottomHalf}>
        <Animatable.Image
          animation="slideInRight"
          duration={1000}
          iterationCount="infinite"
          source={require('../assets/new.png')}
          style={styles.car}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#167E72', 
  },
  topHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    color: 'white',
  },
  car: {
    width: 300,
    height: 150,
  },
});
