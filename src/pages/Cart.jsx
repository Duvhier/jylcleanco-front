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
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

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
      toast.success('Carrito vaciado');
    } catch (error) {
      toast.error('Error al vaciar el carrito');
    }
  };

  const handleCheckout = async () => {
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
    return <Typography>Cargando...</Typography>;
  }

  const total = cart.products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper
        elevation={4}
        sx={{
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#fff', textShadow: '1px 1px 2px #000' }}>
          Carrito de Compras
        </Typography>

        {cart.products.length === 0 ? (
          <Typography sx={{ color: '#fff' }}>Tu carrito está vacío</Typography>
        ) : (
          <>
            <List>
              {cart.products.map((item) => (
                <ListItem key={item.product._id} sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 1, borderRadius: 2 }}>
                  <Avatar
                    src={item.product.image || item.product.imageUrl}
                    alt={item.product.name}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <ListItemText
                    primary={item.product.name}
                    secondary={`$${item.product.price} x ${item.quantity}`}
                    sx={{ color: '#fff' }}
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                        sx={{ color: '#fff' }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.product._id, parseInt(e.target.value))}
                        type="number"
                        size="small"
                        sx={{
                          width: '60px',
                          mx: 1,
                          input: { color: '#fff', textAlign: 'center' },
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                        }}
                      />
                      <IconButton
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                        sx={{ color: '#fff' }}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveItem(item.product._id)}
                        sx={{ color: '#ff5555' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>
                Total: ${total.toFixed(2)}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearCart}
              >
                Vaciar Carrito
              </Button>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCheckout}
            >
              Realizar Compra
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Cart;
