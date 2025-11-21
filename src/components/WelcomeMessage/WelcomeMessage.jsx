import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiSunrise } from 'react-icons/fi';
import './WelcomeMessage.css';

const WelcomeMessage = () => {
  const { user, isAuthenticated } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Buenos días');
      setIcon(<FiSunrise className="greeting-icon" />);
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Buenas tardes');
      setIcon(<FiSun className="greeting-icon" />);
    } else {
      setGreeting('Buenas noches');
      setIcon(<FiMoon className="greeting-icon" />);
    }
  }, []);

  if (!isAuthenticated || !user) {
    return null;
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    return user.username || user.email?.split('@')[0] || 'Usuario';
  };

  return (
    <motion.div 
      className="welcome-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="welcome-avatar-container">
        <div className="avatar-ring">
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" className="avatar-img" />
          ) : (
            <div className="avatar-placeholder">
              {getInitials(user.username || user.email)}
            </div>
          )}
        </div>
      </div>
      
      <div className="welcome-text-content">
        <div className="greeting-wrapper">
          {icon}
          <h2 className="greeting-title">
            {greeting}, <span className="user-name">{getUserDisplayName()}</span>
          </h2>
        </div>
        <p className="welcome-subtitle">
          Nos alegra verte de nuevo en J&L Clean Co.
        </p>
      </div>
    </motion.div>
  );
};

export default WelcomeMessage;
