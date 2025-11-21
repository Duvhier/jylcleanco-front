import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiShoppingBag, FiShoppingCart, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Inicio', path: '/', icon: <FiHome /> },
    { label: 'Productos', path: '/products', icon: <FiShoppingBag /> },
  ];

  if (isAuthenticated) {
    navItems.push({ label: 'Carrito', path: '/cart', icon: <FiShoppingCart /> });
    if (user.role === 'Admin' || user.role === 'SuperUser') {
      navItems.push({ label: 'Panel Admin', path: '/admin', icon: <FiSettings /> });
    }
    if (user.role === 'SuperUser') {
      navItems.push({ label: 'Panel SuperUser', path: '/superuser', icon: <FiSettings /> });
    }
  }

  const authButtons = isAuthenticated ? (
    <Button 
      className="navbar-button logout"
      onClick={handleLogout}
      startIcon={<FiLogOut />}
    >
      Cerrar Sesión
    </Button>
  ) : (
    <>
      <Button 
        className={`navbar-button ${isActive('/login') ? 'active' : ''}`}
        onClick={() => navigate('/login')}
      >
        Iniciar Sesión
      </Button>
      <Button 
        className="navbar-button register"
        onClick={() => navigate('/register')}
      >
        Registrarse
      </Button>
    </>
  );

  const drawer = (
    <Box className="mobile-drawer">
      <Box className="drawer-header">
        <Typography variant="h6" className="drawer-title">
          J&L Clean Co.
        </Typography>
        <IconButton onClick={handleDrawerToggle} className="close-button">
          <FiX />
        </IconButton>
      </Box>
      <List className="drawer-list">
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.label} 
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            className={`drawer-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="drawer-icon">{item.icon}</span>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem className="drawer-auth-buttons">
          {isAuthenticated ? (
            <Button 
              fullWidth 
              variant="outlined" 
              color="error" 
              onClick={handleLogout}
              startIcon={<FiLogOut />}
            >
              Cerrar Sesión
            </Button>
          ) : (
            <Box className="mobile-auth-group">
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => {
                  navigate('/login');
                  setMobileOpen(false);
                }}
                className="mobile-login-btn"
              >
                Iniciar Sesión
              </Button>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={() => {
                  navigate('/register');
                  setMobileOpen(false);
                }}
                className="mobile-register-btn"
              >
                Registrarse
              </Button>
            </Box>
          )}
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        className={`glass-navbar ${scrolled ? 'scrolled' : ''}`}
        elevation={scrolled ? 4 : 0}
      >
        <Toolbar className="navbar-toolbar">
          <Box 
            className="navbar-logo-box" 
            onClick={() => navigate('/')}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src="/images/logo.png"
              alt="Logo J&L Clean Co."
              className="navbar-logo"
            />
            <Typography variant="h5" component="div" className="navbar-title">
              J&L Clean Co.
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="menu-button"
            >
              <FiMenu />
            </IconButton>
          ) : (
            <Box className="navbar-buttons">
              {navItems.map((item) => (
                <Button 
                  key={item.label}
                  className={`navbar-button ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              ))}
              <Box className="auth-separator" />
              {authButtons}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        className="mobile-drawer-container"
      >
        {drawer}
      </Drawer>
      
      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <Toolbar /> 
    </>
  );
};

export default Navbar;
