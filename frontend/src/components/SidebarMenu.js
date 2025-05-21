import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/SidebarMenu.css';

const SidebarMenu = ({ isOpen, onClose }) => {
  const token = localStorage.getItem('authToken');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    onClose && onClose();
    navigate('/login');
  };

  return (
    <aside className={`sidebar-menu${isOpen ? ' active' : ''}`}>
      <nav>
        <ul>
          {token && username ? (
            <>
              <li>
                <Link to="/profile" onClick={onClose}>{username}</Link>
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
                <Link to="/login" onClick={onClose}>Iniciar sesión</Link>
              </li>
              <li>
                <Link to="/register" onClick={onClose}>Registrarse</Link>
              </li>
            </>
          )}
          <li>
            <Link to="/guias" onClick={onClose}>Guías</Link>
          </li>
          <li>
            <Link to="/machines" onClick={onClose}>Máquinas virtuales</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarMenu;