import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter, 
  FiCalendar, 
  FiDollarSign, 
  FiUser, 
  FiPackage,
  FiArrowLeft,
  FiEye
} from 'react-icons/fi';
import api from "../../services/api";
import Modal from '../../components/Modal/Modal';
import './Sales.css';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(userData.role || '');
    fetchSales();
    if (userData.role === 'Admin' || userData.role === 'SuperUser') {
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    filterSales();
  }, [sales, searchId, userFilter]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      let response;
      
      if (userData.role === 'Admin' || userData.role === 'SuperUser') {
        response = await api.get('/sales', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await api.get('/sales/my-sales', {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Error al cargar las ventas');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filterSales = () => {
    let filtered = sales;
    if (searchId.trim()) {
      filtered = filtered.filter(sale => 
        (sale._id || sale.id || '').toLowerCase().includes(searchId.toLowerCase())
      );
    }
    if (userFilter && (userRole === 'Admin' || userRole === 'SuperUser')) {
      filtered = filtered.filter(sale => 
        (sale.user?._id || sale.user?.id) === userFilter
      );
    }
    setFilteredSales(filtered);
  };

  const handleDetail = (sale) => {
    setSelectedSale(sale);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSale(null);
  };

  const shouldShowUserFilter = userRole === 'Admin' || userRole === 'SuperUser';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="sales-container">
      <motion.div 
        className="sales-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button className="back-btn" onClick={() => navigate('/admin')}>
          <FiArrowLeft /> Volver al Panel
        </button>
        <h1 className="page-title">
          {userRole === 'Admin' || userRole === 'SuperUser' ? 'Gestión de Ventas' : 'Mis Compras'}
        </h1>
        <p className="page-subtitle">
          {userRole === 'Admin' || userRole === 'SuperUser' 
            ? 'Supervisa y administra todas las transacciones' 
            : 'Historial de tus pedidos y transacciones'}
        </p>
      </motion.div>
      
      <motion.div 
        className="filters-card glass-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por ID de venta..."
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            className="search-input"
          />
        </div>
        
        {shouldShowUserFilter && (
          <div className="filter-wrapper">
            <FiUser className="filter-icon" />
            <select
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los usuarios</option>
              {users.map(user => (
                <option key={user._id || user.id} value={user._id || user.id}>
                  {user.username || user.name || user.email}
                </option>
              ))}
            </select>
          </div>
        )}
      </motion.div>
      
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando transacciones...</p>
        </div>
      ) : (
        <motion.div 
          className="sales-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredSales.length === 0 ? (
              <motion.div 
                className="empty-state glass-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="empty-icon-wrapper">
                  <FiPackage />
                </div>
                <h3>No se encontraron ventas</h3>
                <p>Intenta ajustar los filtros de búsqueda</p>
              </motion.div>
            ) : (
              filteredSales.map(sale => (
                <motion.div 
                  key={sale._id || sale.id}
                  className="sale-card glass-card-hover"
                  variants={itemVariants}
                  layout
                >
                  <div className="sale-card-header">
                    <span className="sale-id">#{ (sale._id || sale.id).substring(0, 8) }</span>
                    <span className="sale-date">
                      <FiCalendar />
                      {sale.date ? new Date(sale.date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="sale-card-body">
                    {shouldShowUserFilter && (
                      <div className="sale-user">
                        <div className="user-avatar">
                          <FiUser />
                        </div>
                        <div className="user-info">
                          <span className="user-name">
                            {sale.user?.username || sale.user?.name || 'Usuario desconocido'}
                          </span>
                          <span className="user-email">{sale.user?.email}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="sale-total">
                      <span className="total-label">Total</span>
                      <span className="total-amount">
                        <FiDollarSign />
                        {sale.total?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>

                  <div className="sale-card-footer">
                    <button 
                      className="details-btn" 
                      onClick={() => handleDetail(sale)}
                    >
                      <FiEye /> Ver Detalles
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      )}
      
      {/* Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={`Detalle de Venta #${selectedSale ? (selectedSale._id || selectedSale.id).substring(0, 8) : ''}`}
        size="medium"
      >
        {selectedSale && (
          <div className="sale-detail-content">
            <div className="detail-header-info">
              <div className="info-group">
                <label>Fecha</label>
                <p>{selectedSale.date ? new Date(selectedSale.date).toLocaleString() : 'N/A'}</p>
              </div>
              <div className="info-group">
                <label>Total</label>
                <p className="highlight-price">${selectedSale.total?.toFixed(2) || '0.00'}</p>
              </div>
              {shouldShowUserFilter && (
                <div className="info-group">
                  <label>Cliente</label>
                  <p>{selectedSale.user?.username || selectedSale.user?.name || 'N/A'}</p>
                  <small>{selectedSale.user?.email}</small>
                </div>
              )}
            </div>

            <div className="products-list-section">
              <h3>Productos ({selectedSale.products?.length || 0})</h3>
              <div className="products-scroll">
                {selectedSale.products && selectedSale.products.length > 0 ? (
                  selectedSale.products.map((item, idx) => (
                    <div key={idx} className="product-list-item">
                      <div className="product-icon">
                        <FiPackage />
                      </div>
                      <div className="product-info">
                        <h4>{item.product?.name || item.name || 'Producto'}</h4>
                        <p>Cantidad: {item.quantity}</p>
                      </div>
                      <div className="product-price">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-products">No hay productos en esta venta.</p>
                )}
              </div>
            </div>

            <div className="modal-footer-actions">
              <button onClick={closeModal} className="modal-btn primary full-width">
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Sales;