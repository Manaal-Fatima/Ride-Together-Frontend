import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios'; 
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error , setError] = useState('');

  const navigation = useNavigation();

  const validateForm=()=>{
    let error = {};
    if(!email) error.email = 'email is required ';
    if(!password) error.password = 'password is required ';
    setError(error);
    return Object.keys(error).length===0;

  }
  const handleLogin = async () => {
    if (validateForm()) {
      try {
        let res = await axios.post('http://127.0.0.1:8000/api/v1/auth/register', { email, password }); 
        console.log(res.data);
  
        if (res.data.success) {
    
          navigation.navigate('OtpScreen');
        } else {

          console.error('Error:', res.data.message);
        }
      } catch (error) {
        console.error('Error submitting form:', error.message);
      }
      
    }
  };


  return (
    <View style={styles.container}>
        <View>
       <Text  style={{ fontSize: 38, marginBottom: 10 , fontStyle: 'italic' }}>Join us via Email </Text> 
       <Text style={{ marginBottom: 30 , fontSize: 15 , textAlign: 'center' }}>We'll send you a verification code </Text></View>

      <TextInput

        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      {
        error.email ? <Text style={styles.errorText}>{error.email}</Text> : null
      }
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
        {
      
      error.password ? <Text style={styles.errorText}>{error.password}</Text> : null

      }
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#167E72',
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText:{
    color : 'red',
  
  }
});
