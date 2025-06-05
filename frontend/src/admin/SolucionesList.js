import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/admin-panel.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function SolucionesList({ moduloId }) {
  const [soluciones, setSoluciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [texto, setTexto] = useState('');
  const [nivel, setNivel] = useState('FACIL');
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/api/soluciones/modulo/${moduloId}`)
      .then(res => {
        setSoluciones(res.data);
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
          `${API_URL}/api/soluciones/${editing.id}`,
          { ...editing, texto, nivel },
          authHeader
        );
      } else {
        await axios.post(
          `${API_URL}/api/soluciones`,
          { texto, nivel, modulo: { id: moduloId } },
          authHeader
        );
      }
      setTexto('');
      setNivel('FACIL');
      setEditing(null);
      const res = await axios.get(`${API_URL}/api/soluciones/modulo/${moduloId}`);
      setSoluciones(res.data);
    } catch {
      setError('Error al guardar la solución');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar esta solución?')) return;
    await axios.delete(`${API_URL}/api/soluciones/${id}`, authHeader);
    setSoluciones(soluciones.filter(s => s.id !== id));
  };

  const handleEdit = solucion => {
    setEditing(solucion);
    setTexto(solucion.texto);
    setNivel(solucion.nivel);
  };

  const handleCancel = () => {
    setEditing(null);
    setTexto('');
    setNivel('FACIL');
  };

  return (
    <div className="admin-list">
      <h4>Soluciones del módulo</h4>
      <form className="admin-form" onSubmit={handleSave}>
        <textarea
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Texto de la solución"
          required
        />
        <select value={nivel} onChange={e => setNivel(e.target.value)}>
          <option value="FACIL">Fácil</option>
          <option value="MEDIO">Medio</option>
          <option value="DIFICIL">Difícil</option>
          <option value="IMPOSIBLE">Imposible</option>
        </select>
        <button type="submit">{editing ? 'Guardar cambios' : 'Añadir solución'}</button>
        {editing && <button type="button" onClick={handleCancel}>Cancelar</button>}
        {error && <span className="error">{error}</span>}
      </form>
      {loading ? (
        <div>Cargando soluciones...</div>
      ) : (
        <ul>
          {soluciones.map(solucion => (
            <li key={solucion.id}>
              <strong>[{solucion.nivel}]</strong> {solucion.texto}
              <button onClick={() => handleEdit(solucion)}>Editar</button>
              <button onClick={() => handleDelete(solucion.id)} className="error">Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SolucionesList;