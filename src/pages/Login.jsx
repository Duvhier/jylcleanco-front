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
  const [modalMsg, setModalMsg] = useState({ open: false, message: '', type: 'info' });

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
      setModalMsg({ open: true, message: 'Inicio de sesión exitoso', type: 'success' });
      navigate('/');
    } catch (error) {
      setModalMsg({ open: true, message: error.message || 'Error al iniciar sesión', type: 'error' });
    }
  };

  const handleForgotPassword = async () => {
    setLoadingForgot(true);
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email: forgotEmail });
      setModalMsg({ open: true, message: 'Si el correo existe, se ha enviado un enlace de recuperación.', type: 'success' });
      setOpenForgot(false);
      setForgotEmail('');
    } catch (error) {
      setModalMsg({ open: true, message: error.response?.data?.message || 'Error al enviar el correo de recuperación', type: 'error' });
    } finally {
      setLoadingForgot(false);
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        mt: 4,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper 
        className="glass-card"
        elevation={0}
        sx={{ 
          p: 4,
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: 500
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            color: '#fff',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            fontWeight: 600
          }}
        >
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
            className="glass-input"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#fff',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.8)',
                '&.Mui-focused': {
                  color: '#fff',
                },
              },
              '& .MuiInputBase-input': {
                color: '#fff',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              },
            }}
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
            className="glass-input"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#fff',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.8)',
                '&.Mui-focused': {
                  color: '#fff',
                },
              },
              '& .MuiInputBase-input': {
                color: '#fff',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              },
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="glass-button"
            sx={{ 
              mt: 3,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }
            }}
          >
            Iniciar Sesión
          </Button>
          
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/register')}
            sx={{ 
              mt: 1,
              color: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff'
              }
            }}
          >
            ¿No tienes cuenta? Regístrate
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => setOpenForgot(true)}
            sx={{ 
              mt: 1, 
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 'bold',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff'
              }
            }}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </Box>
      </Paper>
      
      <Dialog 
        open={openForgot} 
        onClose={() => setOpenForgot(false)}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
          Recuperar contraseña
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Correo electrónico"
            type="email"
            fullWidth
            value={forgotEmail}
            onChange={e => setForgotEmail(e.target.value)}
            className="glass-input"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#fff',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.8)',
                '&.Mui-focused': {
                  color: '#fff',
                },
              },
              '& .MuiInputBase-input': {
                color: '#fff',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenForgot(false)}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff'
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleForgotPassword} 
            disabled={loadingForgot} 
            variant="contained"
            className="glass-button"
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              color: '#fff',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderColor: 'rgba(255, 255, 255, 0.4)',
              }
            }}
          >
            {loadingForgot ? 'Enviando...' : 'Enviar enlace'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modalMsg.open} onClose={() => setModalMsg({ ...modalMsg, open: false })}>
        <DialogTitle>{modalMsg.type === 'success' ? 'Éxito' : 'Error'}</DialogTitle>
        <DialogContent>
          <Typography>{modalMsg.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalMsg({ ...modalMsg, open: false })}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login; 