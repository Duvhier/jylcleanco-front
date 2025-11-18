import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Edit, Delete, Add, Visibility, Inventory } from '@mui/icons-material';
import { productsAPI } from '../../services/api'; // ✅ Usar API específica
import { useAuth } from '../../contexts/AuthContext'; // ✅ Para verificar permisos
import './ManageProducts.css';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const navigate = useNavigate();
  const { user, isAdmin, isSuperUser } = useAuth(); // ✅ Verificar permisos

  // ✅ Verificar permisos - Solo Admin y SuperUser pueden gestionar productos
  if (!isAdmin && !isSuperUser) {
    return (
      <div className="manage-products-container">
        <div className="access-denied">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para gestionar productos.</p>
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            Volver al Inicio
          </button>
        </div>
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
    // Navegar a la vista de detalles del producto (si existe)
    // o mostrar información en un modal
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
        fetchProducts(); // Recargar la lista
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al eliminar el producto');
      }
    }
  };

  const getConnectionStatusMessage = () => {
    const statusMessages = {
      checking: { text: '🔄 Cargando productos...', className: 'status-checking' },
      connected: { text: `✅ ${products.length} productos cargados`, className: 'status-connected' },
      network_error: { text: '🌐 Error de conexión', className: 'status-error' },
      auth_error: { text: '🔐 Error de autenticación', className: 'status-error' },
      access_denied: { text: '🚫 Acceso denegado', className: 'status-warning' },
      error: { text: '❌ Error al cargar productos', className: 'status-error' },
    };
    
    return statusMessages[connectionStatus] || statusMessages.error;
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
          <span className="loading-spinner"></span>
          Cargando productos...
        </div>
      </div>
    );
  }

  const statusInfo = getConnectionStatusMessage();

  return (
    <div className="manage-products-container">
      {/* Header */}
      <div className="manage-products-header">
        <div className="header-content">
          <h1 className="page-title">Gestionar Productos</h1>
          <p className="page-subtitle">
            Administra el inventario de productos de J&L Clean Co.
          </p>
          
          {/* ✅ Información del usuario */}
          <div className="user-info">
            <span>Usuario: {user?.name} ({user?.role})</span>
          </div>
        </div>
        
        <button 
          className="add-product-btn primary"
          onClick={() => navigate('/admin/add-product')}
        >
          <Add className="btn-icon" />
          Agregar Producto
        </button>
      </div>

      {/* Connection Status */}
      <div className={`connection-status ${statusInfo.className}`}>
        <span className="status-indicator"></span>
        {statusInfo.text}
      </div>

      {(connectionStatus === 'error' || connectionStatus === 'network_error') && (
        <button 
          onClick={fetchProducts}
          className="retry-button"
        >
          🔄 Reintentar conexión
        </button>
      )}

      {/* Products Table */}
      {connectionStatus === 'connected' && products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Inventory />
          </div>
          <h3 className="empty-title">No hay productos registrados</h3>
          <p className="empty-description">
            Comienza agregando tu primer producto al catálogo.
          </p>
          <button 
            className="add-product-btn primary"
            onClick={() => navigate('/admin/add-product')}
          >
            <Add className="btn-icon" />
            Agregar Primer Producto
          </button>
        </div>
      ) : connectionStatus === 'connected' ? (
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th className="image-column">Imagen</th>
                <th className="name-column">Nombre</th>
                <th className="category-column">Categoría</th>
                <th className="price-column">Precio</th>
                <th className="stock-column">Stock</th>
                <th className="status-column">Estado</th>
                <th className="actions-column">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="product-row">
                  <td className="image-cell">
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
                          <Inventory />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="name-cell">
                    <div className="product-name">{product.name}</div>
                    {product.description && (
                      <div className="product-description">
                        {product.description.length > 50 
                          ? `${product.description.substring(0, 50)}...` 
                          : product.description
                        }
                      </div>
                    )}
                  </td>
                  <td className="category-cell">
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td className="price-cell">
                    <span className="price">${Number(product.price).toFixed(2)}</span>
                  </td>
                  <td className="stock-cell">
                    <span className={`stock-badge ${getStockStatus(product.stock)}`}>
                      {getStockText(product.stock)}
                    </span>
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge ${product.isActive !== false ? 'active' : 'inactive'}`}>
                      {product.isActive !== false ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="action-btn view-btn"
                        onClick={() => handleView(product._id)}
                        title="Ver detalles"
                      >
                        <Visibility />
                      </button>
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(product._id)}
                        title="Editar producto"
                      >
                        <Edit />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(product._id)}
                        title="Eliminar producto"
                      >
                        <Delete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="error-state">
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
            className="retry-button primary"
          >
            🔄 Reintentar
          </button>
        </div>
      )}

      {/* Debug Info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <details>
            <summary>Información de Debug</summary>
            <p><strong>Total productos:</strong> {products.length}</p>
            <p><strong>Estado conexión:</strong> {connectionStatus}</p>
            <p><strong>Usuario:</strong> {user?.name} ({user?.role})</p>
            <p><strong>Permisos:</strong> Admin: {isAdmin ? 'Sí' : 'No'}, SuperUser: {isSuperUser ? 'Sí' : 'No'}</p>
          </details>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;