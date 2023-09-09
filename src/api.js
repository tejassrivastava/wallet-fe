import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with your backend API URL
});

export default instance;
