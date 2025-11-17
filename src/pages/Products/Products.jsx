// src/pages/Products/Products.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './Products.css';
import { FiGrid } from 'react-icons/fi';
import { GiSoap, GiCandleFlame, GiDrop } from 'react-icons/gi';
import { MdAir, MdFace } from 'react-icons/md';

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

  

// CORREGIR ESTAS RUTAS:
// En tu Products.js - CORREGIR LAS LLAMADAS API
const checkConnection = async () => {
  try {
    await api.get('/health');
    setConnectionStatus('connected');
  } catch (error) {
    setConnectionStatus('error');
    console.error('Error de conexión:', error.message);
  }
};

const fetchProducts = async () => {
  try {
    // ✅ AHORA USA /api/products
    const response = await api.get('/products'); 
    setProducts(response.data);
    setConnectionStatus('connected');
  } catch (error) {
    console.error('Error fetching products:', error);
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      setConnectionStatus('network_error');
    } else if (error.response.status === 404) {
      setConnectionStatus('endpoint_error');
    } else {
      setConnectionStatus('error');
    }
  } finally {
    setLoading(false);
  }
};

const handleAddToCart = async (productId) => {
  try {
    // ✅ AHORA USA /api/cart/add
    await api.post('/cart/add', { 
      productId,
      quantity: 1,
    });
    toast.success('✅ Producto agregado al carrito');
  } catch (error) {
    console.error('Error agregando al carrito:', error);
    // ... manejo de errores
  }
};
  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'Todas' && product.category !== selectedCategory) return false;
    if (!product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (availability === 'available' && product.stock <= 0) return false;
    if (availability === 'unavailable' && product.stock > 0) return false;
    if (minPrice && Number(product.price) < Number(minPrice)) return false;
    if (maxPrice && Number(product.price) > Number(maxPrice)) return false;
    if (bestSellers && !(product.sold && product.sold > 10)) return false;
    return true;
  });

  const categories = ['Todas', ...new Set(products
    .map(p => p?.category) // Usar optional chaining
    .filter(category => category != null && category !== '') // Filtrar null, undefined y strings vacíos
  )];

  const getCategoryIcon = (category) => {
    const normalized = (category || '').toLowerCase();
    if (normalized === 'todas') return <FiGrid />;
    if (normalized === 'cremas') return <MdFace />;
    if (normalized === 'aceites') return <GiDrop />;
    if (normalized === 'ambientadores') return <MdAir />;
    if (normalized === 'jabones') return <GiSoap />;
    if (normalized === 'velas') return <GiCandleFlame />;
    return <FiGrid />;
  };

  const getConnectionStatusMessage = () => {
    const statusMessages = {
      checking: { text: '🔄 Verificando conexión...', className: 'status-checking' },
      connected: { text: '✅ Conectado al servidor', className: 'status-connected' },
      error: { text: '❌ Error de conexión', className: 'status-error' },
      network_error: { text: '🌐 Error de red', className: 'status-error' },
      endpoint_error: { text: '🔌 Endpoint no encontrado', className: 'status-error' },
    };
    
    return statusMessages[connectionStatus] || statusMessages.error;
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading-state">
          <span className="loading-spinner"></span>
          Cargando productos...
        </div>
      </div>
    );
  }

  const statusInfo = getConnectionStatusMessage();

  return (
    <div className="products-container">
      {/* Header con estado de conexión */}
      <div className="products-header">
        <h1 className="products-title">Productos Recientes</h1>
        <p className="products-subtitle">
          Descubre nuestra variedad de productos y filtra por categoría para encontrar exactamente lo que necesitas.
        </p>
        
        <div className={`connection-status ${statusInfo.className}`}>
          <span className="status-indicator"></span>
          {statusInfo.text}
        </div>

        {(connectionStatus === 'error' || connectionStatus === 'network_error') && (
          <button 
            onClick={fetchProducts}
            className="reconnect-button"
          >
            🔄 Reintentar conexión
          </button>
        )}
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <h2 className="filters-title">Filtros de Búsqueda</h2>
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Disponibilidad</label>
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

          <div className="filter-group">
            <label className="filter-label">Precio mínimo</label>
            <input 
              type="number" 
              placeholder="0" 
              value={minPrice} 
              onChange={e => setMinPrice(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Precio máximo</label>
            <input 
              type="number" 
              placeholder="1000" 
              value={maxPrice} 
              onChange={e => setMaxPrice(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-checkbox">
              <input 
                type="checkbox" 
                checked={bestSellers} 
                onChange={e => setBestSellers(e.target.checked)}
              />
              Más vendidos
            </label>
          </div>
        </div>
      </div>

      {/* Category Buttons */}
      <div className="category-section">
        <div className="category-buttons">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)} 
              className={`category-button ${selectedCategory === cat ? 'active' : ''}`}
            >
              <span className="category-icon">{getCategoryIcon(cat)}</span>
              <span className="category-text">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <input 
          type="text" 
          placeholder="Buscar productos por nombre o descripción..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="search-input"
        />
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {connectionStatus !== 'connected' ? (
          <div className="connection-error-state">
            <div className="error-icon">🔌</div>
            <h3 className="error-title">Problema de conexión</h3>
            <p className="error-message">
              No podemos cargar los productos en este momento.
            </p>
            <button 
              onClick={fetchProducts}
              className="retry-button"
            >
              🔄 Reintentar
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No se encontraron productos</h3>
            <p className="empty-state-message">
              Intenta ajustar los filtros o términos de búsqueda.
            </p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div className="product-card" key={product._id}>
              <img 
                src={product.image || product.imageUrl} 
                alt={product.name} 
                className="product-image" 
                onError={(e) => {
                  e.target.src = '/images/placeholder-product.jpg';
                }}
              />
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">${product.price}</div>
                <div className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? `Stock: ${product.stock} unidades` : 'Agotado'}
                </div>
                <button 
                  onClick={() => handleAddToCart(product._id)}
                  className="add-to-cart-button"
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;