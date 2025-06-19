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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();

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
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, backgroundColor: '#fafafa', padding: 4, borderRadius: 3 }}>
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
        {filteredProducts.map((product, index) => (
          <Grow in timeout={500 + index * 100} key={product._id}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{
                    height: 240,
                    objectFit: 'contain',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    padding: 2,
                    backgroundColor: '#f0f0f0',
                  }}
                />
                <CardContent sx={{ padding: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ${product.price}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Stock: {product.stock}
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
        ))}
      </Grid>
    </Container>
  );
};

export default Products;
