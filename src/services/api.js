import axios from 'axios';

// IMPORTANTE: Debe apuntar al BACKEND, no al frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jylclean-back.vercel.app';

// Verificar que la URL es correcta
if (!API_BASE_URL.includes('jylclean-back')) {
  console.error('⚠️ API_BASE_URL está mal configurada:', API_BASE_URL);
  console.error('⚠️ Debe ser: https://jylclean-back.vercel.app');
}

console.log('🔧 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
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
    
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`📤 ${config.method?.toUpperCase()} ${fullUrl}`);
    
    // VALIDACIÓN: Asegurar que NO estamos llamando al frontend
    if (fullUrl.includes('jylcleanco-front')) {
      console.error('❌ ERROR: Intentando llamar al frontend en lugar del backend!');
      console.error('❌ URL incorrecta:', fullUrl);
      console.error('✅ Debe ser:', 'https://jylclean-back.vercel.app' + config.url);
      throw new Error('Configuración incorrecta: llamando al frontend en lugar del backend');
    }
    
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
    if (error.response) {
      console.error('❌ Response Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        fullUrl: `${error.config?.baseURL}${error.config?.url}`
      });
    } else if (error.request) {
      console.error('❌ No Response:', {
        message: 'El servidor no respondió',
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        timeout: error.code === 'ECONNABORTED'
      });
    } else {
      console.error('❌ Setup Error:', error.message);
    }
    
    if (error.response?.status === 401) {
      console.warn('⚠️ Sesión expirada');
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('storage'));
    }
    
    return Promise.reject(error);
  }
);

export default api;