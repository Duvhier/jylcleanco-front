// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children, requiredRole, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)'
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: '#0f172a' }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirigir al login pero guardar la ubicación actual para volver después
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar roles
  // Soporta tanto 'requiredRole' (string único) como 'roles' (array de strings)
  // También mantiene la lógica de que SuperUser tiene acceso a todo lo de Admin
  
  const allowedRoles = roles || (requiredRole ? [requiredRole] : []);
  
  if (allowedRoles.length > 0) {
    const hasRole = allowedRoles.includes(user.role);
    const isSuperUser = user.role === 'SuperUser';
    
    // Si no tiene el rol requerido y no es SuperUser (que suele tener acceso a todo)
    if (!hasRole && !isSuperUser) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;