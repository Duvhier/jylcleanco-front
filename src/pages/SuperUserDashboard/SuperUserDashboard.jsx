import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  People,
  Inventory,
  ShoppingCart,
  Settings,
  Security,
  Assessment,
  Backup,
  Speed,
  Storage,
  NetworkCheck,
  Add,
  Edit,
  Delete,
  Visibility,
  TrendingUp,
  LocalShipping,
  AdminPanelSettings
} from '@mui/icons-material';
import './SuperUserDashboard.css';

const SuperUserDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    activeAdmins: 0,
    systemHealth: 'excellent'
  });
  const [systemStatus, setSystemStatus] = useState({
    database: 'online',
    api: 'online',
    storage: 'online',
    network: 'online'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuperUserData();
  }, []);

  const fetchSuperUserData = async () => {
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

      // Contar administradores (asumiendo que tienen role 'admin' o 'superuser')
      const activeAdmins = usersResponse.data?.filter(user => 
        user.role === 'admin' || user.role === 'superuser'
      ).length || 0;

      setStats({
        totalUsers,
        totalProducts,
        totalSales,
        totalRevenue,
        activeAdmins,
        systemHealth: 'excellent'
      });

      // Simular estado del sistema
      setSystemStatus({
        database: 'online',
        api: 'online',
        storage: 'online',
        network: 'online'
      });

    } catch (error) {
      console.error('Error fetching superuser data:', error);
      
      // Si hay error, usar datos por defecto
      setStats({
        totalUsers: 0,
        totalProducts: 0,
        totalSales: 0,
        totalRevenue: 0,
        activeAdmins: 0,
        systemHealth: 'excellent'
      });
      
      setSystemStatus({
        database: 'online',
        api: 'online',
        storage: 'online',
        network: 'online'
      });
      
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
      case 'manage-admins':
        toast.info('Gestión de administradores - Funcionalidad en desarrollo');
        break;
      case 'manage-users':
        toast.info('Gestión de usuarios - Funcionalidad en desarrollo');
        break;
      case 'manage-products':
        navigate('/products');
        break;
      case 'view-sales':
        toast.info('Ver ventas - Funcionalidad en desarrollo');
        break;
      case 'system-settings':
        toast.info('Configuración del sistema - Funcionalidad en desarrollo');
        break;
      case 'security':
        toast.info('Configuración de seguridad - Funcionalidad en desarrollo');
        break;
      case 'backup':
        toast.info('Backup y restauración - Funcionalidad en desarrollo');
        break;
      case 'reports':
        toast.info('Generación de reportes - Funcionalidad en desarrollo');
        break;
      case 'inventory':
        toast.info('Control de inventario - Funcionalidad en desarrollo');
        break;
      case 'categories':
        toast.info('Gestión de categorías - Funcionalidad en desarrollo');
        break;
      case 'analytics':
        toast.info('Analytics avanzado - Funcionalidad en desarrollo');
        break;
      case 'maintenance':
        toast.info('Modo mantenimiento - Funcionalidad en desarrollo');
        break;
      default:
        toast.info('Funcionalidad en desarrollo');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'success';
    }
  };

  if (loading) {
    return (
      <div className="superuser-container">
        <div className="superuser-loading">
          <span className="superuser-loading-spinner"></span>
          Cargando panel de superusuario...
        </div>
      </div>
    );
  }

  return (
    <div className="superuser-container">
      {/* Header */}
      <div className="superuser-header">
        <h1 className="superuser-title">Panel de Superusuario</h1>
        <p className="superuser-subtitle">
          Control total del sistema. Gestiona administradores, usuarios, productos y configuración del sistema.
        </p>
        <div className="role-badge">
          Superusuario
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="quick-action" onClick={() => handleAction('manage-admins')}>
          <AdminPanelSettings className="quick-action-icon" />
          <div className="quick-action-label">Admins</div>
        </div>
        <div className="quick-action" onClick={() => handleAction('security')}>
          <Security className="quick-action-icon" />
          <div className="quick-action-label">Seguridad</div>
        </div>
        <div className="quick-action" onClick={() => handleAction('backup')}>
          <Backup className="quick-action-icon" />
          <div className="quick-action-label">Backup</div>
        </div>
        <div className="quick-action" onClick={() => handleAction('reports')}>
          <Assessment className="quick-action-icon" />
          <div className="quick-action-label">Reportes</div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-overview-card" onClick={() => navigate('/admin/manage-users')}>
          <div className="stat-overview-icon">👥</div>
          <div className="stat-overview-number">{stats.totalUsers}</div>
          <div className="stat-overview-label">Usuarios Totales</div>
        </div>
        
        <div className="stat-overview-card" onClick={() => handleAction('manage-products')}>
          <div className="stat-overview-icon">📦</div>
          <div className="stat-overview-number">{stats.totalProducts}</div>
          <div className="stat-overview-label">Productos</div>
        </div>
        
        <div className="stat-overview-card" onClick={() => handleAction('view-sales')}>
          <div className="stat-overview-icon">💰</div>
          <div className="stat-overview-number">{stats.totalSales}</div>
          <div className="stat-overview-label">Ventas</div>
        </div>
        
        <div className="stat-overview-card" onClick={() => handleAction('reports')}>
          <div className="stat-overview-icon">📊</div>
          <div className="stat-overview-number">${stats.totalRevenue.toFixed(2)}</div>
          <div className="stat-overview-label">Ingresos</div>
        </div>
        
        <div className="stat-overview-card" onClick={() => handleAction('manage-admins')}>
          <div className="stat-overview-icon">👨‍💼</div>
          <div className="stat-overview-number">{stats.activeAdmins}</div>
          <div className="stat-overview-label">Administradores</div>
        </div>
        
        <div className="stat-overview-card" onClick={() => handleAction('system-settings')}>
          <div className="stat-overview-icon">⚙️</div>
          <div className="stat-overview-number">{stats.systemHealth}</div>
          <div className="stat-overview-label">Salud del Sistema</div>
        </div>
      </div>

      {/* Management Sections */}
      <div className="management-sections">
        {/* User Management */}
        <div className="management-section">
          <div className="section-header">
            <div className="section-icon users">
              <People />
            </div>
            <div>
              <h3 className="section-title">Gestión de Usuarios</h3>
              <p className="section-description">
                Administra usuarios, roles y permisos del sistema
              </p>
            </div>
          </div>
          <div className="section-actions">
            <button 
              className="section-action-button primary"
              onClick={() => handleAction('manage-users')}
            >
              <span>Ver Todos los Usuarios</span>
              <span className="action-arrow">→</span>
            </button>
            <button 
              className="section-action-button"
              onClick={() => handleAction('manage-admins')}
            >
              <span>Gestionar Administradores</span>
              <span className="action-arrow">→</span>
            </button>
            <button 
              className="section-action-button"
              onClick={() => handleAction('security')}
            >
              <span>Configurar Seguridad</span>
              <span className="action-arrow">→</span>
            </button>
          </div>
        </div>

        {/* Product Management */}
        <div className="management-section">
          <div className="section-header">
            <div className="section-icon products">
              <Inventory />
            </div>
            <div>
              <h3 className="section-title">Gestión de Productos</h3>
              <p className="section-description">
                Controla el inventario y catálogo de productos
              </p>
            </div>
          </div>
          <div className="section-actions">
            <button 
              className="section-action-button success"
              onClick={() => handleAction('manage-products')}
            >
              <span>Gestionar Productos</span>
              <span className="action-arrow">→</span>
            </button>
            <button 
              className="section-action-button"
              onClick={() => handleAction('inventory')}
            >
              <span>Control de Inventario</span>
              <span className="action-arrow">→</span>
            </button>
            <button 
              className="section-action-button"
              onClick={() => handleAction('categories')}
            >
              <span>Gestionar Categorías</span>
              <span className="action-arrow">→</span>
            </button>
          </div>
        </div>

        {/* Sales & Analytics */}
        <div className="management-section">
          <div className="section-header">
            <div className="section-icon sales">
              <ShoppingCart />
            </div>
            <div>
              <h3 className="section-title">Ventas y Analytics</h3>
              <p className="section-description">
                Monitorea ventas, reportes y métricas del negocio
              </p>
            </div>
          </div>
          <div className="section-actions">
            <button 
              className="section-action-button warning"
              onClick={() => handleAction('view-sales')}
            >
              <span>Ver Ventas</span>
              <span className="action-arrow">→</span>
            </button>
            <button 
              className="section-action-button"
              onClick={() => handleAction('reports')}
            >
              <span>Generar Reportes</span>
              <span className="action-arrow">→</span>
            </button>
            <button 
              className="section-action-button"
              onClick={() => handleAction('analytics')}
            >
              <span>Analytics Avanzado</span>
              <span className="action-arrow">→</span>
            </button>
          </div>
        </div>

        {/* System Management */}
        <div className="management-section">
          <div className="section-header">
            <div className="section-icon system">
              <Settings />
            </div>
            <div>
              <h3 className="section-title">Configuración del Sistema</h3>
              <p className="section-description">
                Configuración avanzada y mantenimiento del sistema
              </p>
            </div>
          </div>
          <div className="section-actions">
            <button 
              className="section-action-button"
              onClick={() => handleAction('system-settings')}
            >
              <span>Configuración General</span>
              <span className="action-arrow">→</span>
            </button>
            <button 
              className="section-action-button"
              onClick={() => handleAction('backup')}
            >
              <span>Backup y Restauración</span>
              <span className="action-arrow">→</span>
            </button>
            <button 
              className="section-action-button danger"
              onClick={() => handleAction('maintenance')}
            >
              <span>Modo Mantenimiento</span>
              <span className="action-arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="system-status">
        <div className="system-status-header">
          <div className="system-status-icon">
            <Speed />
          </div>
          <h3 className="system-status-title">Estado del Sistema</h3>
        </div>
        <div className="status-grid">
          <div className="status-item">
            <div className={`status-indicator ${getStatusColor(systemStatus.database)}`}></div>
            <div className="status-text">Base de Datos</div>
          </div>
          <div className="status-item">
            <div className={`status-indicator ${getStatusColor(systemStatus.api)}`}></div>
            <div className="status-text">API</div>
          </div>
          <div className="status-item">
            <div className={`status-indicator ${getStatusColor(systemStatus.storage)}`}></div>
            <div className="status-text">Almacenamiento</div>
          </div>
          <div className="status-item">
            <div className={`status-indicator ${getStatusColor(systemStatus.network)}`}></div>
            <div className="status-text">Red</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperUserDashboard;
