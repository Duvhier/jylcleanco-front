import axios from 'axios';

// Configuración única para axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jylclean-back.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: false, // Sin credenciales para simplificar CORS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debugging (remover en producción)
    console.log('🚀 Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // Log detallado del error
    if (error.response) {
      console.error('❌ Response Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      console.error('❌ No Response:', {
        message: 'El servidor no respondió',
        url: error.config?.url
      });
    } else {
      console.error('❌ Request Setup Error:', error.message);
    }
    
    // Manejar sesión expirada
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('storage'));
    }
    
    return Promise.reject(error);
  }
);

export default api;