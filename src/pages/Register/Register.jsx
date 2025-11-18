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
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [modalMsg, setModalMsg] = useState({ open: false, message: '', type: 'info' });
  const [loading, setLoading] = useState(false);

  // ✅ Caracteres especiales permitidos (igual que en el backend)
  const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
  
  // ✅ Función para escapar caracteres especiales en regex
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // ✅ Regex para validar caracteres especiales
  const specialCharsRegex = new RegExp(`[${escapeRegex(SPECIAL_CHARS)}]`);
  
  // ✅ Validación completa de contraseña (igual que el backend)
  const passwordRegex = new RegExp(
    `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[${escapeRegex(SPECIAL_CHARS)}]).{8,}$`
  );

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
      special: specialCharsRegex.test(password)
    };
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) {
      toast.error('El nombre completo es requerido');
      return false;
    }

    if (!email.trim()) {
      toast.error('El correo electrónico es requerido');
      return false;
    }

    // ✅ Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor ingresa un correo electrónico válido');
      return false;
    }

    if (!passwordRegex.test(password)) {
      toast.error(`La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (${SPECIAL_CHARS}).`);
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const passwordValidation = validatePassword(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // ✅ Usar la estructura correcta para el backend
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      if (result.success) {
        setModalMsg({ 
          open: true, 
          message: '✅ Registro exitoso. Bienvenido a J&L Clean Co.', 
          type: 'success' 
        });
        // La navegación se manejará en el AuthContext después del registro exitoso
      } else {
        setModalMsg({ 
          open: true, 
          message: result.message || 'Error al registrarse', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setModalMsg({ 
        open: true, 
        message: 'Error de conexión. Por favor intenta nuevamente.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalMsg({ ...modalMsg, open: false });
    // ✅ Navegar al login si el registro fue exitoso
    if (modalMsg.type === 'success') {
      navigate('/login');
    }
  };

  return (
    <Container maxWidth="sm" className="register-container">
      <Paper className="register-card" elevation={0}>
        <Typography variant="h4" component="h1" gutterBottom align="center" className="register-title">
          Crear Cuenta
        </Typography>

        <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
          Únete a J&L Clean Co. y descubre nuestros productos de limpieza
        </Typography>

        <Box component="form" onSubmit={handleSubmit} className="register-form">
          <div className="form-field">
            <label className="form-label">Nombre Completo *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Tu nombre completo"
              required
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Correo Electrónico *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Contraseña *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Crea una contraseña segura"
              required
              disabled={loading}
            />
            {formData.password && (
              <div className="password-requirements">
                <h4 className="requirements-title">Requisitos de contraseña:</h4>
                <div className={`requirement ${passwordValidation.length ? 'valid' : 'invalid'}`}>
                  <span className="requirement-icon">
                    {passwordValidation.length ? '✓' : '✗'}
                  </span>
                  Mínimo 8 caracteres
                </div>
                <div className={`requirement ${passwordValidation.lowercase ? 'valid' : 'invalid'}`}>
                  <span className="requirement-icon">
                    {passwordValidation.lowercase ? '✓' : '✗'}
                  </span>
                  Una letra minúscula
                </div>
                <div className={`requirement ${passwordValidation.uppercase ? 'valid' : 'invalid'}`}>
                  <span className="requirement-icon">
                    {passwordValidation.uppercase ? '✓' : '✗'}
                  </span>
                  Una letra mayúscula
                </div>
                <div className={`requirement ${passwordValidation.number ? 'valid' : 'invalid'}`}>
                  <span className="requirement-icon">
                    {passwordValidation.number ? '✓' : '✗'}
                  </span>
                  Un número
                </div>
                <div className={`requirement ${passwordValidation.special ? 'valid' : 'invalid'}`}>
                  <span className="requirement-icon">
                    {passwordValidation.special ? '✓' : '✗'}
                  </span>
                  Un carácter especial ({SPECIAL_CHARS})
                </div>
              </div>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Confirmar Contraseña *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Confirma tu contraseña"
              required
              disabled={loading}
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div className="message error">
                ❌ Las contraseñas no coinciden
              </div>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <div className="message success">
                ✅ Las contraseñas coinciden
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`register-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading && <span className="loading-spinner"></span>}
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          <div className="login-section">
            <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 1 }}>
              ¿Ya tienes una cuenta?
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/login')}
              className="login-link"
              disabled={loading}
            >
              Iniciar Sesión
            </Button>
          </div>
        </Box>
      </Paper>

      <Dialog 
        open={modalMsg.open} 
        onClose={handleModalClose}
        PaperProps={{ className: 'register-dialog' }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className={`dialog-title ${modalMsg.type}`}>
          {modalMsg.type === 'success' ? '🎉 ¡Registro Exitoso!' : '❌ Error'}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Typography variant="body1">{modalMsg.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleModalClose}
            className={`dialog-button ${modalMsg.type === 'success' ? 'success' : 'error'}`}
            variant={modalMsg.type === 'success' ? 'contained' : 'outlined'}
          >
            {modalMsg.type === 'success' ? 'Continuar' : 'Cerrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Register;