import React from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeMessage from '../../components/WelcomeMessage';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Welcome Message */}
      <WelcomeMessage />
      
      {/* Hero Section */}
      <section className="hero-section glass-card">
        <div className="hero-content">
          <h1 className="hero-title">J&L Clean Co.</h1>
          <p className="hero-subtitle">
            Productos de limpieza profesionales para el cuidado de tu hogar. 
            Calidad, eficiencia y frescura en cada producto.
          </p>
        </div>
        <div className="hero-image">
          <img src="/images/jylclean.png" alt="J&L Clean Co. Logo" />
        </div>
      </section>

      {/* About Section */}
      <section className="content-section glass-card">
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
      </section>

      {/* Services Section */}
      <section className="content-section glass-card reverse">
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
      </section>

      {/* Products Section */}
      <section className="products-section glass-card">
        <h2 className="products-title">Nuestros Productos Destacados</h2>
        <p className="products-subtitle">
          Descubre nuestra selección de productos más populares, diseñados para satisfacer 
          todas tus necesidades de limpieza y cuidado del hogar.
        </p>
        
        <div className="products-grid">
          <div className="product-card" onClick={() => navigate('/products')}>
            <img src="/images/aceites.jpg" alt="Aceites Esenciales" className="product-image" />
            <div className="product-info">
              <h3 className="product-name">Aceites Esenciales</h3>
              <p className="product-description">
                Productos naturales para el cuidado personal y aromaterapia
              </p>
            </div>
          </div>
          
          <div className="product-card" onClick={() => navigate('/products')}>
            <img src="/images/cremas.jpg" alt="Cremas Hidratantes" className="product-image" />
            <div className="product-info">
              <h3 className="product-name">Cremas Hidratantes</h3>
              <p className="product-description">
                Hidratación profunda y cuidado especializado para tu piel
              </p>
            </div>
          </div>
          
          <div className="product-card" onClick={() => navigate('/products')}>
            <img src="/images/ambientador.jpg" alt="Ambientadores" className="product-image" />
            <div className="product-info">
              <h3 className="product-name">Ambientadores</h3>
              <p className="product-description">
                Fragancias frescas y duraderas para crear ambientes agradables
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section glass-card">
        <h2 className="cta-title">¿Listo para descubrir más?</h2>
        <p className="cta-subtitle">
          Explora nuestro catálogo completo de productos y encuentra todo lo que necesitas 
          para mantener tu hogar limpio, fresco y acogedor.
        </p>
        <button className="cta-button" onClick={() => navigate('/products')}>
          Ver Todos los Productos
        </button>
      </section>
    </div>
  );
};

export default Home;
