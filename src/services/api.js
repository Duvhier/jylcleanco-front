// src/services/api.js - CONFIGURACIÓN CORREGIDA
import axios from 'axios';

// IMPORTANTE: Agregar /api a la base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jylclean-back.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('storage'));
    }
    return Promise.reject(error);
  }
);

export default api;