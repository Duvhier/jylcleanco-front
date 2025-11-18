// src/pages/Cart/Cart.jsx
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
import { cartAPI, salesAPI } from '../../services/api'; // ✅ Importar APIs específicas
import { useAuth } from '../../contexts/AuthContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 }); // ✅ Estructura corregida
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
      const response = await cartAPI.get(); // ✅ Usar cartAPI
      
      if (response.data.success) {
        setCart(response.data.data || { items: [], total: 0 });
      } else {
        setCart({ items: [], total: 0 });
        console.warn('Respuesta del carrito no exitosa:', response.data);
      }
    } catch (error) {
      console.error('Error cargando carrito:', error);
      
      if (error.response?.status === 401) {
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
      } else if (error.response?.status === 404) {
        // Carrito no encontrado, crear uno vacío
        setCart({ items: [], total: 0 });
        console.log('Carrito no encontrado, inicializando vacío');
      } else {
        toast.error('Error al cargar el carrito');
        setCart({ items: [], total: 0 });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await cartAPI.update(productId, newQuantity); // ✅ Usar cartAPI
      await fetchCart(); // Recargar carrito después de actualizar
      toast.success('Cantidad actualizada');
    } catch (error) {
      console.error('Error actualizando cantidad:', error);
      
      if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`);
      } else if (error.response?.status === 400) {
        toast.error('Stock insuficiente');
      } else {
        toast.error('Error al actualizar la cantidad');
      }
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartAPI.remove(productId); // ✅ Usar cartAPI
      await fetchCart(); // Recargar carrito después de eliminar
      toast.success('Producto eliminado del carrito');
    } catch (error) {
      console.error('Error eliminando producto:', error);
      toast.error('Error al eliminar el producto');
    }
  };

  const handleClearCart = async () => {
    try {
      await cartAPI.clear(); // ✅ Usar cartAPI
      setCart({ items: [], total: 0 });
      setOpenConfirm(false);
      toast.success('Carrito vaciado');
    } catch (error) {
      console.error('Error vaciando carrito:', error);
      toast.error('Error al vaciar el carrito');
    }
  };

  const handleCheckout = async () => {
    if (!cart.items || cart.items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    // Verificar stock antes de proceder
    const outOfStockItems = cart.items.filter(item => 
      item.quantity > (item.product?.stock || 0)
    );

    if (outOfStockItems.length > 0) {
      toast.error('Algunos productos no tienen suficiente stock');
      return;
    }

    try {
      // Crear la venta usando el endpoint de sales
      await salesAPI.create({}); // El backend ya toma los items del carrito
      
      // El backend automáticamente vacía el carrito después de crear la venta
      setCart({ items: [], total: 0 });
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
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Debes iniciar sesión para ver tu carrito
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </Button>
          </div>
        </Paper>
      </Container>
    );
  }

  const total = cart.total || cart.items?.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  ) || 0;

  return (
    <Container maxWidth="md" className="cart-container">
      <Paper className="cart-paper" elevation={0}>
        <Typography variant="h4" className="cart-title">
          Carrito de Compras
        </Typography>

        {!cart.items || cart.items.length === 0 ? (
          <div className="cart-empty">
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Tu carrito está vacío
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              ¡Explora nuestros productos y agrega algunos items!
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/products')}
            >
              Ver Productos
            </Button>
          </div>
        ) : (
          <>
            <List className="cart-list">
              {cart.items.map((item) => (
                <ListItem key={item.productId?._id || item._id} className="cart-item">
                  <Avatar
                    src={item.image || item.productId?.image}
                    alt={item.name || item.productId?.name}
                    className="cart-avatar"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.jpg';
                    }}
                  />
                  <ListItemText
                    primary={item.name || item.productId?.name}
                    secondary={
                      <>
                        <div>${item.price || item.productId?.price}</div>
                        <div className="cart-item-subtotal">
                          Subtotal: ${((item.price || item.productId?.price) * item.quantity).toFixed(2)}
                        </div>
                        {item.productId?.stock !== undefined && (
                          <div className={`stock-info ${item.productId.stock < item.quantity ? 'low-stock' : ''}`}>
                            Stock disponible: {item.productId.stock}
                          </div>
                        )}
                      </>
                    }
                    className="cart-item-text"
                  />
                  <ListItemSecondaryAction>
                    <Box className="cart-quantity-box">
                      <IconButton 
                        onClick={() => handleUpdateQuantity(
                          item.productId?._id || item.productId, 
                          item.quantity - 1
                        )} 
                        className="icon-white"
                        size="small"
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          if (newQuantity >= 1) {
                            handleUpdateQuantity(
                              item.productId?._id || item.productId, 
                              newQuantity
                            );
                          }
                        }}
                        className="cart-quantity-input"
                        min="1"
                      />
                      <IconButton 
                        onClick={() => handleUpdateQuantity(
                          item.productId?._id || item.productId, 
                          item.quantity + 1
                        )} 
                        className="icon-white"
                        size="small"
                        disabled={item.productId?.stock <= item.quantity}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleRemoveItem(
                          item.productId?._id || item.productId
                        )} 
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
                  color="error"
                >
                  Vaciar Carrito
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="cart-checkout-button"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={cart.items.length === 0}
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
            color="error"
          >
            Vaciar Carrito
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;