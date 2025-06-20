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
    <Container maxWidth="lg" sx={{ mt: 4, backgroundColor: '#fafafa', padding: 4, borderRadius: 3, minHeight: '100vh' }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontFamily: 'Bebas Neue, Arial, sans-serif',
          color: '#0d47a1',
          letterSpacing: 2,
          mb: 2,
          textShadow: '0 2px 8px rgba(13,71,161,0.08)'
        }}
      >
        Productos Recientes
      </Typography>
      <Typography align="center" sx={{ color: '#555', mb: 4, fontSize: 18 }}>
        Descubre nuestra variedad de productos y filtra por categoría para encontrar lo que necesitas.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'contained' : 'outlined'}
            color={selectedCategory === cat ? 'primary' : 'inherit'}
            startIcon={<LocalOfferIcon />}
            onClick={() => setSelectedCategory(cat)}
            sx={{
              fontFamily: 'Bebas Neue, Arial, sans-serif',
              fontSize: 18,
              borderRadius: 3,
              px: 3,
              boxShadow: selectedCategory === cat ? '0 2px 8px rgba(13,71,161,0.10)' : 'none',
              background: selectedCategory === cat ? 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)' : '#fff',
              color: selectedCategory === cat ? '#fff' : '#1976d2',
              borderColor: '#1976d2',
              mb: 1,
              transition: '0.2s',
              '&:hover': {
                background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
                color: '#fff',
                borderColor: '#1976d2',
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
          sx={{
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
          }}
        />
      </Box>
      <Grid container spacing={4}>
        {filteredProducts.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" color="text.secondary" sx={{ mt: 6, fontSize: 22 }}>
              No se encontraron productos para esta categoría o búsqueda.
            </Typography>
          </Grid>
        ) : (
          filteredProducts.map((product, index) => (
            <Grow in timeout={500 + index * 100} key={product._id}>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    borderRadius: 5,
                    boxShadow: '0 6px 24px rgba(13,71,161,0.10)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    background: 'linear-gradient(135deg, #fff 70%, #e3f2fd 100%)',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow: '0 12px 32px rgba(25,118,210,0.18)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', width: '100%', height: 260, background: '#f0f4fa', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}>
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
                        background: '#e53935',
                        color: '#fff',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        fontSize: 14,
                        boxShadow: '0 2px 8px rgba(229,57,53,0.12)'
                      }}>
                        Sin stock
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ padding: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontFamily: 'Bebas Neue, Arial, sans-serif', color: '#1976d2', fontSize: 28 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: 48 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1, fontWeight: 700, fontSize: 22 }}>
                      ${product.price}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                      Categoría: {product.category}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        fontSize: 18,
                        py: 1.2,
                        background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
                        boxShadow: '0 2px 8px rgba(25,118,210,0.10)',
                        transition: '0.3s ease',
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
