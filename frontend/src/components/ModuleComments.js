import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/ModuleComments.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function ModuleComments({ moduleId, user }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/comentarios/${moduleId}`).then(res => setComments(res.data));
  }, [moduleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const token = localStorage.getItem('authToken');
    const res = await axios.post(`${API_URL}/api/comentarios`, { modulo: moduleId, texto: text }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setComments([...comments, { ...res.data, usuario: { username: user.username } }]);
    setText('');
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('authToken');
    await axios.delete(`${API_URL}/api/comentarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setComments(comments.filter(c => c.id !== id));
  };

  return (
    <div className="module-comments">
      <h3>Comentarios</h3>
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
      <ul className="module-comments-list">
        {comments.map(c => (
          <li key={c.id} className="comment-card">
            <div className="comment-header">
              <span className="comment-username">{c.usuario.username}</span>
              <span className="comment-date">{new Date(c.fechaPublicacion).toLocaleString()}</span>
            </div>
            <div className="comment-text">{c.texto}</div>
            {(user?.rol === 'ADMIN' || user?.rol === 'MODERATOR') && (
              <div className="comment-actions">
                <button onClick={() => handleDelete(c.id)}>Eliminar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ModuleComments;