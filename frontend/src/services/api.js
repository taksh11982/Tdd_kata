import axios from 'axios';
import { navigateTo } from './navigation';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || 'Session expired. Please log in again.';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.setItem('auth_error', message);
      navigateTo('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
