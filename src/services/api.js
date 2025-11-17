import axios from 'axios';

// Configuración base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jylclean-back.vercel.app';

console.log('🔧 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos para Vercel serverless
  withCredentials: false,
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
    
    console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
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
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Log detallado del error
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('❌ Response Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('❌ No Response:', {
        message: 'El servidor no respondió',
        url: error.config?.url,
        timeout: error.code === 'ECONNABORTED'
      });
    } else {
      // Error al configurar la petición
      console.error('❌ Setup Error:', error.message);
    }
    
    // Manejar sesión expirada
    if (error.response?.status === 401) {
      console.warn('⚠️ Sesión expirada');
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('storage'));
    }
    
    return Promise.reject(error);
  }
);

export default api;