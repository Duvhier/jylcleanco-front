import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiInstagram, 
  FiFacebook, 
  FiTwitter, 
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiHeart
} from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-section brand-section">
            <motion.div 
              className="footer-logo"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>J&L Clean Co.</h2>
            </motion.div>
            <p className="footer-description">
              Tu aliado confiable en productos de limpieza de alta calidad. 
              Haciendo que tu hogar brille con frescura y pureza.
            </p>
            <div className="social-links">
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, color: '#E1306C' }}
                whileTap={{ scale: 0.9 }}
              >
                <FiInstagram />
              </motion.a>
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, color: '#1877F2' }}
                whileTap={{ scale: 0.9 }}
              >
                <FiFacebook />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, color: '#1DA1F2' }}
                whileTap={{ scale: 0.9 }}
              >
                <FiTwitter />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Enlaces Rápidos</h3>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/products">Productos</Link></li>
              <li><Link to="/login">Iniciar Sesión</Link></li>
              <li><Link to="/register">Registrarse</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3>Contáctanos</h3>
            <ul className="contact-info">
              <li>
                <FiMapPin className="contact-icon" />
                <span>Calle Principal #123, Ciudad</span>
              </li>
              <li>
                <FiPhone className="contact-icon" />
                <span>+57 300 123 4567</span>
              </li>
              <li>
                <FiMail className="contact-icon" />
                <span>contacto@jylclean.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter (Visual only for now) */}
          <div className="footer-section">
            <h3>Boletín</h3>
            <p>Suscríbete para recibir ofertas especiales.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Tu correo electrónico" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Suscribirse
              </motion.button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {currentYear} J&L Clean Co. Todos los derechos reservados.
          </p>
          <p className="made-with">
            Hecho con <FiHeart className="heart-icon" /> por J&L Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
