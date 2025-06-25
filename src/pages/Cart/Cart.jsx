import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Box,
  TextField,
  Divider,
  Avatar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [modalMsg, setModalMsg] = useState({ open: false, message: '', type: 'info' });

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
    } catch (error) {
      toast.error('Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/cart/update/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (error) {
      toast.error('Error al actualizar la cantidad');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
      toast.success('Producto eliminado del carrito');
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/cart/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
      setOpenConfirm(false);
      toast.success('Carrito vaciado');
    } catch (error) {
      toast.error('Error al vaciar el carrito');
    }
  };

  const handleCheckout = async () => {
    if (cart.products.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const products = cart.products.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      }));

      await axios.post(
        'http://localhost:5000/api/sales',
        { products },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await handleClearCart();
      toast.success('Compra realizada con éxito');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al realizar la compra');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" className="cart-container">
        <div className="cart-loading">
          <span className="cart-loading-spinner"></span>
          Cargando carrito...
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" className="cart-container">
        <Paper className="cart-paper" elevation={0}>
          <Typography variant="h4" className="cart-title">
            Carrito de Compras
          </Typography>
          <div className="cart-empty">
            Debes iniciar sesión para ver tu carrito
          </div>
        </Paper>
      </Container>
    );
  }

  const total = cart.products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <Container maxWidth="md" className="cart-container">
      <Paper className="cart-paper" elevation={0}>
        <Typography variant="h4" className="cart-title">
          Carrito de Compras
        </Typography>

        {cart.products.length === 0 ? (
          <div className="cart-empty">
            Tu carrito está vacío. ¡Agrega algunos productos!
          </div>
        ) : (
          <>
            <List className="cart-list">
              {cart.products.map((item) => (
                <ListItem key={item.product._id} className="cart-item">
                  <Avatar
                    src={item.product.image || item.product.imageUrl}
                    alt={item.product.name}
                    className="cart-avatar"
                  />
                  <ListItemText
                    primary={item.product.name}
                    secondary={`$${item.product.price}`}
                    className="cart-item-text"
                  />
                  <ListItemSecondaryAction>
                    <Box className="cart-quantity-box">
                      <IconButton 
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)} 
                        className="icon-white"
                        size="small"
                      >
                        <RemoveIcon />
                      </IconButton>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.product._id, parseInt(e.target.value) || 1)}
                        className="cart-quantity-input"
                        min="1"
                      />
                      <IconButton 
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)} 
                        className="icon-white"
                        size="small"
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleRemoveItem(item.product._id)} 
                        className="icon-delete"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Divider className="cart-divider" />

            <Box className="cart-summary">
              <Typography variant="h5" className="cart-total">
                Total: ${total.toFixed(2)}
              </Typography>
              <Button 
                onClick={() => setOpenConfirm(true)} 
                className="cart-clear-button"
              >
                Vaciar Carrito
              </Button>
            </Box>

            <Button
              onClick={handleCheckout}
              className="cart-checkout-button"
              variant="contained"
              size="large"
            >
              Proceder al Pago
            </Button>
          </>
        )}
      </Paper>

      <Dialog 
        open={openConfirm} 
        onClose={() => setOpenConfirm(false)}
        PaperProps={{ className: 'cart-dialog' }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="dialog-title">
          Vaciar Carrito
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Typography>
            ¿Estás seguro de que quieres vaciar todo el carrito? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenConfirm(false)} 
            className="dialog-button"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleClearCart} 
            className="dialog-button error"
          >
            Vaciar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;
