import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ShoppingCart,
  People,
  Inventory,
  AttachMoney,
  Add,
  Edit,
  Delete,
  Visibility,
  TrendingUp,
  LocalShipping,
  Assessment
} from '@mui/icons-material';
import { productsAPI, usersAPI, salesAPI } from '../../services/api'; // ✅ Usar APIs específicas
import { useAuth } from '../../contexts/AuthContext'; // ✅ Para verificar permisos
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isSuperUser } = useAuth(); // ✅ Verificar permisos
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalSales: 0,
    totalRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // ✅ Verificar permisos - Solo Admin y SuperUser pueden acceder
  if (!isAdmin && !isSuperUser) {
    return (
      <div className="admin-container">
        <div className="access-denied">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder al panel de administración.</p>
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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setConnectionStatus('checking');

      // ✅ Obtener datos usando las APIs específicas
      const [productsResponse, usersResponse, salesResponse] = await Promise.allSettled([
        productsAPI.getAll(),
        isSuperUser ? usersAPI.getAll() : Promise.resolve({ data: { data: [] } }), // Solo SuperUser puede ver usuarios
        salesAPI.getAll()
      ]);

      // ✅ Procesar respuesta de productos
      let totalProducts = 0;
      if (productsResponse.status === 'fulfilled' && productsResponse.value.data.success) {
        totalProducts = productsResponse.value.data.data?.length || 0;
      }

      // ✅ Procesar respuesta de usuarios (solo para SuperUser)
      let totalUsers = 0;
      if (usersResponse.status === 'fulfilled' && usersResponse.value.data.success) {
        totalUsers = usersResponse.value.data.data?.length || 0;
      }

      // ✅ Procesar respuesta de ventas
      let totalSales = 0;
      let totalRevenue = 0;
      let recentSales = [];

      if (salesResponse.status === 'fulfilled' && salesResponse.value.data.success) {
        const salesData = salesResponse.value.data.data || [];
        totalSales = salesData.length;
        totalRevenue = salesData.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
        
        // ✅ Obtener ventas recientes para actividad
        recentSales = salesData
          .slice(0, 5)
          .map(sale => ({
            type: 'sale',
            description: `Venta #${sale.saleNumber || sale._id} - $${sale.totalAmount}`,
            timestamp: new Date(sale.createdAt).toLocaleDateString('es-ES')
          }));
      }

      setStats({
        totalProducts,
        totalUsers,
        totalSales,
        totalRevenue
      });

      // ✅ Combinar actividad reciente
      const mockActivity = [
        ...recentSales,
        {
          type: 'info',
          description: 'Panel de administración cargado',
          timestamp: 'Ahora'
        }
      ];

      setRecentActivity(mockActivity);
      setConnectionStatus('connected');

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // ✅ Manejar diferentes tipos de errores
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        setConnectionStatus('network_error');
        toast.error('Error de conexión. Verifica que el backend esté ejecutándose.');
      } else if (error.response?.status === 401) {
        setConnectionStatus('auth_error');
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        setConnectionStatus('access_denied');
        toast.error('No tienes permisos para acceder a estos datos.');
      } else {
        setConnectionStatus('error');
        toast.error('Error al cargar los datos del dashboard');
      }

      // ✅ Datos por defecto en caso de error
      setStats({
        totalProducts: 0,
        totalUsers: 0,
        totalSales: 0,
        totalRevenue: 0
      });
      
      setRecentActivity([{
        type: 'error',
        description: 'Error al cargar datos recientes',
        timestamp: 'Ahora'
      }]);

    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action) => {
    switch (action) {
      case 'add-product':
        navigate('/admin/add-product');
        break;
      case 'manage-products':
        navigate('/admin/manage-products');
        break;
      case 'manage-users':
        if (isSuperUser) {
          navigate('/admin/manage-users');
        } else {
          toast.error('Solo SuperUser puede gestionar usuarios');
        }
        break;
      case 'view-sales':
        navigate('/admin/sales');
        break;
      case 'reports':
        toast.info('Reportes detallados - Funcionalidad en desarrollo');
        break;
      case 'inventory':
        toast.info('Control de inventario - Funcionalidad en desarrollo');
        break;
      default:
        toast.info('Funcionalidad en desarrollo');
    }
  };

  const getConnectionStatusMessage = () => {
    const statusMessages = {
      checking: { text: '🔄 Conectando con el servidor...', className: 'status-checking' },
      connected: { text: '✅ Conectado al servidor', className: 'status-connected' },
      network_error: { text: '🌐 Error de red - Verifica el backend', className: 'status-error' },
      auth_error: { text: '🔐 Error de autenticación', className: 'status-error' },
      access_denied: { text: '🚫 Acceso denegado', className: 'status-warning' },
      error: { text: '❌ Error de conexión', className: 'status-error' },
    };
    
    return statusMessages[connectionStatus] || statusMessages.error;
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <span className="admin-loading-spinner"></span>
          Cargando dashboard...
          <div className="loading-subtitle">
            Obteniendo datos del sistema
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getConnectionStatusMessage();

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-title">Panel de Administración</h1>
        <p className="admin-subtitle">
          Bienvenido, {user?.name} ({user?.role})
        </p>
        
        {/* ✅ Estado de conexión */}
        <div className={`connection-status ${statusInfo.className}`}>
          <span className="status-indicator"></span>
          {statusInfo.text}
        </div>

        {(connectionStatus === 'error' || connectionStatus === 'network_error') && (
          <button 
            onClick={fetchDashboardData}
            className="reconnect-button"
          >
            🔄 Reintentar conexión
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => handleAction('manage-products')}>
          <div className="stat-icon">
            <Inventory />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalProducts}</div>
            <div className="stat-label">Productos Totales</div>
          </div>
        </div>
        
        <div className="stat-card" onClick={() => handleAction('manage-users')}>
          <div className="stat-icon">
            <People />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">Usuarios Registrados</div>
            {!isSuperUser && (
              <div className="stat-note">Solo SuperUser</div>
            )}
          </div>
        </div>
        
        <div className="stat-card" onClick={() => handleAction('view-sales')}>
          <div className="stat-icon">
            <ShoppingCart />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalSales}</div>
            <div className="stat-label">Ventas Realizadas</div>
          </div>
        </div>
        
        <div className="stat-card revenue" onClick={() => handleAction('reports')}>
          <div className="stat-icon">
            <AttachMoney />
          </div>
          <div className="stat-content">
            <div className="stat-number">${stats.totalRevenue.toFixed(2)}</div>
            <div className="stat-label">Ingresos Totales</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions-section">
        <h2 className="actions-title">Acciones Rápidas</h2>
        <div className="actions-grid">
          <button 
            className="action-button primary"
            onClick={() => handleAction('add-product')}
          >
            <Add className="action-icon" />
            <span>Agregar Producto</span>
          </button>
          
          <button 
            className="action-button secondary"
            onClick={() => handleAction('manage-products')}
          >
            <Inventory className="action-icon" />
            <span>Gestionar Productos</span>
          </button>
          
          <button 
            className={`action-button ${isSuperUser ? 'secondary' : 'disabled'}`}
            onClick={() => handleAction('manage-users')}
            disabled={!isSuperUser}
          >
            <People className="action-icon" />
            <span>
              Gestionar Usuarios
              {!isSuperUser && <small>Solo SuperUser</small>}
            </span>
          </button>
          
          <button 
            className="action-button success"
            onClick={() => handleAction('view-sales')}
          >
            <ShoppingCart className="action-icon" />
            <span>Ver Ventas</span>
          </button>
          
          <button 
            className="action-button warning"
            onClick={() => handleAction('reports')}
          >
            <Assessment className="action-icon" />
            <span>Reportes</span>
          </button>
          
          <button 
            className="action-button info"
            onClick={() => handleAction('inventory')}
          >
            <LocalShipping className="action-icon" />
            <span>Inventario</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <div className="activity-header">
          <h2 className="activity-title">Actividad Reciente</h2>
          <button 
            onClick={fetchDashboardData}
            className="refresh-button"
            title="Actualizar actividad"
          >
            🔄
          </button>
        </div>
        <div className="activity-list">
          {recentActivity.length === 0 ? (
            <div className="activity-empty">
              <div className="empty-icon">📊</div>
              <p>No hay actividad reciente</p>
              <small>Los datos de actividad se cargarán automáticamente</small>
            </div>
          ) : (
            recentActivity.map((activity, index) => (
              <div key={index} className={`activity-item ${activity.type}`}>
                <div className="activity-icon">
                  {activity.type === 'sale' && '💰'}
                  {activity.type === 'user' && '👤'}
                  {activity.type === 'product' && '📦'}
                  {activity.type === 'info' && 'ℹ️'}
                  {activity.type === 'error' && '❌'}
                </div>
                <div className="activity-content">
                  <div className="activity-text">{activity.description}</div>
                  <div className="activity-time">{activity.timestamp}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Debug Info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <details>
            <summary>Información de Debug</summary>
            <p><strong>Usuario:</strong> {user?.name} ({user?.role})</p>
            <p><strong>Permisos:</strong> Admin: {isAdmin ? 'Sí' : 'No'}, SuperUser: {isSuperUser ? 'Sí' : 'No'}</p>
            <p><strong>Estado conexión:</strong> {connectionStatus}</p>
            <p><strong>Productos:</strong> {stats.totalProducts}</p>
            <p><strong>Usuarios:</strong> {stats.totalUsers}</p>
            <p><strong>Ventas:</strong> {stats.totalSales}</p>
            <p><strong>Ingresos:</strong> ${stats.totalRevenue.toFixed(2)}</p>
          </details>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;