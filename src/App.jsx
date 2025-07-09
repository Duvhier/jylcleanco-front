import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes
import Navbar from './components/Navbar/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart/Cart';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import SuperUserDashboard from './pages/SuperUserDashboard';
import AddProduct from './pages/AddProduct/AddProduct';
import ManageProducts from './pages/ManageProducts/ManageProducts';
import ManageUsers from './pages/ManageUsers';
import Sales from './pages/Sales';
import EditProduct from './pages/EditProduct/EditProduct';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          
          {/* Rutas protegidas */}
          <Route path="/cart" element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          } />
          
          <Route path="/admin" element={
            <PrivateRoute roles={['Admin', 'SuperUser']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/admin/add-product" element={
            <PrivateRoute roles={['Admin', 'SuperUser']}>
              <AddProduct />
            </PrivateRoute>
          } />
          
          <Route path="/admin/manage-products" element={
            <PrivateRoute roles={['Admin', 'SuperUser']}>
              <ManageProducts />
            </PrivateRoute>
          } />
          
          <Route path="/admin/manage-users" element={
            <PrivateRoute roles={['Admin', 'SuperUser']}>
              <ManageUsers />
            </PrivateRoute>
          } />

          <Route path="/admin/sales" element={
            <PrivateRoute roles={['Admin', 'SuperUser']}>
              <Sales />
            </PrivateRoute>
          } />
          
          <Route path="/admin/edit-product/:productId" element={
            <PrivateRoute roles={['Admin', 'SuperUser']}>
              <EditProduct />
            </PrivateRoute>
          } />
          
          <Route path="/superuser" element={
            <PrivateRoute roles={['SuperUser']}>
              <SuperUserDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 