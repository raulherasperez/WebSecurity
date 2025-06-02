import React, { useState } from 'react';
import axios from 'axios';
import './css/admin-panel.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function ModuloInfoForm({ modulo, onSaved }) {
  const [nombre, setNombre] = useState(modulo.nombre || '');
  const [descripcion, setDescripcion] = useState(modulo.descripcion || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await axios.put(
        `${API_URL}/api/modulos/${modulo.id}`,
        { ...modulo, nombre, descripcion },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      if (onSaved) onSaved();
    } catch (err) {
      setError('No se pudo guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h4>Editar información del módulo</h4>
      <div>
        <label>
          Nombre:<br />
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Descripción:<br />
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            required
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
      >
        Guardar cambios
      </button>
      {success && <span className="success">¡Guardado!</span>}
      {error && <span className="error">{error}</span>}
    </form>
  );
}

export default ModuloInfoForm;