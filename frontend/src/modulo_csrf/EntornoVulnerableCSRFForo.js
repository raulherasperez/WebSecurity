import React, { useEffect, useState, useRef } from 'react';
import './css/EntornoVulnerableCSRFForo.css';

// Modal reutilizable (puedes ajustar estilos según tu proyecto)
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

const API_URL = process.env.REACT_APP_VULNERABLE_URL;

function getNivelCSRF() {
  return localStorage.getItem('nivelCSRF') || 'facil';
}

async function obtenerCsrfToken() {
  const res = await fetch(`${API_URL}/csrf-token`, { credentials: 'include' });
  const data = await res.json();
  return data.csrf_token;
}

async function setNivelCSRF(nivel) {
  await fetch(`${API_URL}/set-nivel-csrf`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nivel })
  });
}

function EntornoVulnerableCSRFForo() {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Para comparar la lista anterior y detectar cambios
  const prevComentariosRef = useRef([]);

  // Al entrar, establecer el nivel CSRF en la sesión del backend
  useEffect(() => {
    const nivel = getNivelCSRF();
    setNivelCSRF(nivel);
    // eslint-disable-next-line
  }, []);

  const fetchComentarios = async () => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/foro-comentarios`, { credentials: 'include' });
      const data = await res.json();
      setComentarios(data);
    } catch {
      setError('No se pudieron cargar los comentarios');
    }
  };

  // Refresca la lista cada 2 segundos para detectar cambios externos (CSRF)
  useEffect(() => {
    fetchComentarios();
    const interval = setInterval(fetchComentarios, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // Detectar si se ha borrado un comentario (por CSRF)
  useEffect(() => {
    const prev = prevComentariosRef.current;
    if (prev.length > 0 && comentarios.length < prev.length) {
      setModalOpen(true);
    }
    prevComentariosRef.current = comentarios;
  }, [comentarios]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    const nivel = getNivelCSRF();

    try {
      if (nuevoComentario.trim()) {
        let body = `texto=${encodeURIComponent(nuevoComentario)}`;
        let extraHeaders = {};
        if (nivel === 'dificil') {
          body += `&csrf_token=token123`;
        } else if (nivel === 'imposible') {
          const token = await obtenerCsrfToken();
          body += `&csrf_token=${encodeURIComponent(token)}`;
        }
        await fetch(`${API_URL}/foro-agregar-comentario`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...extraHeaders },
          body
        });
        setMensaje('Comentario publicado correctamente.');
        setNuevoComentario('');
        fetchComentarios();
      }
    } catch {
      setError('No se pudo conectar con el backend');
    }
  };

  return (
    <div className="foro-csrf-container">
      <h2>Foro vulnerable a CSRF</h2>
      <p>
        Este foro permite ver y publicar comentarios de forma normal. <b>No puedes borrar comentarios desde aquí</b>.
        Sin embargo, si tienes la sesión iniciada, cualquier web externa podría enviar una petición para borrar tus comentarios mediante un ataque CSRF.
      </p>
      <form className="foro-form" onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <label htmlFor="nuevoComentario">Escribe un comentario:</label>
        <textarea
          id="nuevoComentario"
          value={nuevoComentario}
          onChange={e => setNuevoComentario(e.target.value)}
          placeholder="Escribe tu comentario aquí..."
          rows={3}
          style={{ resize: 'vertical' }}
          required
        />
        <button type="submit">Publicar comentario</button>
      </form>
      <div className="foro-comentarios-lista">
        {comentarios.length === 0 && <div className="foro-vacio">No hay comentarios.</div>}
        {comentarios.map(com => (
          <div className="foro-comentario" key={com.id}>
            <div className="foro-comentario-header">
              <b>{com.autor}</b> <span className="foro-comentario-fecha">{com.fecha}</span>
            </div>
            <div className="foro-comentario-texto">{com.texto}</div>
            <div className="foro-comentario-id">ID: {com.id}</div>
          </div>
        ))}
      </div>
      {mensaje && <div className="foro-mensaje">{mensaje}</div>}
      {error && <div className="foro-mensaje foro-error">{error}</div>}
      <div className="foro-csrf-aviso" style={{ marginTop: 28, color: '#b71c1c', fontSize: '0.98em' }}>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="vshop-modal-title">¡Ejercicio completado con éxito!</h3>
        <p>Has conseguido borrar un comentario mediante un ataque CSRF.<br />¡Bien hecho!</p>
      </Modal>
    </div>
  );
}

export default EntornoVulnerableCSRFForo;