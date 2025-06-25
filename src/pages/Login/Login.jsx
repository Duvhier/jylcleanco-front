import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Paper, TextField, Typography, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
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
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoadingForgot(true);
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email: forgotEmail });
      alert('Si el correo existe, se ha enviado un enlace de recuperación.');
      setOpenForgot(false);
      setForgotEmail('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error al enviar el correo de recuperación');
    } finally {
      setLoadingForgot(false);
    }
  };

  return (
    <Container maxWidth="sm" className="login-container">
      <Paper elevation={0} className="login-card">
        <Typography variant="h4" component="h1" gutterBottom align="center" className="login-title">
          Iniciar Sesión
        </Typography>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        <Box component="form" onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Tu contraseña"
              required
            />
          </div>

          <button 
            type="submit" 
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading && <span className="loading-spinner"></span>}
            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>

          <Button 
            fullWidth 
            variant="text" 
            onClick={() => navigate('/register')} 
            className="link-button"
          >
            ¿No tienes cuenta? Regístrate
          </Button>
          
          <Button 
            fullWidth 
            variant="text" 
            onClick={() => setOpenForgot(true)} 
            className="link-button bold"
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </Box>
      </Paper>

      <Dialog 
        open={openForgot} 
        onClose={() => setOpenForgot(false)} 
        PaperProps={{ className: 'glass-dialog' }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="dialog-title">Recuperar contraseña</DialogTitle>
        <DialogContent>
          <div className="form-field">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              className="form-input"
              placeholder="tu@email.com"
              autoFocus
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForgot(false)} className="dialog-button">
            Cancelar
          </Button>
          <Button 
            onClick={handleForgotPassword} 
            className="dialog-button" 
            disabled={loadingForgot}
          >
            {loadingForgot ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;
