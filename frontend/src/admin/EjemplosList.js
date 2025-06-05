import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/admin-panel.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function EjemplosList({ moduloId }) {
  const [ejemplos, setEjemplos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/api/ejemplos/modulo/${moduloId}`)
      .then(res => {
        setEjemplos(res.data);
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
          `${API_URL}/api/ejemplos/${editing.id}`,
          { ...editing, titulo, descripcion, codigo },
          authHeader
        );
      } else {
        await axios.post(
          `${API_URL}/api/ejemplos`,
          { titulo, descripcion, codigo, modulo: { id: moduloId } },
          authHeader
        );
      }
      setTitulo('');
      setDescripcion('');
      setCodigo('');
      setEditing(null);
      const res = await axios.get(`${API_URL}/api/ejemplos/modulo/${moduloId}`);
      setEjemplos(res.data);
    } catch {
      setError('Error al guardar el ejemplo');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar este ejemplo?')) return;
    await axios.delete(`${API_URL}/api/ejemplos/${id}`, authHeader);
    setEjemplos(ejemplos.filter(e => e.id !== id));
  };

  const handleEdit = ejemplo => {
    setEditing(ejemplo);
    setTitulo(ejemplo.titulo);
    setDescripcion(ejemplo.descripcion);
    setCodigo(ejemplo.codigo);
  };

  const handleCancel = () => {
    setEditing(null);
    setTitulo('');
    setDescripcion('');
    setCodigo('');
  };

  return (
    <div className="admin-list">
      <h4>Ejemplos del módulo</h4>
      <form className="admin-form" onSubmit={handleSave}>
        <input
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          placeholder="Título"
          required
        />
        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Descripción"
          required
        />
        <textarea
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          placeholder="Código (puedes poner varias líneas)"
          required
        />
        <button type="submit">{editing ? 'Guardar cambios' : 'Añadir ejemplo'}</button>
        {editing && <button type="button" onClick={handleCancel}>Cancelar</button>}
        {error && <span className="error">{error}</span>}
      </form>
      {loading ? (
        <div>Cargando ejemplos...</div>
      ) : (
        <ul>
          {ejemplos.map(ejemplo => (
            <li key={ejemplo.id}>
              <strong>{ejemplo.titulo}</strong>: {ejemplo.descripcion}
              <pre>{ejemplo.codigo}</pre>
              <button onClick={() => handleEdit(ejemplo)}>Editar</button>
              <button onClick={() => handleDelete(ejemplo.id)} className="error">Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EjemplosList;