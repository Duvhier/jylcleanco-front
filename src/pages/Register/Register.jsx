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
import { useAuth } from '../../contexts/AuthContext';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [modalMsg, setModalMsg] = useState({ open: false, message: '', type: 'info' });
  const [loading, setLoading] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordRegex.test(formData.password)) {
      toast.error('La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);
      setModalMsg({ open: true, message: 'Registro exitoso', type: 'success' });
      navigate('/');
    } catch (error) {
      setModalMsg({ open: true, message: error.message || 'Error al registrarse', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="register-container">
      <Paper className="register-card" elevation={0}>
        <Typography variant="h4" component="h1" gutterBottom align="center" className="register-title">
          Registro
        </Typography>

        <Box component="form" onSubmit={handleSubmit} className="register-form">
          <div className="form-field">
            <label className="form-label">Nombre de Usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Tu nombre de usuario"
              required
            />
          </div>

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
            {formData.password && (
              <div className="password-requirements">
                <div className={`requirement ${passwordValidation.length ? 'valid' : 'invalid'}`}>
                  <span className="requirement-icon"></span>
                  Mínimo 8 caracteres
                </div>
                <div className={`requirement ${passwordValidation.lowercase ? 'valid' : 'invalid'}`}>
                  <span className="requirement-icon"></span>
                  Una letra minúscula
                </div>
                <div className={`requirement ${passwordValidation.uppercase ? 'valid' : 'invalid'}`}>
                  <span className="requirement-icon"></span>
                  Una letra mayúscula
                </div>
                <div className={`requirement ${passwordValidation.number ? 'valid' : 'invalid'}`}>
                  <span className="requirement-icon"></span>
                  Un número
                </div>
                <div className={`requirement ${passwordValidation.special ? 'valid' : 'invalid'}`}>
                  <span className="requirement-icon"></span>
                  Un carácter especial
                </div>
              </div>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Confirma tu contraseña"
              required
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div className="message error">
                Las contraseñas no coinciden
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`register-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading && <span className="loading-spinner"></span>}
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>

          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
            className="login-link"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Button>
        </Box>
      </Paper>

      <Dialog 
        open={modalMsg.open} 
        onClose={() => setModalMsg({ ...modalMsg, open: false })}
        PaperProps={{ className: 'register-dialog' }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="dialog-title">
          {modalMsg.type === 'success' ? 'Éxito' : 'Error'}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Typography>{modalMsg.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setModalMsg({ ...modalMsg, open: false })} 
            className="dialog-button"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Register;
