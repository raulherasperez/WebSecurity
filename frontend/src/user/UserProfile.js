import React, { useState, useEffect } from 'react';
import './css/UserProfile.css';
import UserProfileEdit from './UserProfileEdit';
import SidebarMenu from '../components/SidebarMenu';
import LogoHomeLink from '../components/LogoHomeLink';
import { useAuth } from '../context/AuthContext';
import { getLogrosDesbloqueados } from '../services/logroService';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const { user, setUser } = useAuth();
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [logros, setLogros] = useState([]);
  const [loadingLogros, setLoadingLogros] = useState(true);
  const [resetMessage, setResetMessage] = useState('');

  useEffect(() => {
    const fetchLogros = async () => {
      if (!user) return;
      setLoadingLogros(true);
      try {
        const token = localStorage.getItem('authToken');
        const desbloqueados = await getLogrosDesbloqueados(token);
        setLogros(desbloqueados.map(l => l.logro || l));
      } catch {
        setError('No se pudieron cargar los logros');
      }
      setLoadingLogros(false);
    };
    fetchLogros();
  }, [user]);

  // ...existing code...
  const handleRequestPasswordReset = async () => {
    setResetMessage('');
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/forgot-password`, { email: user.email });
      setResetMessage('Te hemos enviado un correo para restablecer tu contraseña.');
    } catch {
      setResetMessage('Error al solicitar el cambio de contraseña.');
    }
  };
// ...existing code...

  if (error) return <div>{error}</div>;
  if (!user) return <div>Cargando...</div>;

  if (editMode) {
    return <UserProfileEdit onProfileUpdated={() => setEditMode(false)} />;
  }

  return (
    <>
      <div className="user-profile-container">
        {user.foto && (
          <img
            src={`data:image/jpeg;base64,${user.foto}`}
            alt="Foto de perfil"
            className="user-profile-photo"
          />
        )}
        <h2 className="user-profile-username">{user.username}</h2>
        <p className="user-profile-email">
          <strong>Email:</strong> {user.email}
        </p>
        <button className="user-profile-edit-btn" onClick={() => setEditMode(true)}>
          Editar perfil
        </button>
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            className="user-profile-edit-btn"
            style={{ marginBottom: 10 }}
            onClick={handleRequestPasswordReset}
          >
            Solicitar cambio de contraseña por email
          </button>
          {resetMessage && <div style={{ marginTop: 10, color: '#1976d2' }}>{resetMessage}</div>}
        </div>
        <div className="user-profile-logros">
          <h3>Logros desbloqueados</h3>
          <Link to="/logros" className="user-profile-logros-link">
            Ver todos los logros
          </Link>
          {loadingLogros ? (
            <div>Cargando logros...</div>
          ) : logros.length === 0 ? (
            <div>No has desbloqueado logros aún.</div>
          ) : (
            <ul className="user-profile-logros-list">
              {logros.map(logro => (
                <li key={logro.id} className="user-profile-logro-item">
                  <span>
                    <strong>{logro.nombre}</strong> - {logro.descripcion}
                  </span>
                  {logro.icono && (
                    <img
                      src={logro.icono.startsWith('http') ? logro.icono : `/uploads/${logro.icono}`}
                      alt={logro.nombre}
                      style={{ height: 32, marginLeft: 8 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;