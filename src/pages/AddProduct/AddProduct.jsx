import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  ArrowBack,
  CloudUpload,
  Save,
  Clear
} from '@mui/icons-material';
import './AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: ''
  });

  const categories = [
    'Jabones',
    'Cremas',
    'Aceites',
    'Ambientadores',
    'Velas',
    'Otros'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { name, description, price, stock, category, imageUrl } = formData;
    
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

    if (!imageUrl.trim()) {
      toast.error('La URL de la imagen es requerida');
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
        image: formData.imageUrl // Solo la URL
      };
      
      await axios.post('http://localhost:5000/api/products', productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Producto agregado exitosamente');
      navigate('/products');
      
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'Error al agregar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      imageUrl: ''
    });
    toast.info('Formulario limpiado');
  };

  return (
    <div className="add-product-container">
      <div className="add-product-header">
        <button 
          className="back-button"
          onClick={() => navigate('/admin')}
        >
          <ArrowBack />
          Volver al Panel
        </button>
        <h1 className="add-product-title">Agregar Nuevo Producto</h1>
        <p className="add-product-subtitle">
          Completa la información del producto para agregarlo al catálogo
        </p>
      </div>

      <div className="add-product-form-container">
        <form onSubmit={handleSubmit} className="add-product-form">
          {/* Información Básica */}
          <div className="form-section">
            <h3 className="section-title">Información Básica</h3>
            
            <div className="form-group">
              <label className="form-label">Nombre del Producto *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: Jabón de Lavanda Natural"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Describe las características y beneficios del producto..."
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Categoría *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
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
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-input price-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Stock Disponible *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Imagen del Producto */}
          <div className="form-section">
            <h3 className="section-title">Imagen del Producto</h3>
            <div className="image-upload-container">
              <div className="image-preview">
                {formData.imageUrl ? (
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="preview-image"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <CloudUpload className="upload-icon" />
                    <p>Sin imagen seleccionada</p>
                  </div>
                )}
              </div>
              <div className="upload-controls">
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Pega aquí la URL de la imagen"
                  required
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleClear}
              className="action-button secondary"
              disabled={loading}
            >
              <Clear />
              Limpiar
            </button>
            
            <button
              type="submit"
              className="action-button primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save />
                  Guardar Producto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct; 