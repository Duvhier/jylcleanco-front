import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
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
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalSales: 0,
    totalRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Intentar obtener datos de diferentes endpoints disponibles
      const requests = [
        // Obtener productos
        axios.get('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] })),
        
        // Obtener usuarios (si existe el endpoint)
        axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] })),
        
        // Obtener ventas (si existe el endpoint)
        axios.get('http://localhost:5000/api/sales', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] }))
      ];

      const [productsResponse, usersResponse, salesResponse] = await Promise.all(requests);

      // Calcular estadísticas basadas en los datos disponibles
      const totalProducts = productsResponse.data?.length || 0;
      const totalUsers = usersResponse.data?.length || 0;
      const totalSales = salesResponse.data?.length || 0;
      
      // Calcular ingresos totales
      const totalRevenue = salesResponse.data?.reduce((sum, sale) => {
        return sum + (sale.total || 0);
      }, 0) || 0;

      setStats({
        totalProducts,
        totalUsers,
        totalSales,
        totalRevenue
      });

      // Simular actividad reciente
      const mockActivity = [
        {
          type: 'sale',
          description: 'Nueva venta realizada',
          timestamp: 'Hace 5 minutos'
        },
        {
          type: 'user',
          description: 'Usuario registrado',
          timestamp: 'Hace 15 minutos'
        },
        {
          type: 'product',
          description: 'Producto agregado al inventario',
          timestamp: 'Hace 1 hora'
        }
      ];

      setRecentActivity(mockActivity);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Si hay error, usar datos por defecto
      setStats({
        totalProducts: 0,
        totalUsers: 0,
        totalSales: 0,
        totalRevenue: 0
      });
      
      setRecentActivity([]);
      
      // Solo mostrar error si es un error de red, no de datos faltantes
      if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
        toast.error('Error de conexión. Verificando estado del sistema...');
      }
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
        toast.info('Gestión de usuarios - Funcionalidad en desarrollo');
        break;
      case 'view-sales':
        toast.info('Ver ventas - Funcionalidad en desarrollo');
        break;
      case 'reports':
        toast.info('Generación de reportes - Funcionalidad en desarrollo');
        break;
      case 'inventory':
        toast.info('Control de inventario - Funcionalidad en desarrollo');
        break;
      default:
        toast.info('Funcionalidad en desarrollo');
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <span className="admin-loading-spinner"></span>
          Cargando dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-title">Panel de Administración</h1>
        <p className="admin-subtitle">
          Gestiona productos, usuarios, ventas y obtén insights de tu negocio
        </p>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="quick-stat">
          <div className="quick-stat-number">{stats.totalProducts}</div>
          <div className="quick-stat-label">Productos</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-number">{stats.totalUsers}</div>
          <div className="quick-stat-label">Usuarios</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-number">{stats.totalSales}</div>
          <div className="quick-stat-label">Ventas</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-number">${stats.totalRevenue.toFixed(2)}</div>
          <div className="quick-stat-label">Ingresos</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => handleAction('manage-products')}>
          <div className="stat-icon">📦</div>
          <div className="stat-number">{stats.totalProducts}</div>
          <div className="stat-label">Productos Totales</div>
        </div>
        
        <div className="stat-card" onClick={() => handleAction('manage-users')}>
          <div className="stat-icon">👥</div>
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label">Usuarios Registrados</div>
        </div>
        
        <div className="stat-card" onClick={() => handleAction('view-sales')}>
          <div className="stat-icon">💰</div>
          <div className="stat-number">{stats.totalSales}</div>
          <div className="stat-label">Ventas Realizadas</div>
        </div>
        
        <div className="stat-card" onClick={() => handleAction('reports')}>
          <div className="stat-icon">📊</div>
          <div className="stat-number">${stats.totalRevenue.toFixed(2)}</div>
          <div className="stat-label">Ingresos Totales</div>
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
            Agregar Producto
          </button>
          
          <button 
            className="action-button"
            onClick={() => handleAction('manage-products')}
          >
            <Inventory className="action-icon" />
            Gestionar Productos
          </button>
          
          <button 
            className="action-button"
            onClick={() => handleAction('manage-users')}
          >
            <People className="action-icon" />
            Gestionar Usuarios
          </button>
          
          <button 
            className="action-button success"
            onClick={() => handleAction('view-sales')}
          >
            <ShoppingCart className="action-icon" />
            Ver Ventas
          </button>
          
          <button 
            className="action-button warning"
            onClick={() => handleAction('reports')}
          >
            <Assessment className="action-icon" />
            Reportes
          </button>
          
          <button 
            className="action-button"
            onClick={() => handleAction('inventory')}
          >
            <LocalShipping className="action-icon" />
            Inventario
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h2 className="activity-title">Actividad Reciente</h2>
        <div className="activity-list">
          {recentActivity.length === 0 ? (
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', padding: 'var(--spacing-lg)' }}>
              No hay actividad reciente
            </div>
          ) : (
            recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'sale' && '💰'}
                  {activity.type === 'user' && '👤'}
                  {activity.type === 'product' && '📦'}
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
    </div>
  );
};

export default AdminDashboard;
