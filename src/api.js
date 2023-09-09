import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://fierce-puce-pleat.cyclic.cloud/api', // Replace with your backend API URL
});

export default instance;
