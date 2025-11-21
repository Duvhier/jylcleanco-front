
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiMail, FiLock, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
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

  const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const specialCharsRegex = new RegExp(`[${escapeRegex(SPECIAL_CHARS)}]`);
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor ingresa un correo electrónico válido');
      return false;
    }

    if (!passwordRegex.test(password)) {
      toast.error(`La contraseña no cumple con los requisitos de seguridad.`);
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
    if (modalMsg.type === 'success') {
      navigate('/login');
    }
  };

  return (
    <div className="register-container">
      <motion.div 
        className="register-card glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="register-header">
          <motion.h1 
            className="register-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Crear Cuenta
          </motion.h1>
          <motion.p 
            className="register-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Únete a J&L Clean Co. y descubre nuestros productos
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-field">
            <label className="form-label">Nombre Completo</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
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
          </div>

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
                placeholder="tu@email.com"
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
                placeholder="Crea una contraseña segura"
                required
                disabled={loading}
              />
            </div>
            
            {formData.password && (
              <motion.div 
                className="password-requirements"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <h4 className="requirements-title">Requisitos:</h4>
                <div className={`requirement ${passwordValidation.length ? 'valid' : 'invalid'}`}>
                  {passwordValidation.length ? <FiCheck /> : <FiX />} Mínimo 8 caracteres
                </div>
                <div className={`requirement ${passwordValidation.lowercase ? 'valid' : 'invalid'}`}>
                  {passwordValidation.lowercase ? <FiCheck /> : <FiX />} Una minúscula
                </div>
                <div className={`requirement ${passwordValidation.uppercase ? 'valid' : 'invalid'}`}>
                  {passwordValidation.uppercase ? <FiCheck /> : <FiX />} Una mayúscula
                </div>
                <div className={`requirement ${passwordValidation.number ? 'valid' : 'invalid'}`}>
                  {passwordValidation.number ? <FiCheck /> : <FiX />} Un número
                </div>
                <div className={`requirement ${passwordValidation.special ? 'valid' : 'invalid'}`}>
                  {passwordValidation.special ? <FiCheck /> : <FiX />} Un carácter especial
                </div>
              </motion.div>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Confirmar Contraseña</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
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
            </div>
            {formData.confirmPassword && (
              <div className={`password-match-status ${formData.password === formData.confirmPassword ? 'match' : 'no-match'}`}>
                {formData.password === formData.confirmPassword ? (
                  <><FiCheck /> Las contraseñas coinciden</>
                ) : (
                  <><FiX /> Las contraseñas no coinciden</>
                )}
              </div>
            )}
          </div>

          <motion.button 
            type="submit" 
            className="register-button"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Crear Cuenta'}
          </motion.button>

          <div className="login-section">
            <p className="login-text">¿Ya tienes una cuenta?</p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="login-link-btn"
              disabled={loading}
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </motion.div>

      <Dialog 
        open={modalMsg.open} 
        onClose={handleModalClose}
        PaperProps={{ className: 'glass-dialog' }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className={`dialog-title ${modalMsg.type}`}>
          {modalMsg.type === 'success' ? '🎉 ¡Registro Exitoso!' : '❌ Error'}
        </DialogTitle>
        <DialogContent>
          <p className="dialog-text">{modalMsg.message}</p>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleModalClose}
            className={`dialog-button ${modalMsg.type === 'success' ? 'success' : 'error'}`}
            variant="contained"
          >
            {modalMsg.type === 'success' ? 'Continuar' : 'Cerrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Register;