import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [openForgot, setOpenForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [loadingForgot, setLoadingForgot] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast.success('Inicio de sesión exitoso');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    }
  };

  const handleForgotPassword = async () => {
    setLoadingForgot(true);
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email: forgotEmail });
      toast.success('Si el correo existe, se ha enviado un enlace de recuperación.');
      setOpenForgot(false);
      setForgotEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al enviar el correo de recuperación');
    } finally {
      setLoadingForgot(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Iniciar Sesión
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Iniciar Sesión
          </Button>
          
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/register')}
            sx={{ mt: 1 }}
          >
            ¿No tienes cuenta? Regístrate
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => setOpenForgot(true)}
            sx={{ mt: 1, color: '#1976d2', fontWeight: 'bold' }}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </Box>
      </Paper>
      <Dialog open={openForgot} onClose={() => setOpenForgot(false)}>
        <DialogTitle>Recuperar contraseña</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Correo electrónico"
            type="email"
            fullWidth
            value={forgotEmail}
            onChange={e => setForgotEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForgot(false)}>Cancelar</Button>
          <Button onClick={handleForgotPassword} disabled={loadingForgot} variant="contained" color="primary">
            {loadingForgot ? 'Enviando...' : 'Enviar enlace'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login; 