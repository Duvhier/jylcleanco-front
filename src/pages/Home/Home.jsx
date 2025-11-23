import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import WelcomeMessage from '../../components/WelcomeMessage/WelcomeMessage';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="home-container">
      {/* Welcome Message */}
      <WelcomeMessage />
      
      {/* Hero Section */}
      <motion.section 
        className="hero-section glass-card"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="hero-content">
          <motion.h1 className="hero-title" variants={fadeInUp}>
            J&L Clean Co.
          </motion.h1>
          <motion.p className="hero-subtitle" variants={fadeInUp}>
            Productos de limpieza profesionales para el cuidado de tu hogar. 
            Calidad, eficiencia y frescura en cada producto.
          </motion.p>
          <motion.button 
            className="cta-button primary"
            variants={fadeInUp}
            onClick={() => navigate('/products')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Catálogo
          </motion.button>
        </div>
        <motion.div 
          className="hero-image"
          variants={fadeInUp}
        >
          <img src="/images/jylclean.png" alt="J&L Clean Co. Logo" />
        </motion.div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        className="content-section glass-card"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="content-text">
          <h2 className="content-title">Nuestra Empresa</h2>
          <p className="content-subtitle">
            Está dedicada a la elaboración y fabricación de productos de aseo de la más alta calidad. 
            Con años de experiencia en el mercado, garantizamos productos que cuidan tu hogar y tu familia.
          </p>
        </div>
        <div className="content-image">
          <img src="/images/jabones.jpg" alt="Productos de Limpieza" />
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        className="content-section glass-card reverse"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="content-text">
          <h2 className="content-title">Limpieza Profesional</h2>
          <p className="content-subtitle">
            Ofrecemos una amplia gama de productos para la limpieza y cuidado del hogar. 
            Desde jabones hasta ambientadores, todos diseñados para brindar la mejor experiencia de limpieza.
          </p>
        </div>
        <div className="content-image">
          <img src="/images/online.png" alt="Tienda Online" />
        </div>
      </motion.section>

      {/* Products Section */}
      <motion.section 
        className="products-section glass-card"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h2 className="products-title" variants={fadeInUp}>
          Nuestros Productos Destacados
        </motion.h2>
        <motion.p className="products-subtitle" variants={fadeInUp}>
          Descubre nuestra selección de productos más populares, diseñados para satisfacer 
          todas tus necesidades de limpieza y cuidado del hogar.
        </motion.p>
        
        <div className="products-grid">
          {[
            { img: "/images/aceites.jpg", title: "Aceites Esenciales", desc: "Productos naturales para el cuidado personal y aromaterapia" },
            { img: "/images/cremas.jpg", title: "Cremas Hidratantes", desc: "Hidratación profunda y cuidado especializado para tu piel" },
            { img: "/images/ambientador.jpg", title: "Ambientadores", desc: "Fragancias frescas y duraderas para crear ambientes agradables" }
          ].map((product, index) => (
            <motion.div 
              key={index}
              className="product-card"
              variants={fadeInUp}
              onClick={() => navigate('/products')}
              whileHover={{ y: -10 }}
            >
              <img src={product.img} alt={product.title} className="product-image" />
              <div className="product-info">
                <h3 className="product-name">{product.title}</h3>
                <p className="product-description">{product.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
