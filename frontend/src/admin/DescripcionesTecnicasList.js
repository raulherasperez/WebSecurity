import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/admin-panel.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function DescripcionesTecnicasList({ moduloId }) {
  const [descripciones, setDescripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [nivel, setNivel] = useState('FACIL');
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/api/descripciones-tecnicas/modulo/${moduloId}`)
      .then(res => {
        setDescripciones(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [moduloId]);

  const authHeader = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const handleSave = async e => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await axios.put(
          `${API_URL}/api/descripciones-tecnicas/${editing.id}`,
          { ...editing, descripcion, nivel },
          authHeader
        );
      } else {
        await axios.post(
          `${API_URL}/api/descripciones-tecnicas`,
          { descripcion, nivel, modulo: { id: moduloId } },
          authHeader
        );
      }
      setDescripcion('');
      setNivel('FACIL');
      setEditing(null);
      const res = await axios.get(`${API_URL}/api/descripciones-tecnicas/modulo/${moduloId}`);
      setDescripciones(res.data);
    } catch {
      setError('Error al guardar la descripción');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar esta descripción?')) return;
    await axios.delete(`${API_URL}/api/descripciones-tecnicas/${id}`, authHeader);
    setDescripciones(descripciones.filter(d => d.id !== id));
  };

  const handleEdit = desc => {
    setEditing(desc);
    setDescripcion(desc.descripcion);
    setNivel(desc.nivel);
  };

  const handleCancel = () => {
    setEditing(null);
    setDescripcion('');
    setNivel('FACIL');
  };

  return (
    <div className="admin-list">
      <h4>Descripciones técnicas del módulo</h4>
      <form className="admin-form" onSubmit={handleSave}>
        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Descripción técnica"
          required
        />
        <select value={nivel} onChange={e => setNivel(e.target.value)}>
          <option value="FACIL">Fácil</option>
          <option value="MEDIO">Medio</option>
          <option value="DIFICIL">Difícil</option>
          <option value="IMPOSIBLE">Imposible</option>
        </select>
        <button type="submit">{editing ? 'Guardar cambios' : 'Añadir descripción'}</button>
        {editing && <button type="button" onClick={handleCancel}>Cancelar</button>}
        {error && <span className="error">{error}</span>}
      </form>
      {loading ? (
        <div>Cargando descripciones...</div>
      ) : (
        <ul>
          {descripciones.map(desc => (
            <li key={desc.id}>
              <strong>[{desc.nivel}]</strong> {desc.descripcion}
              <button onClick={() => handleEdit(desc)}>Editar</button>
              <button onClick={() => handleDelete(desc.id)} className="error">Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DescripcionesTecnicasList;