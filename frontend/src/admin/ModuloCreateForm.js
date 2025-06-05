import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function ModuloCreateForm({ onCreated }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [descripcionEjercicios, setDescripcionEjercicios] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [infoEntorno, setInfoEntorno] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem('authToken');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await axios.post(
        `${API_URL}/api/modulos`,
        {
          nombre,
          descripcion,
          descripcionEjercicios,
          videoUrl,
          infoEntorno
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNombre('');
      setDescripcion('');
      setDescripcionEjercicios('');
      setVideoUrl('');
      setInfoEntorno('');
      setSuccess(true);
      if (onCreated) onCreated();
    } catch (err) {
      setError('No se pudo crear el módulo');
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
      <h4>Crear nuevo módulo</h4>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        required
      />
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
        required
      />
      <textarea
        placeholder="Descripción de ejercicios"
        value={descripcionEjercicios}
        onChange={e => setDescripcionEjercicios(e.target.value)}
      />
      <input
        type="text"
        placeholder="URL del video"
        value={videoUrl}
        onChange={e => setVideoUrl(e.target.value)}
      />
      <textarea
        placeholder="Información del entorno"
        value={infoEntorno}
        onChange={e => setInfoEntorno(e.target.value)}
      />
      <button type="submit">Crear módulo</button>
      {success && <span className="success">¡Módulo creado!</span>}
      {error && <span className="error">{error}</span>}
    </form>
  );
}

export default ModuloCreateForm;