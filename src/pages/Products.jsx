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
  Grow,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CategoryIcon from '@mui/icons-material/Category';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { motion } from 'framer-motion';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [availability, setAvailability] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bestSellers, setBestSellers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMsg, setModalMsg] = useState({ open: false, message: '', type: 'info' });
  const [openConfirm, setOpenConfirm] = useState(false);

  const categories = ['Todas', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      setModalMsg({ open: true, message: 'Debes iniciar sesión para agregar productos al carrito', type: 'error' });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalMsg({ open: true, message: 'Producto agregado al carrito', type: 'success' });
    } catch (error) {
      setModalMsg({ open: true, message: error.response?.data?.message || 'Error al agregar al carrito', type: 'error' });
    }
  };

  // Filtros dinámicos
  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'Todas' && product.category !== selectedCategory) return false;
    if (
      !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !product.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) return false;
    if (availability === 'available' && product.stock <= 0) return false;
    if (availability === 'unavailable' && product.stock > 0) return false;
    if (minPrice && Number(product.price) < Number(minPrice)) return false;
    if (maxPrice && Number(product.price) > Number(maxPrice)) return false;
    if (bestSellers && !(product.sold && product.sold > 10)) return false;
    return true;
  });

  // Skeletons para loading
  const skeletonArray = Array.from({ length: 8 });

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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, justifyContent: 'center' }}>
        {/* Filtro de disponibilidad */}
        <FormControl size="small" sx={{ minWidth: 140, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
          <InputLabel sx={{ color: '#fff' }}>Disponibilidad</InputLabel>
          <Select
            value={availability}
            label="Disponibilidad"
            onChange={e => setAvailability(e.target.value)}
            sx={{ color: '#fff', '& .MuiSvgIcon-root': { color: '#fff' } }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="available">Disponibles</MenuItem>
            <MenuItem value="unavailable">Agotados</MenuItem>
          </Select>
        </FormControl>
        {/* Filtro de precio mínimo */}
        <TextField
          size="small"
          label="Precio mínimo"
          type="number"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          sx={{ width: 120, background: 'rgba(255,255,255,0.08)', borderRadius: 2, input: { color: '#fff' } }}
          InputLabelProps={{ style: { color: '#fff' } }}
        />
        {/* Filtro de precio máximo */}
        <TextField
          size="small"
          label="Precio máximo"
          type="number"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          sx={{ width: 120, background: 'rgba(255,255,255,0.08)', borderRadius: 2, input: { color: '#fff' } }}
          InputLabelProps={{ style: { color: '#fff' } }}
        />
        {/* Filtro de más vendidos */}
        <FormControlLabel
          control={
            <Checkbox
              checked={bestSellers}
              onChange={e => setBestSellers(e.target.checked)}
              sx={{ color: '#fff' }}
            />
          }
          label={<span style={{ color: '#fff' }}>Más vendidos</span>}
        />
      </Box>
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
        {loading ? (
          skeletonArray.map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
              <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.08)' }} />
              <Skeleton height={40} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
              <Skeleton height={30} width="60%" sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
              <Skeleton height={30} width="40%" sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
            </Grid>
          ))
        ) : filteredProducts.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" sx={{ mt: 6, fontSize: 22, color: '#fff', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
              No se encontraron productos para esta categoría o búsqueda.
            </Typography>
          </Grid>
        ) : (
          filteredProducts.map((product, index) => (
            <Grow in timeout={500 + index * 100} key={product._id}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
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
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      boxShadow: 'inset 0 0 8px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.1)',
                      '&:hover img': {
                        transform: 'scale(1.05)',
                      }
                    }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography 
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            fontSize: 22,
                            color: '#fff',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                          }}
                        >
                          ${product.price}
                        </Typography>
                        <Button
                          variant="contained"
                          disabled={product.stock === 0}
                          onClick={() => handleAddToCart(product._id)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: 14,
                            px: 2,
                            background: product.stock === 0 ? '#aaa' : '#fff',
                            color: product.stock === 0 ? '#666' : '#333',
                            '&:hover': {
                              background: product.stock === 0 ? '#aaa' : '#f1f1f1',
                            }
                          }}
                        >
                          {product.stock === 0 ? 'Agotado' : 'Agregar'}
                        </Button>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 2, color: '#fff', borderColor: 'rgba(255,255,255,0.5)', fontWeight: 600 }}
                        onClick={() => { setSelectedProduct(product); setOpenModal(true); }}
                      >
                        Ver más
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grow>
          ))
        )}
      </Grid>
      {/* Modal de detalles */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 }
      }}>
        {selectedProduct && (
          <>
            <DialogTitle sx={{ color: '#1976d2', fontWeight: 700 }}>{selectedProduct.name}</DialogTitle>
            <DialogContent dividers sx={{ background: 'rgba(255,255,255,0.07)' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', maxWidth: 320, borderRadius: 16, marginBottom: 16 }} />
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedProduct.description}</Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center', color: '#1976d2', mb: 1 }}>
                  <MonetizationOnIcon sx={{ fontSize: 20, mr: 1 }} />
                  <b>${selectedProduct.price}</b>
                </Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center', color: '#1976d2', mb: 1 }}>
                  <CategoryIcon sx={{ fontSize: 20, mr: 1 }} />
                  {selectedProduct.category}
                </Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center', color: '#1976d2', mb: 1 }}>
                  <Inventory2Icon sx={{ fontSize: 20, mr: 1 }} />
                  {selectedProduct.stock} disponibles
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)} color="primary" variant="outlined">Cerrar</Button>
            </DialogActions>
          </>
        )}
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

export default Products;
