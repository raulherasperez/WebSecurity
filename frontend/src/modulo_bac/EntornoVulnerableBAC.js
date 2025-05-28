import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import './css/EntornoVulnerableBAC.css';

const API_URL = 'http://localhost:5001';

function EntornoVulnerableBAC() {
  const navigate = useNavigate();
  const { id: urlUserId } = useParams();
  const location = useLocation();

  const [loginUser, setLoginUser] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(null); // null = no comprobado aún
  const [perfil, setPerfil] = useState(null);
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Al montar, comprobar si hay sesión activa
  useEffect(() => {
    fetch(`${API_URL}/whoami`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setLoggedIn(true);
          setLoginUser(data.usuario);
          setUserId(data.id);
        } else {
          setLoggedIn(false);
        }
      })
      .catch(() => setLoggedIn(false));
    // eslint-disable-next-line
  }, []);

  // Si ya está logueado y la URL no tiene id, redirige a su perfil
  useEffect(() => {
    if (loggedIn && !urlUserId && userId) {
      navigate(`/modulo/bac/entorno/${userId}`, { replace: true });
    }
    // eslint-disable-next-line
  }, [loggedIn, userId]);

  // Login
  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    setMensaje('');
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
        body: `usuario=${encodeURIComponent(loginUser)}&password=${encodeURIComponent(password)}`
      });
      const data = await res.json();
      if (data.success) {
        setLoggedIn(true);
        setUserId(data.id);
        setMensaje('');
        setPassword('');
        navigate(`/modulo/bac/entorno/${data.id}`);
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch {
      setError('No se pudo conectar con el backend');
    }
  };

  // Cargar perfil según el id de la URL
  useEffect(() => {
    if (loggedIn && urlUserId) {
      fetch(`${API_URL}/perfil?id=${encodeURIComponent(urlUserId)}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setPerfil(null);
            setError(data.error);
          } else {
            setPerfil(data);
            setNuevoEmail(data.email);
            setError('');
            // Mostrar modal si accede a otro perfil distinto al suyo
            if (userId && String(userId) !== String(urlUserId)) {
              setShowModal(true);
            } else {
              setShowModal(false);
            }
          }
        })
        .catch(() => setError('No se pudo cargar el perfil'));
    }
  }, [loggedIn, urlUserId, userId]);

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      const res = await fetch(`${API_URL}/perfil?id=${encodeURIComponent(urlUserId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
        body: `email=${encodeURIComponent(nuevoEmail)}`
      });
      const data = await res.json();
      if (data.success) {
        setMensaje('Perfil actualizado correctamente.');
        setPerfil(prev => ({ ...prev, email: nuevoEmail }));
      } else {
        setError(data.error || 'Error al actualizar el perfil');
      }
    } catch {
      setError('No se pudo conectar con el backend');
    }
  };

  // Mientras se comprueba la sesión, no mostrar nada
  if (loggedIn === null) return null;

  if (!loggedIn) {
    return (
      <div className="bac-container">
        <h2>Iniciar sesión</h2>
        <form className="bac-login-form" onSubmit={handleLogin}>
          <div className="bac-perfil-row">
            <label>Usuario:</label>
            <input
              type="text"
              value={loginUser}
              onChange={e => setLoginUser(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="bac-perfil-row">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Entrar</button>
        </form>
        {error && <div className="bac-mensaje bac-error">{error}</div>}
      </div>
    );
  }

  // Si está logueado pero no hay id en la URL, redirige a su propio perfil
  if (loggedIn && !urlUserId && userId) {
    return <Navigate to={`/modulo/bac/entorno/${userId}`} replace />;
  }

  return (
    <div className="bac-container">
      <h2>Perfil de usuario</h2>
      <div className="bac-url-bar" style={{ marginBottom: 18, color: '#666', fontSize: '0.98em' }}>
        URL: <code>{location.pathname}</code>
      </div>
      {perfil && (
        <form className="bac-perfil-form" onSubmit={handleSubmit}>
          <div className="bac-perfil-row">
            <label>ID:</label>
            <span>{perfil.id}</span>
          </div>
          <div className="bac-perfil-row">
            <label>Nombre:</label>
            <span>{perfil.nombre}</span>
          </div>
          <div className="bac-perfil-row">
            <label>Email:</label>
            <input
              type="email"
              value={nuevoEmail}
              onChange={e => setNuevoEmail(e.target.value)}
              required
            />
          </div>
          <div className="bac-perfil-row">
            <label>Ciudad:</label>
            <span>{perfil.ciudad}</span>
          </div>
          <div className="bac-perfil-row">
            <label>Fecha de registro:</label>
            <span>{perfil.fecha_registro}</span>
          </div>
          <button type="submit">Actualizar perfil</button>
        </form>
      )}
      {mensaje && <div className="bac-mensaje">{mensaje}</div>}
      {error && <div className="bac-mensaje bac-error">{error}</div>}

      {/* Modal BAC */}
      {showModal && (
        <div className="bac-modal-overlay">
          <div className="bac-modal">
            <h3>¡Ejercicio completado!</h3>
            <p>
              Has accedido al perfil de otro usuario manipulando la URL.<br />
              Esto demuestra un caso de Broken Access Control.
            </p>
            <button className="sandbox-button" onClick={() => setShowModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EntornoVulnerableBAC;