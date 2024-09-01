import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { setContactInfo } from '../redux/screenAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function DriverDetails() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [licenseImage, setLicenseImage] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Function to handle form submission and image upload
  const handleNext = async () => {
    // Check if all fields are filled
    if (!name || !phone || !cnic || !licenseImage) {
      Alert.alert('Error', 'Please fill all fields and upload your license image.');
      return;
    }

    // Dispatch action to save contact info to Redux store
    dispatch(setContactInfo(name, phone));

    try {
      // Retrieve token and ID from AsyncStorage
      const [tokenData, idData] = await AsyncStorage.multiGet(['token', 'id']);
      const token = tokenData[1];
      const id = idData[1];

      console.log('Token:', token);
      console.log('ID:', id);

      // Step 1: Upload Driver Details
      let driverDetailsResponse;
      try {
        driverDetailsResponse = await axios.post(
          `https://ride-together-mybackend.onrender.com/api/v1/driver/driver-details:${id}`, // Corrected URL format
          {}, // Provide actual data for driver details if needed
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log('Driver Details Response:', driverDetailsResponse.data);
      } catch (error) {
        console.error('Driver Details Error Request:', error.request);
        console.error('Driver Details Error Response:', error.response);
        Alert.alert('Error', 'Failed to update driver details.');
        return;
      }

      // Check if driver details were updated successfully
      if (!driverDetailsResponse.data.success) {
        Alert.alert('Error', driverDetailsResponse.data.message || 'Failed to update driver details.');
        return;
      }
      navigation.navigate('ManageVehicle');

      // Step 2: Upload License Image
      // Uncomment this section if you want to handle license image upload
      /*
      const formData = new FormData();
      formData.append('license_image', {
        uri: licenseImage.uri,
        name: 'license.jpg', // Ensure the file name has an extension
        type: 'image/jpeg', // Correct MIME type
      });

      // Log the FormData for debugging purposes
      console.log('FormData:', formData);

      try {
        const licenseImageResponse = await axios.post(
          `https://ride-together-mybackend.onrender.com/api/v1/driver/upload-license-image/${id}`,
          formData,
          {
            headers: {
              Authorization: `${token}`,
              // No need to set Content-Type here; Axios will set it automatically.
            },
          }
        );

        // Log the response to see the server's response
        console.log('License Image Upload Response:', licenseImageResponse.data);

        if (licenseImageResponse.data.success) {
          Alert.alert(
            'Success',
            licenseImageResponse.data.message || 'Driver details updated successfully.'
          );
          navigation.navigate('ManageVehicle');
        } else {
          Alert.alert(
            'Error',
            licenseImageResponse.data.message || 'Failed to upload license image.'
          );
        }
      } catch (error) {
        // Log error response for detailed error information
        console.error('License Image Error Response:', error.response);
        Alert.alert('Error', 'Failed to upload license image.');
      }
      */
    } catch (error) {
      // Handle any unexpected errors
      if (error.response) {
        console.error('Error Response:', error.response.data);
        Alert.alert('Error', error.response.data.message || 'Request failed.');
      } else if (error.request) {
        console.error('Error Request:', error.request);
        Alert.alert('Error', 'No response received from server.');
      } else {
        console.error('Error Message:', error.message);
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // If the user did not cancel the image picker, update the state with the selected image
    if (!pickerResult.canceled) {
      const { uri } = pickerResult.assets[0]; // Correctly accessing the URI from the picker result
      console.log('Selected Image URI:', uri);
      setLicenseImage({ uri }); // Update the state with the correct image URI
    } else {
      console.log('Image picker was canceled');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome to Ride Together</Text>
      <Text style={styles.subHeaderText}>Tell us a little bit about yourself</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#999"
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone No"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        onChangeText={(text) => setPhone(text)}
        value={phone}
      />
      <TextInput
        style={styles.input}
        placeholder="CNIC"
        placeholderTextColor="#999"
        keyboardType="numeric"
        onChangeText={(text) => setCnic(text)}
        value={cnic}
      />

      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload License Image</Text>
      </TouchableOpacity>

      {/* Display the selected image, if available */}
      {licenseImage && (
        <Image source={{ uri: licenseImage.uri }} style={styles.imagePreview} />
      )}

      <TouchableOpacity style={styles.button} onPress={handleNext}>
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
    backgroundColor: '#FFF',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subHeaderText: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
  },
  input: {
    height: 40,
    width: '90%',
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#F0F0F0',
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePickerButton: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});
