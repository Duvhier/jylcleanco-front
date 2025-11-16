// src/config/api.js
import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';

// Configuración para diferentes entornos
export const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5000',
    timeout: 10000
  },
  production: {
    baseURL: 'https://jylclean-back.vercel.app',
    timeout: 15000
  }
};

const currentEnv = isProduction ? 'production' : 'development';
export const API_BASE_URL = API_CONFIG[currentEnv].baseURL;

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/api/products`,
  CART: `${API_BASE_URL}/api/cart`,
  AUTH: `${API_BASE_URL}/api/auth`,
  HEALTH: `${API_BASE_URL}/api/health`
};

// Configuración global de axios
export const setupAxios = () => {
  axios.defaults.baseURL = API_BASE_URL;
  axios.defaults.timeout = API_CONFIG[currentEnv].timeout;
  
  // Interceptor para requests
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers['Content-Type'] = 'application/json';
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para responses
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
      }
      return Promise.reject(error);
    }
  );
};