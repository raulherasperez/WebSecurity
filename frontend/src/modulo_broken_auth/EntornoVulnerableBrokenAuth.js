import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_VULNERABLE_URL;

function EntornoVulnerableBrokenAuth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleLogin = async e => {
    e.preventDefault();
    setMensaje('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/brokenauth-login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setUsuarioLogueado(data.user);
        setMensaje('¡Login correcto! Has accedido como ' + data.user);
        setShowSuccessModal(true);
      } else {
        setUsuarioLogueado(null);
        setMensaje(data.error || 'Error desconocido');
      }
    } catch (err) {
      setMensaje('Error de conexión con el servidor');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setUsuarioLogueado(null);
    setMensaje('Has cerrado sesión.');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="brokenauth-entorno" style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
      <h2 style={{ marginBottom: 18 }}>Login vulnerable</h2>
      {usuarioLogueado ? (
        <div>
          <p style={{ color: '#27ae60', fontWeight: 600 }}>¡Bienvenido, {usuarioLogueado}!</p>
          <button className="sandbox-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 12 }}>
            <label>Usuario:</label>
            <input
              type="text"
              value={username}
              autoComplete="username"
              onChange={e => setUsername(e.target.value)}
              style={{ width: '100%', padding: 6, marginTop: 4 }}
              required
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: 6, marginTop: 4 }}
              required
            />
          </div>
          <button
            className="sandbox-button"
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading ? 'Comprobando...' : 'Iniciar sesión'}
          </button>
        </form>
      )}
      {mensaje && (
        <div style={{ marginTop: 18, color: usuarioLogueado ? '#27ae60' : '#e53935', fontWeight: 500 }}>
          {mensaje}
        </div>
      )}

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: 32,
            boxShadow: '0 4px 24px #0003',
            textAlign: 'center',
            minWidth: 280
          }}>
            <h3 style={{ color: '#27ae60', marginBottom: 12 }}>¡Login exitoso!</h3>
            <p>Has accedido correctamente como <b>{usuarioLogueado}</b>.</p>
            <button
              className="sandbox-button"
              style={{ marginTop: 18 }}
              onClick={() => setShowSuccessModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EntornoVulnerableBrokenAuth;