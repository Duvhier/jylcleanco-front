import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowBack, 
  Edit, 
  Delete, 
  Block, 
  CheckCircle,
  Person,
  AdminPanelSettings,
  SupervisedUserCircle
} from '@mui/icons-material';
import { usersAPI } from '../../services/api'; // ✅ Usar API específica
import { useAuth } from '../../contexts/AuthContext'; // ✅ Para verificar permisos
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const navigate = useNavigate();
  const { user: currentUser, isSuperUser } = useAuth(); // ✅ Solo SuperUser puede gestionar usuarios

  // ✅ Verificar permisos - Solo SuperUser puede gestionar usuarios
  if (!isSuperUser) {
    return (
      <div className="manage-users-container">
        <div className="access-denied">
          <h2>Acceso Denegado</h2>
          <p>Solo los usuarios SuperUser pueden gestionar otros usuarios.</p>
          <button 
            className="back-button"
            onClick={() => navigate('/admin')}
          >
            <ArrowBack />
            Volver al Panel de Administración
          </button>
        </div>
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
    // Navegar a la edición de usuario (si existe la funcionalidad)
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

    // Evitar que el SuperUser se desactive a sí mismo
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
      
      if (error.response?.status === 401) {
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('No tienes permisos para modificar usuarios.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`Error al ${action} el usuario`);
      }
    }
  };

  const handleChangeUserRole = async (userId, currentRole) => {
    const user = users.find(u => u._id === userId);
    if (!user) return;

    // Determinar el nuevo rol
    const newRole = currentRole === 'User' ? 'Admin' : 
                   currentRole === 'Admin' ? 'User' : 'User';

    if (!window.confirm(`¿Cambiar el rol de "${user.name}" de ${currentRole} a ${newRole}?`)) {
      return;
    }

    // Evitar que el SuperUser cambie su propio rol
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
      
      if (error.response?.status === 401) {
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('No tienes permisos para cambiar roles de usuario.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al cambiar el rol del usuario');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    const user = users.find(u => u._id === userId);
    if (!user) return;

    // Evitar que el SuperUser se elimine a sí mismo
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
      
      if (error.response?.status === 401) {
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('No tienes permisos para eliminar usuarios.');
      } else if (error.response?.status === 404) {
        toast.error('Usuario no encontrado.');
        fetchUsers(); // Recargar la lista
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al eliminar el usuario');
      }
    }
  };

  const getConnectionStatusMessage = () => {
    const statusMessages = {
      checking: { text: '🔄 Cargando usuarios...', className: 'status-checking' },
      connected: { text: `✅ ${users.length} usuarios cargados`, className: 'status-connected' },
      network_error: { text: '🌐 Error de conexión', className: 'status-error' },
      auth_error: { text: '🔐 Error de autenticación', className: 'status-error' },
      access_denied: { text: '🚫 Acceso denegado', className: 'status-warning' },
      error: { text: '❌ Error al cargar usuarios', className: 'status-error' },
    };
    
    return statusMessages[connectionStatus] || statusMessages.error;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'SuperUser':
        return <SupervisedUserCircle className="role-icon superuser" />;
      case 'Admin':
        return <AdminPanelSettings className="role-icon admin" />;
      default:
        return <Person className="role-icon user" />;
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
          <span className="loading-spinner"></span>
          Cargando usuarios...
        </div>
      </div>
    );
  }

  const statusInfo = getConnectionStatusMessage();

  return (
    <div className="manage-users-container">
      {/* Header */}
      <div className="manage-users-header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={() => navigate('/admin')}
          >
            <ArrowBack />
            Volver al Panel
          </button>
          <h1 className="page-title">Gestión de Usuarios</h1>
          <p className="page-subtitle">
            Administra los usuarios registrados en J&L Clean Co.
          </p>
          
          {/* ✅ Información del usuario actual */}
          <div className="user-info">
            <span>SuperUser: {currentUser?.name} ({currentUser?.email})</span>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className={`connection-status ${statusInfo.className}`}>
        <span className="status-indicator"></span>
        {statusInfo.text}
      </div>

      {(connectionStatus === 'error' || connectionStatus === 'network_error') && (
        <button 
          onClick={fetchUsers}
          className="retry-button"
        >
          🔄 Reintentar conexión
        </button>
      )}

      {/* Users Table */}
      {connectionStatus === 'connected' && users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Person />
          </div>
          <h3 className="empty-title">No hay usuarios registrados</h3>
          <p className="empty-description">
            Los usuarios aparecerán aquí una vez que se registren en la plataforma.
          </p>
        </div>
      ) : connectionStatus === 'connected' ? (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th className="user-column">Usuario</th>
                <th className="email-column">Correo Electrónico</th>
                <th className="role-column">Rol</th>
                <th className="status-column">Estado</th>
                <th className="date-column">Fecha Registro</th>
                <th className="actions-column">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className={`user-row ${user._id === currentUser._id ? 'current-user' : ''}`}>
                  <td className="user-cell">
                    <div className="user-info-cell">
                      <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.name}</div>
                        <div className="user-id">ID: {user._id?.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="email-cell">
                    <div className="email">{user.email}</div>
                  </td>
                  <td className="role-cell">
                    <div className="role-display">
                      {getRoleIcon(user.role)}
                      <span className={getRoleBadgeClass(user.role)}>
                        {user.role}
                      </span>
                      {user.role !== 'SuperUser' && (
                        <button 
                          className="change-role-btn"
                          onClick={() => handleChangeUserRole(user._id, user.role)}
                          title={`Cambiar rol de ${user.role}`}
                          disabled={user._id === currentUser._id}
                        >
                          🔄
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="status-cell">
                    <div className="status-display">
                      <span className={`status-badge ${user.isActive !== false ? 'active' : 'inactive'}`}>
                        {user.isActive !== false ? 'Activo' : 'Inactivo'}
                      </span>
                      <button 
                        className="toggle-status-btn"
                        onClick={() => handleToggleUserStatus(user._id, user.isActive !== false)}
                        title={user.isActive !== false ? 'Desactivar usuario' : 'Activar usuario'}
                        disabled={user._id === currentUser._id}
                      >
                        {user.isActive !== false ? <Block /> : <CheckCircle />}
                      </button>
                    </div>
                  </td>
                  <td className="date-cell">
                    <div className="registration-date">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                    </div>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEditUser(user._id)}
                        title="Editar usuario"
                      >
                        <Edit />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteUser(user._id)}
                        title="Eliminar usuario"
                        disabled={user._id === currentUser._id || user.role === 'SuperUser'}
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
          <h3 className="error-title">No se pudieron cargar los usuarios</h3>
          <p className="error-description">
            {connectionStatus === 'network_error' 
              ? 'Verifica que el backend esté ejecutándose correctamente.'
              : 'Ha ocurrido un error al cargar los usuarios.'
            }
          </p>
          <button 
            onClick={fetchUsers}
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
            <p><strong>Total usuarios:</strong> {users.length}</p>
            <p><strong>Estado conexión:</strong> {connectionStatus}</p>
            <p><strong>Usuario actual:</strong> {currentUser?.name} ({currentUser?.role})</p>
            <p><strong>Es SuperUser:</strong> {isSuperUser ? 'Sí' : 'No'}</p>
          </details>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;