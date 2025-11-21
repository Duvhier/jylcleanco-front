// src/pages/Cart/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrash2, 
  FiMinus, 
  FiPlus, 
  FiShoppingBag, 
  FiArrowRight,
  FiAlertCircle
} from 'react-icons/fi';
import { cartAPI, salesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get();
      if (response.data.success) {
        setCart(response.data.data || { items: [], total: 0 });
      } else {
        setCart({ items: [], total: 0 });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      if (error.response?.status === 404) {
        setCart({ items: [], total: 0 });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    // Optimistic update
    const oldCart = { ...cart };
    const updatedItems = cart.items.map(item => {
      if ((item.productId?._id || item.productId) === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    // Recalculate total roughly
    const newTotal = updatedItems.reduce((sum, item) => {
      const price = item.price || item.productId?.price || 0;
      return sum + (price * item.quantity);
    }, 0);

    setCart({ ...cart, items: updatedItems, total: newTotal });

    try {
      await cartAPI.update(productId, { quantity: newQuantity });
      await fetchCart(); // Sync with server to be sure
    } catch (error) {
      setCart(oldCart); // Revert on error
      toast.error(error.response?.data?.message || 'Error al actualizar cantidad');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartAPI.remove(productId);
      const newItems = cart.items.filter(item => (item.productId?._id || item.productId) !== productId);
      
      // Recalculate total roughly
      const newTotal = newItems.reduce((sum, item) => {
        const price = item.price || item.productId?.price || 0;
        return sum + (price * item.quantity);
      }, 0);

      setCart({ ...cart, items: newItems, total: newTotal });
      toast.success('Producto eliminado');
      await fetchCart(); // Sync
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  const handleClearCart = async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [], total: 0 });
      setShowClearConfirm(false);
      toast.success('Carrito vaciado');
    } catch (error) {
      toast.error('Error al vaciar el carrito');
    }
  };

  const handleCheckout = async () => {
    if (!cart.items?.length) return;

    // Check stock
    const outOfStock = cart.items.filter(item => item.quantity > (item.product?.stock || 0));
    if (outOfStock.length > 0) {
      toast.error('Algunos productos no tienen suficiente stock');
      return;
    }

    setIsCheckingOut(true);
    try {
      await salesAPI.create({});
      setCart({ items: [], total: 0 });
      toast.success('¡Compra realizada con éxito!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar la compra');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="cart-loading">
          <div className="spinner"></div>
          <p>Cargando tu carrito...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="cart-container">
        <motion.div 
          className="cart-empty-state glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FiShoppingBag className="empty-icon" />
          <h2>Inicia sesión para ver tu carrito</h2>
          <p>Guarda tus productos favoritos y agiliza tu compra.</p>
          <button onClick={() => navigate('/login')} className="primary-btn">
            Iniciar Sesión
          </button>
        </motion.div>
      </div>
    );
  }

  if (!cart.items?.length) {
    return (
      <div className="cart-container">
        <motion.div 
          className="cart-empty-state glass-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="empty-icon-wrapper">
            <FiShoppingBag />
          </div>
          <h2>Tu carrito está vacío</h2>
          <p>¡Explora nuestros productos y encuentra algo que te encante!</p>
          <button onClick={() => navigate('/products')} className="primary-btn">
            Ver Productos
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <motion.h1 
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Tu Carrito de Compras
      </motion.h1>

      <div className="cart-layout">
        <div className="cart-items-section">
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.div 
                key={item.productId?._id || item._id}
                className="cart-item glass-card"
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="item-image">
                  <img 
                    src={item.image || item.productId?.image || '/placeholder.png'} 
                    alt={item.name || item.productId?.name}
                    onError={(e) => e.target.src = '/images/placeholder-product.jpg'}
                  />
                </div>
                
                <div className="item-details">
                  <h3>{item.name || item.productId?.name}</h3>
                  <p className="item-price">${(item.price || item.productId?.price)?.toFixed(2)}</p>
                  {item.productId?.stock < item.quantity && (
                    <span className="stock-warning">
                      <FiAlertCircle /> Stock insuficiente
                    </span>
                  )}
                </div>

                <div className="item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleUpdateQuantity(item.productId?._id || item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.productId?._id || item.productId, item.quantity + 1)}
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <div className="item-subtotal">
                    ${((item.price || item.productId?.price) * item.quantity).toFixed(2)}
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.productId?._id || item.productId)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <motion.div 
            className="cart-actions-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button 
              className="clear-cart-btn"
              onClick={() => setShowClearConfirm(true)}
            >
              Vaciar Carrito
            </button>
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/products')}
            >
              Seguir Comprando
            </button>
          </motion.div>
        </div>

        <motion.div 
          className="cart-summary-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="summary-card glass-card">
            <h2>Resumen del Pedido</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-total">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            
            <button 
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={isCheckingOut || cart.items.length === 0}
            >
              {isCheckingOut ? (
                <span className="spinner-small"></span>
              ) : (
                <>
                  Proceder al Pago <FiArrowRight />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content glass-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>¿Vaciar carrito?</h3>
            <p>¿Estás seguro de que quieres eliminar todos los productos?</p>
            <div className="modal-actions">
              <button onClick={() => setShowClearConfirm(false)} className="cancel-btn">
                Cancelar
              </button>
              <button onClick={handleClearCart} className="confirm-btn">
                Sí, vaciar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Cart;