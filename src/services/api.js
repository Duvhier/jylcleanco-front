// src/services/api.js
import axios from 'axios';

// Configuración base de Axios
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las requests
API.interceptors.request.use(
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

// Interceptor para manejar respuestas
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Endpoints de Autenticación
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => API.post(`/auth/reset-password/${token}`, { password }),
};

// Endpoints de Productos
export const productsAPI = {
  getAll: () => API.get('/products'),
  getById: (id) => API.get(`/products/${id}`),
  create: (productData) => API.post('/products', productData),
  update: (id, productData) => API.put(`/products/${id}`, productData),
  delete: (id) => API.delete(`/products/${id}`),
};

// Endpoints de Carrito
export const cartAPI = {
  get: () => API.get('/cart'),
  add: (productData) => API.post('/cart/add', productData),
  update: (productId, quantity) => API.put(`/cart/update/${productId}`, { quantity }),
  remove: (productId) => API.delete(`/cart/remove/${productId}`),
  clear: () => API.delete('/cart/clear'),
};

// Endpoints de Ventas
export const salesAPI = {
  getAll: () => API.get('/sales'),
  getMySales: () => API.get('/sales/my-sales'),
  getById: (id) => API.get(`/sales/${id}`),
  create: (saleData) => API.post('/sales', saleData),
  updateStatus: (id, status) => API.put(`/sales/${id}/status`, { status }),
};

// Endpoints de Usuarios (Solo SuperUser)
export const usersAPI = {
  getAll: () => API.get('/users'),
  getById: (id) => API.get(`/users/${id}`),
  update: (id, userData) => API.put(`/users/${id}`, userData),
  delete: (id) => API.delete(`/users/${id}`),
};

export default API;