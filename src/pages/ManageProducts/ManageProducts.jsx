import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEdit2, 
  FiTrash2, 
  FiPlus, 
  FiEye, 
  FiPackage,
  FiAlertCircle,
  FiRefreshCw
} from 'react-icons/fi';
import { productsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './ManageProducts.css';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const navigate = useNavigate();
  const { user, isAdmin, isSuperUser } = useAuth();

  // Verificar permisos
  if (!isAdmin && !isSuperUser) {
    return (
      <div className="manage-products-container">
        <motion.div 
          className="access-denied glass-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FiAlertCircle className="denied-icon" />
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para gestionar productos.</p>
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            Volver al Inicio
          </button>
        </motion.div>
      </div>
    );
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setConnectionStatus('checking');
    
    try {
      const response = await productsAPI.getAll();
      
      if (response.data.success) {
        setProducts(response.data.data || []);
        setConnectionStatus('connected');
      } else {
        setProducts([]);
        setConnectionStatus('error');
        toast.error('Error al cargar los productos');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        setConnectionStatus('network_error');
        toast.error('Error de conexión. Verifica que el backend esté ejecutándose.');
      } else if (error.response?.status === 401) {
        setConnectionStatus('auth_error');
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        setConnectionStatus('access_denied');
        toast.error('No tienes permisos para gestionar productos.');
      } else {
        setConnectionStatus('error');
        toast.error('Error al cargar los productos');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  const handleView = (productId) => {
    toast.info(`Ver detalles del producto ${productId}`);
  };

  const handleDelete = async (productId) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    if (!window.confirm(`¿Estás seguro de eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await productsAPI.delete(productId);
      
      toast.success('✅ Producto eliminado exitosamente');
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      
      if (error.response?.status === 401) {
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('No tienes permisos para eliminar productos.');
      } else if (error.response?.status === 404) {
        toast.error('Producto no encontrado.');
        fetchProducts();
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al eliminar el producto');
      }
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return 'out-of-stock';
    if (stock < 10) return 'low-stock';
    return 'in-stock';
  };

  const getStockText = (stock) => {
    if (stock === 0) return 'Agotado';
    if (stock < 10) return `Bajo (${stock})`;
    return stock.toString();
  };

  if (loading) {
    return (
      <div className="manage-products-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-products-container">
      {/* Header */}
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-content">
          <h1 className="page-title">Gestionar Productos</h1>
          <p className="page-subtitle">
            Administra el inventario de productos de J&L Clean Co.
          </p>
          
          <div className="user-info">
            <span>Usuario: {user?.name} ({user?.role})</span>
          </div>
        </div>
        
        <motion.button 
          className="add-product-btn"
          onClick={() => navigate('/admin/add-product')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiPlus />
          Agregar Producto
        </motion.button>
      </motion.div>

      {/* Connection Status */}
      <motion.div 
        className={`connection-status ${connectionStatus}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="status-indicator"></span>
        {connectionStatus === 'connected' && `✅ ${products.length} productos cargados`}
        {connectionStatus === 'checking' && '🔄 Cargando productos...'}
        {connectionStatus === 'network_error' && '🌐 Error de conexión'}
        {connectionStatus === 'error' && '❌ Error al cargar productos'}
      </motion.div>

      {(connectionStatus === 'error' || connectionStatus === 'network_error') && (
        <motion.button 
          onClick={fetchProducts}
          className="retry-button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          <FiRefreshCw /> Reintentar conexión
        </motion.button>
      )}

      {/* Products Grid/List */}
      {connectionStatus === 'connected' && products.length === 0 ? (
        <motion.div 
          className="empty-state glass-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="empty-icon">
            <FiPackage />
          </div>
          <h3 className="empty-title">No hay productos registrados</h3>
          <p className="empty-description">
            Comienza agregando tu primer producto al catálogo.
          </p>
          <button 
            className="add-product-btn"
            onClick={() => navigate('/admin/add-product')}
          >
            <FiPlus />
            Agregar Primer Producto
          </button>
        </motion.div>
      ) : connectionStatus === 'connected' ? (
        <div className="products-grid">
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div 
                key={product._id}
                className="product-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="product-image-container">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="product-img"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-product.jpg';
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder">
                      <FiPackage />
                    </div>
                  )}
                  <span className={`status-badge ${product.isActive !== false ? 'active' : 'inactive'}`}>
                    {product.isActive !== false ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  {product.description && (
                    <p className="product-description">
                      {product.description.length > 80 
                        ? `${product.description.substring(0, 80)}...` 
                        : product.description
                      }
                    </p>
                  )}
                  
                  <div className="product-meta">
                    <span className="category-badge">{product.category}</span>
                    <span className="price">${Number(product.price).toFixed(2)}</span>
                  </div>

                  <div className="product-footer">
                    <span className={`stock-badge ${getStockStatus(product.stock)}`}>
                      {getStockText(product.stock)}
                    </span>
                    
                    <div className="action-buttons">
                      <motion.button 
                        className="action-btn view-btn"
                        onClick={() => handleView(product._id)}
                        title="Ver detalles"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiEye />
                      </motion.button>
                      <motion.button 
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(product._id)}
                        title="Editar producto"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiEdit2 />
                      </motion.button>
                      <motion.button 
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(product._id)}
                        title="Eliminar producto"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiTrash2 />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          className="error-state glass-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="error-icon">❌</div>
          <h3 className="error-title">No se pudieron cargar los productos</h3>
          <p className="error-description">
            {connectionStatus === 'network_error' 
              ? 'Verifica que el backend esté ejecutándose correctamente.'
              : 'Ha ocurrido un error al cargar los productos.'
            }
          </p>
          <button 
            onClick={fetchProducts}
            className="retry-button"
          >
            <FiRefreshCw /> Reintentar
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ManageProducts;