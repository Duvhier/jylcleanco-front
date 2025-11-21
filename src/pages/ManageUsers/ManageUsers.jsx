import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiShield,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiAlertCircle
} from 'react-icons/fi';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const navigate = useNavigate();
  const { user: currentUser, isSuperUser } = useAuth();

  // Verificar permisos - Solo SuperUser puede gestionar usuarios
  if (!isSuperUser) {
    return (
      <div className="manage-users-container">
        <motion.div 
          className="access-denied glass-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FiAlertCircle className="denied-icon" />
          <h2>Acceso Denegado</h2>
          <p>Solo los usuarios SuperUser pueden gestionar otros usuarios.</p>
          <button 
            className="back-button"
            onClick={() => navigate('/admin')}
          >
            <FiArrowLeft />
            Volver al Panel de Administración
          </button>
        </motion.div>
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setConnectionStatus('checking');
    
    try {
      const response = await usersAPI.getAll();
      
      if (response.data.success) {
        setUsers(response.data.data || []);
        setConnectionStatus('connected');
      } else {
        setUsers([]);
        setConnectionStatus('error');
        toast.error('Error al cargar los usuarios');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        setConnectionStatus('network_error');
        toast.error('Error de conexión. Verifica que el backend esté ejecutándose.');
      } else if (error.response?.status === 401) {
        setConnectionStatus('auth_error');
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        setConnectionStatus('access_denied');
        toast.error('No tienes permisos para gestionar usuarios.');
      } else {
        setConnectionStatus('error');
        toast.error('Error al cargar los usuarios');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (userId) => {
    toast.info(`Editar usuario ${userId} - Funcionalidad en desarrollo`);
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const user = users.find(u => u._id === userId);
    if (!user) return;

    const newStatus = !currentStatus;
    const action = newStatus ? 'activar' : 'desactivar';

    if (!window.confirm(`¿Estás seguro de ${action} al usuario "${user.name}"?`)) {
      return;
    }

    if (userId === currentUser._id) {
      toast.error('No puedes desactivar tu propio usuario');
      return;
    }

    try {
      const response = await usersAPI.update(userId, { isActive: newStatus });
      
      if (response.data.success) {
        toast.success(`✅ Usuario ${action}do exitosamente`);
        setUsers(users.map(u => 
          u._id === userId ? { ...u, isActive: newStatus } : u
        ));
      } else {
        toast.error(response.data.message || `Error al ${action} el usuario`);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(error.response?.data?.message || `Error al ${action} el usuario`);
    }
  };

  const handleChangeUserRole = async (userId, currentRole) => {
    const user = users.find(u => u._id === userId);
    if (!user) return;

    const newRole = currentRole === 'User' ? 'Admin' : 'User';

    if (!window.confirm(`¿Cambiar el rol de "${user.name}" de ${currentRole} a ${newRole}?`)) {
      return;
    }

    if (userId === currentUser._id) {
      toast.error('No puedes cambiar tu propio rol');
      return;
    }

    try {
      const response = await usersAPI.update(userId, { role: newRole });
      
      if (response.data.success) {
        toast.success(`✅ Rol cambiado a ${newRole} exitosamente`);
        setUsers(users.map(u => 
          u._id === userId ? { ...u, role: newRole } : u
        ));
      } else {
        toast.error(response.data.message || 'Error al cambiar el rol');
      }
    } catch (error) {
      console.error('Error changing user role:', error);
      toast.error(error.response?.data?.message || 'Error al cambiar el rol del usuario');
    }
  };

  const handleDeleteUser = async (userId) => {
    const user = users.find(u => u._id === userId);
    if (!user) return;

    if (userId === currentUser._id) {
      toast.error('No puedes eliminar tu propio usuario');
      return;
    }

    if (!window.confirm(`¿Estás seguro de eliminar al usuario "${user.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await usersAPI.delete(userId);
      
      toast.success('✅ Usuario eliminado exitosamente');
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar el usuario');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'SuperUser':
        return <FiShield className="role-icon superuser" />;
      case 'Admin':
        return <FiUsers className="role-icon admin" />;
      default:
        return <FiUser className="role-icon user" />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'SuperUser':
        return 'role-badge superuser';
      case 'Admin':
        return 'role-badge admin';
      default:
        return 'role-badge user';
    }
  };

  if (loading) {
    return (
      <div className="manage-users-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-users-container">
      {/* Header */}
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-content">
          <button 
            className="back-button-small"
            onClick={() => navigate('/admin')}
          >
            <FiArrowLeft />
            Volver
          </button>
          <h1 className="page-title">Gestión de Usuarios</h1>
          <p className="page-subtitle">
            Administra los usuarios registrados en J&L Clean Co.
          </p>
          
          <div className="user-info">
            <span>SuperUser: {currentUser?.name} ({currentUser?.email})</span>
          </div>
        </div>
      </motion.div>

      {/* Connection Status */}
      <motion.div 
        className={`connection-status ${connectionStatus}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="status-indicator"></span>
        {connectionStatus === 'connected' && `✅ ${users.length} usuarios cargados`}
        {connectionStatus === 'checking' && '🔄 Cargando usuarios...'}
        {connectionStatus === 'network_error' && '🌐 Error de conexión'}
        {connectionStatus === 'error' && '❌ Error al cargar usuarios'}
      </motion.div>

      {(connectionStatus === 'error' || connectionStatus === 'network_error') && (
        <motion.button 
          onClick={fetchUsers}
          className="retry-button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          <FiRefreshCw /> Reintentar conexión
        </motion.button>
      )}

      {/* Users Grid */}
      {connectionStatus === 'connected' && users.length === 0 ? (
        <motion.div 
          className="empty-state glass-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="empty-icon">
            <FiUsers />
          </div>
          <h3 className="empty-title">No hay usuarios registrados</h3>
          <p className="empty-description">
            Los usuarios aparecerán aquí una vez que se registren en la plataforma.
          </p>
        </motion.div>
      ) : connectionStatus === 'connected' ? (
        <div className="users-grid">
          <AnimatePresence>
            {users.map((user, index) => (
              <motion.div 
                key={user._id}
                className={`user-card glass-card ${user._id === currentUser._id ? 'current-user' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="user-header">
                  <div className="user-avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="user-main-info">
                    <h3 className="user-name">{user.name}</h3>
                    <p className="user-email">{user.email}</p>
                    <p className="user-id">ID: {user._id?.substring(0, 12)}...</p>
                  </div>
                </div>

                <div className="user-details">
                  <div className="detail-row">
                    <span className="detail-label">Rol:</span>
                    <div className="role-display">
                      {getRoleIcon(user.role)}
                      <span className={getRoleBadgeClass(user.role)}>
                        {user.role}
                      </span>
                      {user.role !== 'SuperUser' && user._id !== currentUser._id && (
                        <motion.button 
                          className="change-role-btn"
                          onClick={() => handleChangeUserRole(user._id, user.role)}
                          title={`Cambiar rol de ${user.role}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiRefreshCw />
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Estado:</span>
                    <div className="status-display">
                      <span className={`status-badge ${user.isActive !== false ? 'active' : 'inactive'}`}>
                        {user.isActive !== false ? (
                          <><FiCheckCircle /> Activo</>
                        ) : (
                          <><FiXCircle /> Inactivo</>
                        )}
                      </span>
                      {user._id !== currentUser._id && (
                        <motion.button 
                          className="toggle-status-btn"
                          onClick={() => handleToggleUserStatus(user._id, user.isActive !== false)}
                          title={user.isActive !== false ? 'Desactivar usuario' : 'Activar usuario'}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {user.isActive !== false ? <FiXCircle /> : <FiCheckCircle />}
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Registro:</span>
                    <span className="registration-date">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="user-actions">
                  <motion.button 
                    className="action-btn edit-btn"
                    onClick={() => handleEditUser(user._id)}
                    title="Editar usuario"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiEdit2 />
                  </motion.button>
                  <motion.button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteUser(user._id)}
                    title="Eliminar usuario"
                    disabled={user._id === currentUser._id || user.role === 'SuperUser'}
                    whileHover={{ scale: user._id === currentUser._id || user.role === 'SuperUser' ? 1 : 1.1 }}
                    whileTap={{ scale: user._id === currentUser._id || user.role === 'SuperUser' ? 1 : 0.9 }}
                  >
                    <FiTrash2 />
                  </motion.button>
                </div>

                {user._id === currentUser._id && (
                  <div className="current-user-badge">
                    Tú
                  </div>
                )}
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
          <h3 className="error-title">No se pudieron cargar los usuarios</h3>
          <p className="error-description">
            {connectionStatus === 'network_error' 
              ? 'Verifica que el backend esté ejecutándose correctamente.'
              : 'Ha ocurrido un error al cargar los usuarios.'
            }
          </p>
          <button 
            onClick={fetchUsers}
            className="retry-button"
          >
            <FiRefreshCw /> Reintentar
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ManageUsers;