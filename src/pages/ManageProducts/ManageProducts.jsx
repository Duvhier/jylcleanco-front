import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Edit, Delete, Add } from '@mui/icons-material';
import './ManageProducts.css';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Producto eliminado');
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  };

  return (
    <div className="manage-products-container">
      <div className="manage-products-header">
        <h1>Gestionar Productos</h1>
        <button className="add-product-btn" onClick={() => navigate('/admin/add-product')}>
          <Add /> Agregar Producto
        </button>
      </div>
      {loading ? (
        <div className="loading">Cargando productos...</div>
      ) : products.length === 0 ? (
        <div className="empty">No hay productos registrados.</div>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="product-img" />
                  ) : (
                    <span>Sin imagen</span>
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(product._id)}>
                    <Edit />
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                    <Delete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageProducts; 