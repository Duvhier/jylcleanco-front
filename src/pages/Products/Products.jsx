// src/pages/Products/Products.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { productsAPI, cartAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './Products.css';
import { FiGrid, FiSearch, FiFilter, FiShoppingCart } from 'react-icons/fi';
import { GiSoap, GiCandleFlame, GiDrop } from 'react-icons/gi';
import { MdAir, MdFace } from 'react-icons/md';
import { CircularProgress, Box } from '@mui/material';

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
  const [connectionStatus, setConnectionStatus] = useState('checking');

  const checkConnection = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://jylclean-backend.vercel.app';
      const response = await fetch(`${API_URL}/api/health`);
      if (response.ok) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
      console.error('Error de conexión:', error.message);
    }
  };
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      
      if (response.data.success) {
        setProducts(response.data.data || []);
        setConnectionStatus('connected');
      } else {
        setProducts([]);
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        setConnectionStatus('network_error');
      } else if (error.response?.status === 404) {
        setConnectionStatus('endpoint_error');
      } else {
        setConnectionStatus('error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    try {
      await cartAPI.add({ 
        productId,
        quantity: 1,
      });
      toast.success('✅ Producto agregado al carrito');
    } catch (error) {
      console.error('Error agregando al carrito:', error);
      
      if (error.response?.status === 401) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al agregar producto al carrito');
      }
    }
  };

  useEffect(() => {
    checkConnection();
    fetchProducts();
  }, []);

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    if (!product) return false;
    
    if (selectedCategory !== 'Todas' && product.category !== selectedCategory) return false;
    
    const searchLower = searchTerm.toLowerCase();
    if (searchTerm && 
        !product.name?.toLowerCase().includes(searchLower) &&
        !product.description?.toLowerCase().includes(searchLower)) return false;
    
    if (availability === 'available' && product.stock <= 0) return false;
    if (availability === 'unavailable' && product.stock > 0) return false;
    
    if (minPrice && Number(product.price) < Number(minPrice)) return false;
    if (maxPrice && Number(product.price) > Number(maxPrice)) return false;
    
    if (bestSellers && !(product.sold && product.sold > 10)) return false;
    
    return true;
  });

  const categories = ['Todas', ...new Set(products
    .map(p => p?.category)
    .filter(category => category != null && category !== '')
  )];

  const getCategoryIcon = (category) => {
    const normalized = (category || '').toLowerCase();
    if (normalized === 'todas') return <FiGrid />;
    if (normalized.includes('crema') || normalized.includes('cuidado')) return <MdFace />;
    if (normalized.includes('aceite') || normalized.includes('líquido')) return <GiDrop />;
    if (normalized.includes('ambientador') || normalized.includes('aroma')) return <MdAir />;
    if (normalized.includes('jabón') || normalized.includes('limpieza')) return <GiSoap />;
    if (normalized.includes('vela') || normalized.includes('aromática')) return <GiCandleFlame />;
    return <FiGrid />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)'
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: '#0f172a' }} />
      </Box>
    );
  }

  return (
    <div className="products-container">
      {/* Header */}
      <motion.div 
        className="products-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="products-title">Nuestros Productos</h1>
        <p className="products-subtitle">
          Descubre nuestra variedad de productos de limpieza y cuidado del hogar
        </p>
      </motion.div>

      {/* Filters & Search */}
      <motion.div 
        className="filters-wrapper glass-card-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <FiFilter className="filter-icon" />
            <select 
              value={availability} 
              onChange={(e) => setAvailability(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos</option>
              <option value="available">Disponibles</option>
              <option value="unavailable">Agotados</option>
            </select>
          </div>

          <div className="price-inputs">
            <input 
              type="number" 
              placeholder="Min $" 
              value={minPrice} 
              onChange={e => setMinPrice(e.target.value)}
              className="price-input"
              min="0"
            />
            <span className="price-separator">-</span>
            <input 
              type="number" 
              placeholder="Max $" 
              value={maxPrice} 
              onChange={e => setMaxPrice(e.target.value)}
              className="price-input"
              min="0"
            />
          </div>
        </div>

        <div className="category-scroll">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)} 
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
            >
              {getCategoryIcon(cat)}
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div 
        className="products-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="empty-icon">🔍</div>
              <h3>No se encontraron productos</h3>
              <p>Intenta ajustar tus filtros de búsqueda</p>
            </motion.div>
          ) : (
            filteredProducts.map(product => (
              <motion.div 
                key={product._id || product.id}
                className="product-card glass-card-hover"
                variants={itemVariants}
                layout
                whileHover={{ y: -8 }}
              >
                <div className="product-image-wrapper">
                  <img 
                    src={product.image || '/images/placeholder-product.jpg'} 
                    alt={product.name} 
                    className="product-image"
                    onError={(e) => { e.target.src = '/images/placeholder-product.jpg'; }}
                  />
                  {product.stock <= 0 && (
                    <div className="stock-badge out">Agotado</div>
                  )}
                </div>
                
                <div className="product-content">
                  <div className="product-header-row">
                    <h3 className="product-name">{product.name}</h3>
                    <span className="product-price">${product.price}</span>
                  </div>
                  
                  <p className="product-desc">
                    {product.description || 'Descripción no disponible'}
                  </p>
                  
                  <div className="product-footer">
                    <span className={`stock-status ${product.stock > 0 ? 'in' : 'out'}`}>
                      {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                    </span>
                    
                    <motion.button 
                      onClick={() => handleAddToCart(product._id || product.id)}
                      className="add-cart-btn"
                      disabled={product.stock <= 0 || !isAuthenticated}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiShoppingCart />
                      {product.stock > 0 ? 'Agregar' : 'Agotado'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Products;