import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiSettings,
  FiShield,
  FiBarChart2,
  FiDatabase,
  FiServer,
  FiHardDrive,
  FiWifi,
  FiTrendingUp,
  FiDollarSign,
  FiUserCheck
} from 'react-icons/fi';
import { productsAPI, usersAPI, salesAPI } from '../../services/api';
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
      const requests = [
        productsAPI.getAll().catch(() => ({ data: { data: [] } })),
        usersAPI.getAll().catch(() => ({ data: { data: [] } })),
        salesAPI.getAll().catch(() => ({ data: [] }))
      ];

      const [productsResponse, usersResponse, salesResponse] = await Promise.all(requests);

      const totalProducts = productsResponse.data?.data?.length || 0;
      const totalUsers = usersResponse.data?.data?.length || 0;
      const totalSales = salesResponse.data?.length || 0;
      
      const totalRevenue = salesResponse.data?.reduce((sum, sale) => {
        return sum + (sale.total || 0);
      }, 0) || 0;

      const activeAdmins = usersResponse.data?.data?.filter(user => 
        user.role === 'Admin' || user.role === 'SuperUser'
      ).length || 0;

      setStats({
        totalUsers,
        totalProducts,
        totalSales,
        totalRevenue,
        activeAdmins,
        systemHealth: 'excellent'
      });

      setSystemStatus({
        database: 'online',
        api: 'online',
        storage: 'online',
        network: 'online'
      });

    } catch (error) {
      console.error('Error fetching superuser data:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
        toast.error('Error de conexión. Verificando estado del sistema...');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action) => {
    switch (action) {
      case 'manage-users':
        navigate('/admin/manage-users');
        break;
      case 'manage-products':
        navigate('/admin/manage-products');
        break;
      case 'view-sales':
        navigate('/admin/sales');
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
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando panel de superusuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="superuser-container">
      {/* Header */}
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-content">
          <h1 className="page-title">Panel de Superusuario</h1>
          <p className="page-subtitle">
            Control total del sistema. Gestiona administradores, usuarios, productos y configuración.
          </p>
          <div className="role-badge superuser">
            <FiShield /> Superusuario
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="quick-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div 
          className="quick-action glass-card"
          onClick={() => handleAction('manage-users')}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiUsers className="quick-action-icon" />
          <div className="quick-action-label">Usuarios</div>
        </motion.div>
        <motion.div 
          className="quick-action glass-card"
          onClick={() => toast.info('Funcionalidad en desarrollo')}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiShield className="quick-action-icon" />
          <div className="quick-action-label">Seguridad</div>
        </motion.div>
        <motion.div 
          className="quick-action glass-card"
          onClick={() => toast.info('Funcionalidad en desarrollo')}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiDatabase className="quick-action-icon" />
          <div className="quick-action-label">Backup</div>
        </motion.div>
        <motion.div 
          className="quick-action glass-card"
          onClick={() => toast.info('Funcionalidad en desarrollo')}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiBarChart2 className="quick-action-icon" />
          <div className="quick-action-label">Reportes</div>
        </motion.div>
      </motion.div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <motion.div 
          className="stat-card glass-card"
          onClick={() => navigate('/admin/manage-users')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5 }}
        >
          <div className="stat-icon users">
            <FiUsers />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">Usuarios Totales</div>
          </div>
          <div className="stat-trend positive">
            <FiTrendingUp /> +12%
          </div>
        </motion.div>

        <motion.div 
          className="stat-card glass-card"
          onClick={() => handleAction('manage-products')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ y: -5 }}
        >
          <div className="stat-icon products">
            <FiPackage />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalProducts}</div>
            <div className="stat-label">Productos</div>
          </div>
          <div className="stat-trend positive">
            <FiTrendingUp /> +8%
          </div>
        </motion.div>

        <motion.div 
          className="stat-card glass-card"
          onClick={() => handleAction('view-sales')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -5 }}
        >
          <div className="stat-icon sales">
            <FiShoppingCart />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalSales}</div>
            <div className="stat-label">Ventas</div>
          </div>
          <div className="stat-trend positive">
            <FiTrendingUp /> +15%
          </div>
        </motion.div>

        <motion.div 
          className="stat-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ y: -5 }}
        >
          <div className="stat-icon revenue">
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <div className="stat-number">${stats.totalRevenue.toFixed(0)}</div>
            <div className="stat-label">Ingresos</div>
          </div>
          <div className="stat-trend positive">
            <FiTrendingUp /> +20%
          </div>
        </motion.div>

        <motion.div 
          className="stat-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -5 }}
        >
          <div className="stat-icon admins">
            <FiUserCheck />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.activeAdmins}</div>
            <div className="stat-label">Administradores</div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          whileHover={{ y: -5 }}
        >
          <div className="stat-icon health">
            <FiServer />
          </div>
          <div className="stat-content">
            <div className="stat-number">Excelente</div>
            <div className="stat-label">Salud del Sistema</div>
          </div>
        </motion.div>
      </div>

      {/* Management Sections */}
      <div className="management-grid">
        <motion.div 
          className="management-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="management-header">
            <div className="management-icon users">
              <FiUsers />
            </div>
            <div>
              <h3 className="management-title">Gestión de Usuarios</h3>
              <p className="management-description">
                Administra usuarios, roles y permisos
              </p>
            </div>
          </div>
          <div className="management-actions">
            <motion.button 
              className="management-btn primary"
              onClick={() => navigate('/admin/manage-users')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Ver Todos los Usuarios →
            </motion.button>
            <motion.button 
              className="management-btn"
              onClick={() => toast.info('Funcionalidad en desarrollo')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Gestionar Administradores →
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="management-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <div className="management-header">
            <div className="management-icon products">
              <FiPackage />
            </div>
            <div>
              <h3 className="management-title">Gestión de Productos</h3>
              <p className="management-description">
                Controla el inventario y catálogo
              </p>
            </div>
          </div>
          <div className="management-actions">
            <motion.button 
              className="management-btn success"
              onClick={() => navigate('/admin/manage-products')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Gestionar Productos →
            </motion.button>
            <motion.button 
              className="management-btn"
              onClick={() => toast.info('Funcionalidad en desarrollo')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Control de Inventario →
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="management-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="management-header">
            <div className="management-icon sales">
              <FiShoppingCart />
            </div>
            <div>
              <h3 className="management-title">Ventas y Analytics</h3>
              <p className="management-description">
                Monitorea ventas y métricas
              </p>
            </div>
          </div>
          <div className="management-actions">
            <motion.button 
              className="management-btn warning"
              onClick={() => navigate('/admin/sales')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Ver Ventas →
            </motion.button>
            <motion.button 
              className="management-btn"
              onClick={() => toast.info('Funcionalidad en desarrollo')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Generar Reportes →
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="management-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <div className="management-header">
            <div className="management-icon system">
              <FiSettings />
            </div>
            <div>
              <h3 className="management-title">Configuración del Sistema</h3>
              <p className="management-description">
                Configuración avanzada y mantenimiento
              </p>
            </div>
          </div>
          <div className="management-actions">
            <motion.button 
              className="management-btn"
              onClick={() => toast.info('Funcionalidad en desarrollo')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Configuración General →
            </motion.button>
            <motion.button 
              className="management-btn danger"
              onClick={() => toast.info('Funcionalidad en desarrollo')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Modo Mantenimiento →
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div 
        className="system-status glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="system-status-header">
          <FiServer className="system-status-icon" />
          <h3 className="system-status-title">Estado del Sistema</h3>
        </div>
        <div className="status-grid">
          <div className="status-item">
            <div className={`status-indicator ${getStatusColor(systemStatus.database)}`}></div>
            <FiDatabase className="status-icon" />
            <div className="status-text">Base de Datos</div>
          </div>
          <div className="status-item">
            <div className={`status-indicator ${getStatusColor(systemStatus.api)}`}></div>
            <FiServer className="status-icon" />
            <div className="status-text">API</div>
          </div>
          <div className="status-item">
            <div className={`status-indicator ${getStatusColor(systemStatus.storage)}`}></div>
            <FiHardDrive className="status-icon" />
            <div className="status-text">Almacenamiento</div>
          </div>
          <div className="status-item">
            <div className={`status-indicator ${getStatusColor(systemStatus.network)}`}></div>
            <FiWifi className="status-icon" />
            <div className="status-text">Red</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SuperUserDashboard;
