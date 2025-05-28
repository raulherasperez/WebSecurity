import React, { useState } from 'react';
import './css/EntornoVulnerableCSRF.css';

const API_URL = 'http://localhost:5001';

// Modal igual que el de VulnerableShop
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="vshop-modal-overlay" onClick={onClose}>
      <div className="vshop-modal" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
        <button
          className="vshop-modal-close"
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: 10,
            right: 14,
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            color: '#888',
            cursor: 'pointer'
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

const EntornoVulnerableCSRF = () => {
  const [step, setStep] = useState('login'); // 'login' | 'panel' | 'reset'
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Simula login vulnerable (sin protección real)
  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      const res = await fetch(`${API_URL}/vulnerable-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `usuario=${encodeURIComponent(usuario)}&password=${encodeURIComponent(password)}`
      });
      const data = await res.json();
      if (data.success) {
        setStep('panel');
        setMensaje('');
        setError('');
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch {
      setError('No se pudo conectar con el backend');
    }
  };

  // Cambia la contraseña realmente en el backend vulnerable
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      const res = await fetch(`${API_URL}/vulnerable-cambiar-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `nuevo_password=${encodeURIComponent(nuevaPassword)}`
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(true);
        setStep('login');
        setUsuario('');
        setPassword('');
      } else {
        setError(data.error || 'Error al cambiar la contraseña');
      }
      setNuevaPassword('');
    } catch {
      setError('No se pudo conectar con el backend');
    }
  };

  // Limpiar progreso: restaurar contraseña original y cerrar sesión
  const handleReset = async () => {
    setMensaje('');
    setError('');
    try {
      await fetch(`${API_URL}/reset-csrf-password`, { method: 'POST' });
      setMensaje('¡Contraseña restaurada a su valor original!');
      setStep('login');
      setUsuario('');
      setPassword('');
      setNuevaPassword('');
    } catch {
      setError('No se pudo restaurar la contraseña');
    }
  };

  return (
    <div className="csrf-entorno-container">
      <h2>Demo: Panel de usuario vulnerable a CSRF</h2>
      {step === 'login' && (
        <form className="csrf-form" onSubmit={handleLogin}>
          <label>Usuario:</label>
          <input
            type="text"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            required
            autoFocus
          />
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Iniciar sesión</button>
          <div
            className="csrf-link"
            style={{
              marginTop: 10,
              color: '#1976d2',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.98em',
              background: 'none',
              border: 'none',
              padding: 0,
              display: 'inline-block'
            }}
            onClick={() => {
              setStep('reset');
              setMensaje('');
              setError('');
              setNuevaPassword('');
            }}
          >
            ¿Olvidaste tu contraseña? Cambiar contraseña
          </div>
        </form>
      )}

      {step === 'reset' && (
        <form className="csrf-form" onSubmit={handleChangePassword}>
          <label>Introduce tu nueva contraseña:</label>
          <input
            type="password"
            value={nuevaPassword}
            onChange={e => setNuevaPassword(e.target.value)}
            required
            placeholder="Nueva contraseña"
          />
          <button type="submit">Actualizar contraseña</button>
          <button
            type="button"
            className="sandbox-button"
            style={{ marginTop: 8, background: '#888', color: '#fff' }}
            onClick={() => setStep('login')}
          >
            Volver al login
          </button>
        </form>
      )}

      {step === 'panel' && (
        <div>
          <div className="csrf-panel-bienvenida">
            <span>Bienvenido, <b>{usuario}</b></span>
            <button
              className="sandbox-button"
              style={{ float: 'right', marginLeft: 12 }}
              onClick={() => setStep('login')}
            >
              Cerrar sesión
            </button>
          </div>
          <button
            className="sandbox-button"
            style={{ background: '#e53935', color: '#fff', marginTop: 16 }}
            onClick={handleReset}
          >
            Limpiar progreso CSRF (restaurar contraseña)
          </button>
        </div>
      )}

      {mensaje && <div className="csrf-mensaje">{mensaje}</div>}
      {error && <div className="csrf-mensaje" style={{ background: '#ffebee', color: '#c62828', borderLeftColor: '#c62828' }}>{error}</div>}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="vshop-modal-title">¡Ejercicio completado con éxito!</h3>
        <p>La contraseña se ha cambiado correctamente.<br />Has explotado la vulnerabilidad CSRF.</p>
      </Modal>
    </div>
  );
};

export default EntornoVulnerableCSRF;