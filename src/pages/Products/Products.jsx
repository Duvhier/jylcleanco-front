// src/pages/Products/Products.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { productsAPI, cartAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './Products.css';
import { FiGrid } from 'react-icons/fi';
import { GiSoap, GiCandleFlame, GiDrop } from 'react-icons/gi';
import { MdAir, MdFace } from 'react-icons/md';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [availability, setAvailability] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bestSellers, setBestSellers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  const checkConnection = async () => {
    try {
      // Usar el endpoint de health del backend
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
    
    // Filtro por categoría
    if (selectedCategory !== 'Todas' && product.category !== selectedCategory) return false;
    
    // Filtro por búsqueda
    const searchLower = searchTerm.toLowerCase();
    if (searchTerm && 
        !product.name?.toLowerCase().includes(searchLower) &&
        !product.description?.toLowerCase().includes(searchLower)) return false;
    
    // Filtro por disponibilidad
    if (availability === 'available' && product.stock <= 0) return false;
    if (availability === 'unavailable' && product.stock > 0) return false;
    
    // Filtro por precio
    if (minPrice && Number(product.price) < Number(minPrice)) return false;
    if (maxPrice && Number(product.price) > Number(maxPrice)) return false;
    
    // Filtro por más vendidos (si existe la propiedad)
    if (bestSellers && !(product.sold && product.sold > 10)) return false;
    
    return true;
  });

  // Obtener categorías únicas
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

  const getConnectionStatusMessage = () => {
    const statusMessages = {
      checking: { text: '🔄 Verificando conexión...', className: 'status-checking' },
      connected: { text: '✅ Conectado al servidor', className: 'status-connected' },
      error: { text: '❌ Error de conexión', className: 'status-error' },
      network_error: { text: '🌐 Error de red - Verifica que el backend esté ejecutándose', className: 'status-error' },
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
        <h1 className="products-title">Nuestros Productos</h1>
        <p className="products-subtitle">
          Descubre nuestra variedad de productos de limpieza y cuidado del hogar
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
              min="0"
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
              min="0"
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
        <h3 className="category-title">Categorías</h3>
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
              No podemos cargar los productos en este momento. Verifica que el backend esté ejecutándose en el puerto 5000.
            </p>
            <div className="error-actions">
              <button 
                onClick={fetchProducts}
                className="retry-button"
              >
                🔄 Reintentar
              </button>
              <button 
                onClick={checkConnection}
                className="retry-button secondary"
              >
                🔍 Verificar conexión
              </button>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No se encontraron productos</h3>
            <p className="empty-state-message">
              {products.length === 0 
                ? 'No hay productos disponibles en este momento.' 
                : 'Intenta ajustar los filtros o términos de búsqueda.'
              }
            </p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div className="product-card" key={product._id || product.id}>
              <div className="product-image-container">
                <img 
                  src={product.image || '/images/placeholder-product.jpg'} 
                  alt={product.name} 
                  className="product-image" 
                  onError={(e) => {
                    e.target.src = '/images/placeholder-product.jpg';
                  }}
                />
                {product.stock <= 0 && (
                  <div className="out-of-stock-badge">Agotado</div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">
                  {product.description || 'Descripción no disponible'}
                </p>
                <div className="product-details">
                  <div className="product-price">${product.price}</div>
                  <div className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                  </div>
                  {product.category && (
                    <div className="product-category">
                      Categoría: {product.category}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => handleAddToCart(product._id || product.id)}
                  className={`add-to-cart-button ${product.stock <= 0 ? 'disabled' : ''}`}
                  disabled={product.stock <= 0 || !isAuthenticated}
                >
                  {!isAuthenticated 
                    ? 'Inicia sesión para comprar' 
                    : product.stock > 0 
                      ? 'Agregar al carrito' 
                      : 'Agotado'
                  }
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Información de debug (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <details>
            <summary>Información de Debug</summary>
            <p>Productos cargados: {products.length}</p>
            <p>Productos filtrados: {filteredProducts.length}</p>
            <p>Usuario autenticado: {isAuthenticated ? 'Sí' : 'No'}</p>
            <p>Estado conexión: {connectionStatus}</p>
          </details>
        </div>
      )}
    </div>
  );
};

export default Products;