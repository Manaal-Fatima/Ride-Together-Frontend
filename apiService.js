import axios from 'axios';

const API_URL = 'https://ride-together-mybackend-manaal.onrender.com/api/v1/auth'; // replace with your IP
// const API_URL = 'http://192.168.1.2:8081/api/v1/auth';
// const API_URL = 'http://192.168.1.5:8081/api/v1/auth';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}`/register, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response ? error.response.data : error.message);
    throw error;
  }
};