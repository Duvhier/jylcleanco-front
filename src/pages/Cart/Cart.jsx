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
import api from '../../services/api'; // ← USAR TU API CONFIGURADA
import { useAuth } from '../../contexts/AuthContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart'); // ← USAR API CONFIGURADA
      setCart(response.data);
    } catch (error) {
      console.error('Error cargando carrito:', error);
      
      if (error.response?.status === 401) {
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
      } else if (error.response?.status === 404) {
        // Carrito no encontrado, crear uno vacío
        setCart({ products: [] });
      } else {
        toast.error('Error al cargar el carrito');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await api.put(
        `/cart/update/${productId}`, // ← USAR API CONFIGURADA
        { quantity: newQuantity }
      );
      fetchCart();
      toast.success('Cantidad actualizada');
    } catch (error) {
      console.error('Error actualizando cantidad:', error);
      
      if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`);
      } else {
        toast.error('Error al actualizar la cantidad');
      }
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`); // ← USAR API CONFIGURADA
      fetchCart();
      toast.success('Producto eliminado del carrito');
    } catch (error) {
      console.error('Error eliminando producto:', error);
      toast.error('Error al eliminar el producto');
    }
  };

  const handleClearCart = async () => {
    try {
      await api.delete('/cart/clear'); // ← USAR API CONFIGURADA
      fetchCart();
      setOpenConfirm(false);
      toast.success('Carrito vaciado');
    } catch (error) {
      console.error('Error vaciando carrito:', error);
      toast.error('Error al vaciar el carrito');
    }
  };

  const handleCheckout = async () => {
    if (cart.products.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    try {
      const products = cart.products.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      }));

      await api.post('/sales', { products }); // ← USAR API CONFIGURADA

      await handleClearCart();
      toast.success('✅ Compra realizada con éxito');
      navigate('/');
    } catch (error) {
      console.error('Error en checkout:', error);
      
      if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`);
      } else if (error.response?.status === 400) {
        toast.error('Stock insuficiente para algunos productos');
      } else {
        toast.error('Error al realizar la compra');
      }
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
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.jpg';
                    }}
                  />
                  <ListItemText
                    primary={item.product.name}
                    secondary={
                      <>
                        <div>${item.product.price}</div>
                        <div className="cart-item-subtotal">
                          Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </>
                    }
                    className="cart-item-text"
                  />
                  <ListItemSecondaryAction>
                    <Box className="cart-quantity-box">
                      <IconButton 
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)} 
                        className="icon-white"
                        size="small"
                        disabled={item.quantity <= 1}
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
              <Box className="cart-actions">
                <Button 
                  onClick={() => setOpenConfirm(true)} 
                  className="cart-clear-button"
                  variant="outlined"
                >
                  Vaciar Carrito
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="cart-checkout-button"
                  variant="contained"
                  size="large"
                >
                  Proceder al Pago
                </Button>
              </Box>
            </Box>
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
            variant="contained"
          >
            Vaciar Carrito
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;