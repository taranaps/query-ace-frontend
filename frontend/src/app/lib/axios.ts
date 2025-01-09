import axios from 'axios';
import { isAuthenticated } from './auth'; 

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    console.log('Request Config:', {
      url: config.url,
      token: token ? 'Present' : 'Missing',
      headers: config.headers
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;