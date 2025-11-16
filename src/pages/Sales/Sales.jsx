import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Sales.css';
import api from "../../services/api";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
    fetchUsers();
  }, []);

  useEffect(() => {
    filterSales();
  }, [sales, searchId, userFilter]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/sales', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSales(response.data);
    } catch (error) {
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
      // No mostrar toast para usuarios
    }
  };

  const filterSales = () => {
    let filtered = sales;
    if (searchId.trim()) {
      filtered = filtered.filter(sale => (sale._id || sale.id || '').toLowerCase().includes(searchId.toLowerCase()));
    }
    if (userFilter) {
      filtered = filtered.filter(sale => (sale.user?._id || sale.user?.id) === userFilter);
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

  return (
    <div className="sales-container">
      <button className="back-admin-btn" onClick={() => navigate('/admin')}>
        ← Volver al Panel Admin
      </button>
      <h1 className="sales-title">Ventas Realizadas</h1>
      <div className="sales-filters">
        <input
          type="text"
          placeholder="Buscar por ID de venta"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          className="sales-filter-input"
        />
        <select
          value={userFilter}
          onChange={e => setUserFilter(e.target.value)}
          className="sales-filter-select"
        >
          <option value="">Todos los usuarios</option>
          {users.map(user => (
            <option key={user._id || user.id} value={user._id || user.id}>
              {user.username || user.name || user.email}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="loading">Cargando ventas...</div>
      ) : (
        <table className="sales-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan="5">No hay ventas registradas.</td>
              </tr>
            ) : (
              filteredSales.map(sale => (
                <tr key={sale._id || sale.id}>
                  <td>{sale._id || sale.id}</td>
                  <td>{sale.user?.username || sale.user?.name || 'N/A'}</td>
                  <td>${sale.total?.toFixed(2) || '0.00'}</td>
                  <td>{sale.date ? new Date(sale.date).toLocaleString() : 'N/A'}</td>
                  <td>
                    <button className="details-btn" onClick={() => handleDetail(sale)}>
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {showModal && selectedSale && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeModal}>×</button>
            <h2>Detalle de la Venta</h2>
            <p><strong>ID:</strong> {selectedSale._id || selectedSale.id}</p>
            <p><strong>Usuario:</strong> {selectedSale.user?.username || selectedSale.user?.name || 'N/A'}</p>
            <p><strong>Correo:</strong> {selectedSale.user?.email || 'N/A'}</p>
            <p><strong>Total:</strong> ${selectedSale.total?.toFixed(2) || '0.00'}</p>
            <p><strong>Fecha:</strong> {selectedSale.date ? new Date(selectedSale.date).toLocaleString() : 'N/A'}</p>
            <h3>Productos:</h3>
            <ul>
              {selectedSale.products && selectedSale.products.length > 0 ? (
                selectedSale.products.map((item, idx) => (
                  <li key={idx}>
                    {item.product?.name || item.name || 'Producto'} x{item.quantity} - ${item.price?.toFixed(2) || '0.00'}
                  </li>
                ))
              ) : (
                <li>No hay productos en esta venta.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales; 