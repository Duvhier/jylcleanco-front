// src/pages/AddProduct/AddProduct.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowBack,
  CloudUpload,
  Save,
  Clear
} from '@mui/icons-material';
import { productsAPI } from '../../services/api'; // ✅ Usar API específica
import { useAuth } from '../../contexts/AuthContext'; // ✅ Para verificar permisos
import './AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isSuperUser } = useAuth(); // ✅ Verificar permisos
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '' // ✅ Cambiado de imageUrl a image para coincidir con el backend
  });

  const categories = [
    'Limpieza General',
    'Desinfectantes',
    'Lavandería',
    'Especializados',
    'Aromatizantes',
    'Cuidado Personal'
  ];

  // ✅ Verificar permisos - Solo Admin y SuperUser pueden agregar productos
  if (!isAdmin && !isSuperUser) {
    return (
      <div className="add-product-container">
        <div className="access-denied">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta página.</p>
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            <ArrowBack />
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { name, description, price, stock, category, image } = formData;
    
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

    if (!image.trim()) {
      toast.error('La URL de la imagen es requerida');
      return false;
    }

    // ✅ Validar que la URL sea válida
    try {
      new URL(image);
    } catch (error) {
      toast.error('La URL de la imagen no es válida');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        image: formData.image.trim() // ✅ Usar 'image' en lugar de 'imageUrl'
      };
      
      const response = await productsAPI.create(productData);
      
      if (response.data.success) {
        toast.success('✅ Producto agregado exitosamente');
        navigate('/admin/manage-products');
      } else {
        toast.error(response.data.message || 'Error al agregar el producto');
      }
      
    } catch (error) {
      console.error('Error adding product:', error);
      
      if (error.response?.status === 401) {
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('No tienes permisos para agregar productos');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al agregar el producto');
      }
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
      image: ''
    });
    toast.info('Formulario limpiado');
  };

  // ✅ Función para probar la imagen
  const testImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const handleImageUrlChange = async (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, image: url }));

    // Probar la imagen si la URL no está vacía
    if (url.trim()) {
      try {
        new URL(url); // Validar formato de URL
        const isValid = await testImage(url);
        if (!isValid) {
          toast.warning('⚠️ La URL de la imagen podría no ser válida');
        }
      } catch (error) {
        // URL inválida, se mostrará error en validateForm
      }
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-header">
        <button 
          className="back-button"
          onClick={() => navigate('/admin')}
          disabled={loading}
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
                placeholder="Ej: Jabón Líquido Multiusos"
                required
                disabled={loading}
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
                disabled={loading}
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
                  disabled={loading}
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
                    disabled={loading}
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
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Imagen del Producto */}
          <div className="form-section">
            <h3 className="section-title">Imagen del Producto</h3>
            <div className="image-upload-container">
              <div className="image-preview">
                {formData.image ? (
                  <>
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="preview-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="upload-placeholder" style={{display: 'none'}}>
                      <CloudUpload className="upload-icon" />
                      <p>Error al cargar imagen</p>
                    </div>
                  </>
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
                  name="image"
                  value={formData.image}
                  onChange={handleImageUrlChange}
                  className="form-input"
                  placeholder="Pega aquí la URL de la imagen"
                  required
                  disabled={loading}
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