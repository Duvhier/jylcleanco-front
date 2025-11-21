// src/pages/AdminDashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  FiBox, 
  FiUsers, 
  FiActivity, 
  FiPlus, 
  FiTrash2, 
  FiEdit, 
  FiShoppingCart, 
  FiDollarSign,
  FiRefreshCw
} from 'react-icons/fi';
import { productsAPI, usersAPI, salesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isSuperUser } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalSales: 0,
    totalRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  if (!isAdmin && !isSuperUser) {
    return (
      <div className="admin-container">
        <div className="access-denied">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder al panel de administración.</p>
          <button className="back-button" onClick={() => navigate('/')}>
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

      const [productsResponse, usersResponse, salesResponse] = await Promise.allSettled([
        productsAPI.getAll(),
        isSuperUser ? usersAPI.getAll() : Promise.resolve({ data: { data: [] } }),
        salesAPI.getAll()
      ]);

      let totalProducts = 0;
      if (productsResponse.status === 'fulfilled' && productsResponse.value.data.success) {
        totalProducts = productsResponse.value.data.data?.length || 0;
      }

      let totalUsers = 0;
      if (usersResponse.status === 'fulfilled' && usersResponse.value.data.success) {
        totalUsers = usersResponse.value.data.data?.length || 0;
      }

      let totalSales = 0;
      let totalRevenue = 0;
      let recentSales = [];

      if (salesResponse.status === 'fulfilled' && salesResponse.value.data.success) {
        const salesData = salesResponse.value.data.data || [];
        totalSales = salesData.length;
        totalRevenue = salesData.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
        
        recentSales = salesData
          .slice(0, 5)
          .map(sale => ({
            type: 'sale',
            description: `Venta #${sale.saleNumber || sale._id.slice(-6)} - $${sale.totalAmount}`,
            timestamp: new Date(sale.createdAt).toLocaleDateString('es-ES')
          }));
      }

      setStats({
        totalProducts,
        totalUsers,
        totalSales,
        totalRevenue
      });

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
      setConnectionStatus('error');
      toast.error('Error al cargar los datos del dashboard');
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
      default:
        toast.info('Funcionalidad en desarrollo');
    }
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="admin-container">
      <motion.div 
        className="admin-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="admin-title">Panel de Administración</h1>
        <p className="admin-subtitle">
          Bienvenido, {user?.name} <span className="role-badge">{user?.role}</span>
        </p>
      </motion.div>

      <motion.div 
        className="stats-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="stat-card glass-card"
          variants={itemVariants}
          onClick={() => handleAction('manage-products')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="stat-icon products">
            <FiBox />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalProducts}</div>
            <div className="stat-label">Productos Totales</div>
          </div>
        </motion.div>
        
        <motion.div 
          className="stat-card glass-card"
          variants={itemVariants}
          onClick={() => handleAction('manage-users')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="stat-icon users">
            <FiUsers />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">Usuarios Registrados</div>
            {!isSuperUser && <small className="restricted-text">Solo SuperUser</small>}
          </div>
        </motion.div>
        
        <motion.div 
          className="stat-card glass-card"
          variants={itemVariants}
          onClick={() => handleAction('view-sales')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="stat-icon sales">
            <FiShoppingCart />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalSales}</div>
            <div className="stat-label">Ventas Realizadas</div>
          </div>
        </motion.div>
        
        <motion.div 
          className="stat-card glass-card"
          variants={itemVariants}
        >
          <div className="stat-icon revenue">
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <div className="stat-number">${stats.totalRevenue.toFixed(2)}</div>
            <div className="stat-label">Ingresos Totales</div>
          </div>
        </motion.div>
      </motion.div>

      <div className="dashboard-content">
        <motion.div 
          className="actions-section glass-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="section-title">Acciones Rápidas</h2>
          <div className="actions-grid">
            <motion.button 
              className="action-button primary"
              onClick={() => handleAction('add-product')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus className="action-icon" />
              <span>Agregar Producto</span>
            </motion.button>
            
            <motion.button 
              className="action-button secondary"
              onClick={() => handleAction('manage-products')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiBox className="action-icon" />
              <span>Gestionar Productos</span>
            </motion.button>
            
            <motion.button 
              className={`action-button ${isSuperUser ? 'accent' : 'disabled'}`}
              onClick={() => handleAction('manage-users')}
              disabled={!isSuperUser}
              whileHover={isSuperUser ? { scale: 1.05 } : {}}
              whileTap={isSuperUser ? { scale: 0.95 } : {}}
            >
              <FiUsers className="action-icon" />
              <span>Gestionar Usuarios</span>
            </motion.button>

            <motion.button 
              className="action-button success"
              onClick={() => handleAction('view-sales')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiActivity className="action-icon" />
              <span>Ver Reportes</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="activity-section glass-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="activity-header">
            <h2 className="section-title">Actividad Reciente</h2>
            <button onClick={fetchDashboardData} className="refresh-btn" title="Actualizar">
              <FiRefreshCw className={loading ? 'spinning' : ''} />
            </button>
          </div>
          
          <div className="activity-list">
            {recentActivity.length === 0 ? (
              <div className="empty-state">
                <FiActivity />
                <p>No hay actividad reciente</p>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <motion.div 
                  key={index} 
                  className="activity-item"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className={`activity-icon-small ${activity.type}`}>
                    {activity.type === 'sale' && <FiDollarSign />}
                    {activity.type === 'info' && <FiActivity />}
                  </div>
                  <div className="activity-details">
                    <p className="activity-desc">{activity.description}</p>
                    <span className="activity-time">{activity.timestamp}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;