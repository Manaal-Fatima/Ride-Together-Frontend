// ChatScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import io from 'socket.io-client';

const socket = io('http://your-server-ip:3000'); // Replace with your server's IP and port

export default function ChatScreen({ route }) {
  const { driverId, userId } = route.params; // Pass user and driver IDs
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    // Join the socket room for this chat
    socket.emit('join', { userId });

    // Listen for incoming messages
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const messageData = {
        senderId: userId,
        receiverId: driverId,
        text: messageText,
      };
      socket.emit('sendMessage', messageData);
      setMessageText('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={styles.message}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
      />
      <TextInput
        style={styles.input}
        value={messageText}
        onChangeText={setMessageText}
        placeholder="Type a message..."
      />
      <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
  button: { backgroundColor: '#007AFF', padding: 10, alignItems: 'center' },
  buttonText: { color: 'white' },
  message: { padding: 10, backgroundColor: '#f1f1f1', marginVertical: 5 },
});
