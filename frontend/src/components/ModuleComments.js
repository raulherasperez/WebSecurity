import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/ModuleComments.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function ModuleComments({ moduleId, user }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar comentarios del módulo
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/comentarios/modulo/${moduleId}`)
      .then(res => {
        setComments(res.data);
        console.log('Comentarios cargados:', res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar los comentarios.');
        setLoading(false);
      });
  }, [moduleId]);

  // Enviar nuevo comentario
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!text.trim()) return;
  const token = localStorage.getItem('authToken');
  const data = { modulo: { id: moduleId }, texto: text };
  const config = { headers: { Authorization: `Bearer ${token}` } };
  try {
    const res = await axios.post(
      `${API_URL}/api/comentarios`,
      data,
      config
    );
    setComments([...comments, res.data]);
    setText('');
  } catch (err) {
    setError('No se pudo enviar el comentario.');
  }
};

  // Eliminar comentario (solo admin/moderador)
  const handleDelete = async (id) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(`${API_URL}/api/comentarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(comments.filter(c => c.id !== id));
    } catch (err) {
      setError('No se pudo eliminar el comentario.');
    }
  };

  return (
    <div className="module-comments">
      <h3>Comentarios</h3>
      {error && <div className="error-msg">{error}</div>}
      {user ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Escribe tu comentario aquí..."
            required
          />
          <button type="submit">Comentar</button>
        </form>
      ) : (
        <div style={{ marginBottom: 24, color: '#555', fontSize: '1rem' }}>
          <a href="/login" style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}>
            Inicia sesión o regístrate
          </a> para comentar en el foro.
        </div>
      )}
      {loading ? (
        <div>Cargando comentarios...</div>
      ) : (
        <ul className="module-comments-list">
          {comments.map(c => (
            <li key={c.id} className="comment-card">
              <div className="comment-header">
                <span className="comment-username">{c.usuario?.username || 'Usuario'}</span>
                <span className="comment-date">
                  {c.fechaPublicacion ? new Date(c.fechaPublicacion).toLocaleString() : ''}
                </span>
              </div>
              <div className="comment-text">{c.texto}</div>
              {(user?.rol === 'ROLE_ADMIN' || user?.rol === 'MODERATOR') && (
                <div className="comment-actions">
                  <button onClick={() => handleDelete(c.id)}>Eliminar</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ModuleComments;