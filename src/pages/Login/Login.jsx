// src/pages/Login/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [openForgot, setOpenForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [loadingForgot, setLoadingForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error de conexión. Verifica que el servidor esté funcionando.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      alert('Por favor ingresa tu correo electrónico');
      return;
    }

    setLoadingForgot(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://jylclean-backend.vercel.app';
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { 
        email: forgotEmail 
      });
      
      if (response.data.success) {
        alert('Si el correo existe, se ha enviado un enlace de recuperación.');
        setOpenForgot(false);
        setForgotEmail('');
      } else {
        alert(response.data.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error al enviar el correo de recuperación');
    } finally {
      setLoadingForgot(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div 
        className="login-card glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="login-header">
          <motion.h1 
            className="login-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Bienvenido
          </motion.h1>
          <motion.p 
            className="login-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Inicia sesión para continuar
          </motion.p>
        </div>

        {error && (
          <motion.div 
            className="message error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <FiAlertCircle />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label className="form-label">Correo Electrónico</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="    tu@email.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="    ••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <motion.button 
            type="submit" 
            className="login-button"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Iniciar Sesión'}
          </motion.button>

          <div className="login-links">
            <button 
              type="button"
              onClick={() => navigate('/register')} 
              className="link-button"
              disabled={loading}
            >
              ¿No tienes cuenta? Regístrate
            </button>
            
            <button 
              type="button"
              onClick={() => setOpenForgot(true)} 
              className="link-button highlight"
              disabled={loading}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>
      </motion.div>

      <Dialog 
        open={openForgot} 
        onClose={() => !loadingForgot && setOpenForgot(false)} 
        PaperProps={{ className: 'glass-dialog' }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="dialog-title">Recuperar contraseña</DialogTitle>
        <DialogContent>
          <p className="dialog-text">
            Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
          </p>
          <div className="form-field">
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                className="form-input"
                placeholder="    tu@email.com"
                autoFocus
                disabled={loadingForgot}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenForgot(false)} 
            className="dialog-button"
            disabled={loadingForgot}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleForgotPassword} 
            className="dialog-button primary" 
            disabled={loadingForgot || !forgotEmail}
          >
            {loadingForgot ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;