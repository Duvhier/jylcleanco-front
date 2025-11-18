import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowBack, CloudUpload, Save, Clear } from '@mui/icons-material';
import { productsAPI } from '../../services/api'; // ✅ Usar API específica
import { useAuth } from '../../contexts/AuthContext'; // ✅ Para verificar permisos
import './EditProduct.css';

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isSuperUser } = useAuth(); // ✅ Verificar permisos
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: ''
  });
  const [initialData, setInitialData] = useState(null);

  const categories = [
    'Limpieza General',
    'Desinfectantes', 
    'Lavandería',
    'Especializados',
    'Aromatizantes',
    'Cuidado Personal'
  ];

  // ✅ Verificar permisos - Solo Admin y SuperUser pueden editar productos
  if (!isAdmin && !isSuperUser) {
    return (
      <div className="edit-product-container">
        <div className="access-denied">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para editar productos.</p>
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

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setFetching(true);
    try {
      const response = await productsAPI.getById(productId);
      
      if (response.data.success) {
        const product = response.data.data;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          stock: product.stock || '',
          category: product.category || '',
          image: product.image || ''
        });
        setInitialData(product);
      } else {
        toast.error('Producto no encontrado');
        navigate('/admin/manage-products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      
      if (error.response?.status === 404) {
        toast.error('Producto no encontrado');
      } else if (error.response?.status === 401) {
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        navigate('/login');
      } else {
        toast.error('Error al cargar el producto');
      }
      navigate('/admin/manage-products');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUrlChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      image: value
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
        image: formData.image.trim()
      };
      
      const response = await productsAPI.update(productId, productData);
      
      if (response.data.success) {
        toast.success('✅ Producto actualizado exitosamente');
        navigate('/admin/manage-products');
      } else {
        toast.error(response.data.message || 'Error al actualizar el producto');
      }
      
    } catch (error) {
      console.error('Error updating product:', error);
      
      if (error.response?.status === 401) {
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('No tienes permisos para editar productos');
      } else if (error.response?.status === 404) {
        toast.error('Producto no encontrado');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al actualizar el producto');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        stock: initialData.stock || '',
        category: initialData.category || '',
        image: initialData.image || ''
      });
      toast.info('Formulario restaurado a los valores originales');
    }
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

  const handleImageUrlBlur = async (e) => {
    const url = e.target.value;
    
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

  if (fetching) {
    return (
      <div className="edit-product-container">
        <div className="loading-state">
          <span className="loading-spinner"></span>
          Cargando producto...
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-container">
      <div className="edit-product-header">
        <button 
          className="back-button"
          onClick={() => navigate('/admin/manage-products')}
          disabled={loading}
        >
          <ArrowBack />
          Volver a Gestión
        </button>
        <h1 className="edit-product-title">Editar Producto</h1>
        <p className="edit-product-subtitle">
          Modifica la información del producto y guarda los cambios
        </p>
        
        {/* ✅ Información del usuario actual */}
        <div className="user-info">
          <span>Editando como: {user?.name} ({user?.role})</span>
        </div>
      </div>

      <div className="edit-product-form-container">
        <form onSubmit={handleSubmit} className="edit-product-form">
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
                  onBlur={handleImageUrlBlur}
                  className="form-input"
                  placeholder="Pega aquí la URL de la imagen"
                  required
                  disabled={loading}
                />
                <small className="help-text">
                  Ej: https://ejemplo.com/imagen.jpg
                </small>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleClear}
              className="action-button secondary"
              disabled={loading || !initialData}
            >
              <Clear />
              Restaurar
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
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Debug Info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <details>
            <summary>Información de Debug</summary>
            <p><strong>Product ID:</strong> {productId}</p>
            <p><strong>Usuario:</strong> {user?.name} ({user?.role})</p>
            <p><strong>Permisos:</strong> Admin: {isAdmin ? 'Sí' : 'No'}, SuperUser: {isSuperUser ? 'Sí' : 'No'}</p>
            <p><strong>Datos cargados:</strong> {initialData ? 'Sí' : 'No'}</p>
          </details>
        </div>
      )}
    </div>
  );
};

export default EditProduct;