import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './WelcomeMessage.css';

const WelcomeMessage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  // Función para obtener las iniciales del usuario
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Función para obtener el nombre de usuario (username o email)
  const getUserDisplayName = () => {
    return user.username || user.email?.split('@')[0] || 'Usuario';
  };

  return (
    <div className="welcome-message">
      <div className="welcome-avatar">
        <div className="avatar-circle">
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" className="avatar-image" />
          ) : (
            <span className="avatar-initials">{getInitials(user.username || user.email)}</span>
          )}
        </div>
      </div>
      <div className="welcome-content">
        <h2 className="welcome-title">
          ¡Bienvenido, {getUserDisplayName()}!
        </h2>
        <p className="welcome-subtitle">
          Es un placer tenerte de vuelta en J&L Clean Co.
        </p>
      </div>
    </div>
  );
};

export default WelcomeMessage;
