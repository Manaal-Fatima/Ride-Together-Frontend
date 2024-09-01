import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { RadioButton } from 'react-native-paper';

export default function ManageProfile() {
    const [fullName, setFullName] = useState('');
    const [checked, setChecked] = useState(''); // State for radio button selection
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profileImage, setProfileImage] = useState('https://t.ly/6f2ou');
    const [imageUri, setImageUri] = useState(null); // Store image URI for upload

    const handleImagePick = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.uri);
            setImageUri(result.uri); // Store the image URI
        }
    };

    const handleSave = async () => {
        const profileDetails = {
            fullName,
            gender: checked,
            email,
            phoneNumber,
        };

        try {
            // Update profile details
            const profileResponse = await axios.patch(`http://127.0.0.1:8000/api/v1/user/user-details-add`, profileDetails);
            console.log('Profile details updated:', profileResponse.data);

            // Upload profile image if an image was selected
            if (imageUri) {
                const formData = new FormData();
                formData.append('images', {
                    uri: imageUri,
                    type: 'image/jpeg', // Adjust MIME type if needed
                    name: 'profile.jpg',
                });

                const imageResponse = await axios.patch(`http://127.0.0.1:8000/api/v1/user/user-profile-image-add/66647bf732c6a6d7771491d3`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Image uploaded:', imageResponse.data);
            }

        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>
            <TouchableOpacity style={styles.imageContainer} onPress={handleImagePick}>
                <Image style={styles.image} source={{ uri: profileImage }} />
                <Text style={styles.changeImageText}>Change Image</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
            />
            <View style={styles.radioContainer}>
                <View style={styles.radioButton}>
                    <RadioButton
                        value="Male"
                        status={checked === 'Male' ? 'checked' : 'unchecked'}
                        onPress={() => setChecked('Male')}
                    />
                    <Text style={styles.radioText}>Male </Text>
                </View>
                <View style={styles.radioButton}>
                    <RadioButton
                        value="Female"
                        status={checked === 'Female' ? 'checked' : 'unchecked'}
                        onPress={() => setChecked('Female')}
                    />
                    <Text style={styles.radioText}>Female </Text>
                </View>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    changeImageText: {
        color: '#167E72',
        marginTop: 10,
    },
    input: {
        height: 40,
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginRight: 20,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    radioText: {
        fontSize: 16,
    },
    button: {
        backgroundColor: '#167E72',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});




// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { RadioButton } from 'react-native-paper';

// export default function ManageProfile() {
//   const [fullName, setFullName] = useState('');
//   const [checked, setChecked] = useState(''); // State for radio button selection
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');

//   const handleSave = () => {
//     const profileDetails = {
//       fullName,
//       gender: checked,
//       email,
//       phoneNumber,
//     };
//     console.log(profileDetails);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>My Profile</Text>
//       <TouchableOpacity style={styles.imageContainer}>
//         <Image
//           style={styles.image}
//           source={{ uri: 'https://t.ly/6f2ou' }} 
//         />
//         <Text style={styles.changeImageText}>Change Image</Text>
//       </TouchableOpacity>
//       <TextInput
//         style={styles.input}
//         placeholder="Full Name"
//         value={fullName}
//         onChangeText={setFullName}
//       />
//       <View style={styles.radioContainer}>
//         <Text style={styles.label}>Gender</Text>
//         <View style={styles.radioButton}>
//           <RadioButton
//             value="Male"
//             status={checked === 'Male' ? 'checked' : 'unchecked'}
//             onPress={() => setChecked('Male')}
//           />
//           <Text style={styles.radioText}>Male</Text>
//         </View>
//         <View style={styles.radioButton}>
//           <RadioButton
//             value="Female"
//             status={checked === 'Female' ? 'checked' : 'unchecked'}
//             onPress={() => setChecked('Female')}
//           />
//           <Text style={styles.radioText}>Female</Text>
//         </View>
//       </View>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Phone Number"
//         value={phoneNumber}
//         onChangeText={setPhoneNumber}
//         keyboardType="phone-pad"
//       />
//       <TouchableOpacity style={styles.button} onPress={handleSave}>
//         <Text style={styles.buttonText}>Save Changes</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   imageContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   changeImageText: {
//     color: '#167E72',
//     marginTop: 10,
//   },
//   input: {
//     height: 40,
//     borderColor: 'lightgrey',
//     borderWidth: 1,
//     borderRadius: 5,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
//   radioContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginRight: 20,
//   },
//   radioButton: {
//     borderColor: '#167E72',
    
//     color: '#167E72',
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   radioText: {
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: '#167E72',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//   },
// });


