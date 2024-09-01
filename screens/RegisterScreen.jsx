import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    let error = {};
    if (!email) error.email = 'Email is required';
    if (!password) error.password = 'Password is required';
    setError(error);
    return Object.keys(error).length === 0;
  }

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        const res = await axios.post('https://ride-together-mybackend.onrender.com/api/v1/auth/register', { email, password });
        
        // Log the entire response object to inspect it
        console.log('API Response:', res.data);
    
        if (res.data.success === true) {  
          Alert.alert('Registration successful!');
    
          const { token } = res.data.data;
          const id = res.data.data.user._id;
    
          if (token && id) {
            await AsyncStorage.multiSet([['token', token], ['id', id]]);
            console.log('Token and ID stored successfully:', token, id);
            navigation.navigate('OtpScreen');
          } else {
            console.log('Token or ID not found in response.');
            setError('Token or ID not found in response.');
          }
        } else {
          console.log('Registration failed:', res.data.message || 'Something went wrong.');
          setError(res.data.message || 'Something went wrong.');
        }
      } catch (error) {
        if (error.response) {
          console.log('Error during registration:', error.response.data);
          setError(error.response.data.message || 'An error occurred during registration.');
        } else {
          console.log('Error during registration:', error.message);
          setError('An unexpected error occurred during registration.');
        }
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 38, marginBottom: 10, fontStyle: 'italic' }}>Join us via Email</Text> 
        <Text style={{ marginBottom: 30, fontSize: 15, textAlign: 'center' }}>We'll send you a verification code</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      {error.email && <Text style={styles.errorText}>{error.email}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      {error.password && <Text style={styles.errorText}>{error.password}</Text>}
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
  errorText: {
    color: 'red',
  },
});

// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet , Alert} from 'react-native';
// import axios from 'axios'; 
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function RegisterScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const navigation = useNavigation();

//   const validateForm = () => {
//     let error = {};
//     if (!email) error.email = 'Email is required';
//     if (!password) error.password = 'Password is required';
//     setError(error);
//     return Object.keys(error).length === 0;
//   }

 

//   const handleLogin = async () => {
//     if (validateForm()) {
//       try {
//         const res = await axios.post('https://ride-together-mybackend.onrender.com/api/v1/auth/register', { email, password });
//         console.log(res.data);
      
  
      
//         if (res.data.token) {
//           await AsyncStorage.setItem('token', res.data.token);
//           Alert.alert('Token saved successfully.');
//           navigation.navigate('OtpScreen');
//         } else {
//           Alert.alert('Token not found in response.');
//         }
//       } catch (error) {
//         console.error('Error submitting form:', error.message);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View>
//         <Text style={{ fontSize: 38, marginBottom: 10, fontStyle: 'italic' }}>Join us via Email</Text> 
//         <Text style={{ marginBottom: 30, fontSize: 15, textAlign: 'center' }}>We'll send you a verification code</Text>
//       </View>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your email"
//         keyboardType="email-address"
//         onChangeText={(text) => setEmail(text)}
//         value={email}
//       />
//       {error.email && <Text style={styles.errorText}>{error.email}</Text>}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your password"
//         secureTextEntry={true}
//         onChangeText={(text) => setPassword(text)}
//         value={password}
//       />
//       {error.password && <Text style={styles.errorText}>{error.password}</Text>}
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Next</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   input: {
//     height: 40,
//     width: '90%',
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
//   button: {
//     backgroundColor: '#167E72',
//     paddingVertical: 10,
//     paddingHorizontal: 80,
//     borderRadius: 50,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: 'red',
//   },
// });