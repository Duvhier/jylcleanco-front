import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" className="glass-navbar">
      <Toolbar className="navbar-toolbar">
        <Box className="navbar-logo-box">
          <img
            src="/images/logo.png"
            alt="Logo J&L Clean Co."
            className="navbar-logo"
          />
          <Typography variant="h5" component="div" className="navbar-title">
            J&L Clean Co.
          </Typography>
        </Box>

        <Box className="navbar-buttons">
          <Button 
            className={`navbar-button ${isActive('/') ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            Inicio
          </Button>
          <Button 
            className={`navbar-button ${isActive('/products') ? 'active' : ''}`}
            onClick={() => navigate('/products')}
          >
            Productos
          </Button>

          {isAuthenticated ? (
            <>
              <Button 
                className={`navbar-button ${isActive('/cart') ? 'active' : ''}`}
                onClick={() => navigate('/cart')}
              >
                Carrito
              </Button>

              {(user.role === 'Admin' || user.role === 'SuperUser') && (
                <Button 
                  className={`navbar-button admin ${isActive('/admin') ? 'active' : ''}`}
                  onClick={() => navigate('/admin')}
                >
                  Panel Admin
                </Button>
              )}

              {user.role === 'SuperUser' && (
                <Button 
                  className={`navbar-button superuser ${isActive('/superuser') ? 'active' : ''}`}
                  onClick={() => navigate('/superuser')}
                >
                  Panel SuperUser
                </Button>
              )}

              <Button 
                className="navbar-button logout"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Button 
                className={`navbar-button ${isActive('/login') ? 'active' : ''}`}
                onClick={() => navigate('/login')}
              >
                Iniciar Sesión
              </Button>
              <Button 
                className={`navbar-button ${isActive('/register') ? 'active' : ''}`}
                onClick={() => navigate('/register')}
              >
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
