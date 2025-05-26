import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/SidebarMenu.css';
import { useAuth } from '../context/AuthContext';

const SidebarMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <>
      <button
        className="hamburger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 1100,
          fontSize: 28,
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(60,60,60,0.10)'
        }}
        aria-label="Abrir menú"
      >
        ☰
      </button>
      <aside className={`sidebar-menu${isMenuOpen ? ' active' : ''}`}>
        <nav>
          <ul>
            {user ? (
              <>
                <li>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>{user.username}</Link>
                </li>
                <li>
                  <button className="logout-btn" onClick={handleLogout} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '10px', cursor: 'pointer', color: '#c0392b' }}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Iniciar sesión</Link>
                </li>
                <li>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>Registrarse</Link>
                </li>
              </>
            )}
            <li>
              <Link to="/guias" onClick={() => setIsMenuOpen(false)}>Guías</Link>
            </li>
            <li>
              <Link to="/machines" onClick={() => setIsMenuOpen(false)}>Máquinas virtuales</Link>
            </li>
            <li>
              <Link to="/glosario" onClick={() => setIsMenuOpen(false)}>Glosario</Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SidebarMenu;