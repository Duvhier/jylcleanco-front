import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #0d47a1 60%, #1976d2 100%)', boxShadow: '0 4px 16px rgba(13,71,161,0.15)' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img
            src="src/public/images/logo.png"
            alt="Logo J&L Clean Co."
            style={{ height: 40, marginRight: 12 }}
          />
          <Typography variant="h5" component="div" className="bebas-navbar" sx={{ letterSpacing: 2, color: '#fff', fontWeight: 700 }}>
            J&L Clean Co.
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/')}>
            Inicio
          </Button>
          
          <Button color="inherit" onClick={() => navigate('/products')}>
            Productos
          </Button>

          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={() => navigate('/cart')}>
                Carrito
              </Button>

              {(user.role === 'Admin' || user.role === 'SuperUser') && (
                <Button color="inherit" onClick={() => navigate('/admin')}>
                  Panel Admin
                </Button>
              )}

              {user.role === 'SuperUser' && (
                <Button color="inherit" onClick={() => navigate('/superuser')}>
                  Panel SuperUser
                </Button>
              )}

              <Button color="inherit" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Iniciar Sesión
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Registrarse
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 