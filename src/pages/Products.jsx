import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Grow
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Error al cargar los productos');
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Producto agregado al carrito');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al agregar al carrito');
    }
  };

  const filteredProducts = products.filter(product =>
    (selectedCategory === 'Todas' || product.category === selectedCategory) &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: 4, 
        padding: 4, 
        borderRadius: 3, 
        minHeight: '100vh',
        background: 'transparent'
      }}
    >
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontFamily: 'Bebas Neue, Arial, sans-serif',
          color: '#fff',
          letterSpacing: 2,
          mb: 2,
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}
      >
        Productos Recientes
      </Typography>
      <Typography align="center" sx={{ color: '#fff', mb: 4, fontSize: 18, textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
        Descubre nuestra variedad de productos y filtra por categoría para encontrar lo que necesitas.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'contained' : 'outlined'}
            startIcon={<LocalOfferIcon />}
            onClick={() => setSelectedCategory(cat)}
            sx={{
              fontFamily: 'Bebas Neue, Arial, sans-serif',
              fontSize: 18,
              borderRadius: 3,
              px: 3,
              background: selectedCategory === cat 
                ? 'rgba(255, 255, 255, 0.3)' 
                : 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              mb: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              },
            }}
          >
            {cat}
          </Button>
        ))}
      </Box>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Buscar productos"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
      </Box>
      <Grid container spacing={4}>
        {filteredProducts.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" sx={{ mt: 6, fontSize: 22, color: '#fff', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
              No se encontraron productos para esta categoría o búsqueda.
            </Typography>
          </Grid>
        ) : (
          filteredProducts.map((product, index) => (
            <Grow in timeout={500 + index * 100} key={product._id}>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  className="glass-card"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: 5,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                  }}
                >
                  <Box sx={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: 260, 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    borderTopLeftRadius: 20, 
                    borderTopRightRadius: 20, 
                    overflow: 'hidden' 
                  }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s',
                      }}
                    />
                    {product.stock === 0 && (
                      <Box sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: 'rgba(229, 57, 53, 0.9)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        color: '#fff',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        fontSize: 14,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                      }}>
                        Sin stock
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ padding: 3 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      gutterBottom 
                      sx={{ 
                        fontFamily: 'Bebas Neue, Arial, sans-serif', 
                        color: '#fff', 
                        fontSize: 28,
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1, 
                        minHeight: 48, 
                        color: '#fff',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mt: 1, 
                        fontWeight: 700, 
                        fontSize: 22,
                        color: '#fff',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      ${product.price}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      display="block" 
                      sx={{ 
                        mb: 2,
                        color: 'rgba(255, 255, 255, 0.8)',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      Categoría: {product.category}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      className="glass-button"
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        fontSize: 18,
                        py: 1.2,
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: '#fff',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.3)',
                          borderColor: 'rgba(255, 255, 255, 0.4)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                        },
                        '&:disabled': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.5)',
                        }
                      }}
                      onClick={() => handleAddToCart(product._id)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grow>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Products;
