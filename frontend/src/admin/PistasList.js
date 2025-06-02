import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/admin-panel.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function PistasList({ moduloId }) {
  const [pistas, setPistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [texto, setTexto] = useState('');
  const [nivel, setNivel] = useState('FACIL');
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/api/pistas/modulo/${moduloId}`)
      .then(res => {
        setPistas(res.data);
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
          `${API_URL}/api/pistas/${editing.id}`,
          { ...editing, texto, nivel },
          authHeader
        );
      } else {
        await axios.post(
          `${API_URL}/api/pistas`,
          { texto, nivel, moduloId },
          authHeader
        );
      }
      setTexto('');
      setNivel('FACIL');
      setEditing(null);
      const res = await axios.get(`${API_URL}/api/pistas/modulo/${moduloId}`);
      setPistas(res.data);
    } catch {
      setError('Error al guardar la pista');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar esta pista?')) return;
    await axios.delete(`${API_URL}/api/pistas/${id}`, authHeader);
    setPistas(pistas.filter(p => p.id !== id));
  };

  const handleEdit = pista => {
    setEditing(pista);
    setTexto(pista.texto);
    setNivel(pista.nivel);
  };

  const handleCancel = () => {
    setEditing(null);
    setTexto('');
    setNivel('FACIL');
  };

  return (
    <div className="admin-list">
      <h4>Pistas del módulo</h4>
      <form className="admin-form" onSubmit={handleSave}>
        <textarea
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Texto de la pista"
          required
        />
        <select value={nivel} onChange={e => setNivel(e.target.value)}>
          <option value="FACIL">Fácil</option>
          <option value="MEDIO">Medio</option>
          <option value="DIFICIL">Difícil</option>
          <option value="IMPOSIBLE">Imposible</option>
        </select>
        <button type="submit">{editing ? 'Guardar cambios' : 'Añadir pista'}</button>
        {editing && <button type="button" onClick={handleCancel}>Cancelar</button>}
        {error && <span className="error">{error}</span>}
      </form>
      {loading ? (
        <div>Cargando pistas...</div>
      ) : (
        <ul>
          {pistas.map(pista => (
            <li key={pista.id}>
              <strong>[{pista.nivel}]</strong> {pista.texto}
              <button onClick={() => handleEdit(pista)}>Editar</button>
              <button onClick={() => handleDelete(pista.id)} className="error">Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PistasList;