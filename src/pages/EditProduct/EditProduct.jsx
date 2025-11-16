import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ArrowBack, CloudUpload, Save, Clear } from '@mui/icons-material';
import './EditProduct.css';
import api from "../../services/api";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    imageUrl: ''
  });
  const [initialImage, setInitialImage] = useState('');

  const categories = [
    'Jabones',
    'Cremas',
    'Aceites',
    'Ambientadores',
    'Velas',
    'Otros'
  ];

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${productId}`);
      const prod = res.data;
      setFormData({
        name: prod.name || '',
        description: prod.description || '',
        price: prod.price || '',
        stock: prod.stock || '',
        category: prod.category || '',
        image: prod.image || '',
        imageUrl: prod.image || ''
      });
      setInitialImage(prod.image || '');
    } catch (error) {
      toast.error('Error al cargar el producto');
      navigate('/admin/manage-products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        image: file.name,
        imageUrl: imageUrl
      }));
    }
  };

  const validateForm = () => {
    const { name, description, price, stock, category } = formData;
    if (!name.trim()) {
      toast.error('El nombre del producto es requerido');
      return false;
    }
    if (!description.trim()) {
      toast.error('La descripción del producto es requerida');
      return false;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast.error('El precio debe ser un número válido mayor a 0');
      return false;
    }
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) {
      toast.error('El stock debe ser un número válido mayor o igual a 0');
      return false;
    }
    if (!category) {
      toast.error('Debes seleccionar una categoría');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.imageUrl || initialImage
      };
      await api.put(`/products/${productId}`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Producto actualizado exitosamente');
      navigate('/admin/manage-products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    fetchProduct();
    toast.info('Formulario restaurado');
  };

  return (
    <div className="edit-product-container">
      <div className="edit-product-header">
        <button className="back-button" onClick={() => navigate('/admin/manage-products')}>
          <ArrowBack /> Volver a Gestión
        </button>
        <h1 className="edit-product-title">Editar Producto</h1>
        <p className="edit-product-subtitle">Modifica la información del producto y guarda los cambios</p>
      </div>
      <div className="edit-product-form-container">
        <form onSubmit={handleSubmit} className="edit-product-form">
          {/* Información Básica */}
          <div className="form-section">
            <h3 className="section-title">Información Básica</h3>
            <div className="form-group">
              <label className="form-label">Nombre del Producto *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="form-textarea" rows="4" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Categoría *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="form-select" required>
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Precio y Stock */}
          <div className="form-section">
            <h3 className="section-title">Precio y Inventario</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Precio *</label>
                <div className="price-input-container">
                  <span className="currency-symbol">$</span>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-input price-input" step="0.01" min="0" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Stock Disponible *</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="form-input" min="0" required />
              </div>
            </div>
          </div>
          {/* Imagen del Producto */}
          <div className="form-section">
            <h3 className="section-title">Imagen del Producto</h3>
            <div className="image-upload-container">
              <div className="image-preview">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="preview-image" />
                ) : (
                  <div className="upload-placeholder">
                    <CloudUpload className="upload-icon" />
                    <p>Sin imagen seleccionada</p>
                  </div>
                )}
              </div>
              <div className="upload-controls">
                <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" id="image-upload" />
                <label htmlFor="image-upload" className="upload-button">
                  <CloudUpload /> Seleccionar Imagen
                </label>
                {formData.image && (
                  <div className="image-info">
                    <span>Archivo: {formData.image}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Botones de Acción */}
          <div className="form-actions">
            <button type="button" onClick={handleClear} className="action-button secondary" disabled={loading}>
              <Clear /> Restaurar
            </button>
            <button type="submit" className="action-button primary" disabled={loading}>
              {loading ? (<><div className="loading-spinner"></div> Guardando...</>) : (<><Save /> Guardar Cambios</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct; 