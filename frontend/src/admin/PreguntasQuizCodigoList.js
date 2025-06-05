import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/admin-panel.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function PreguntasQuizCodigoList({ moduloId }) {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [vulnerableLine, setVulnerableLine] = useState(0);
  const [explicacion, setExplicacion] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/api/preguntas-quiz/modulo/${moduloId}`)
      .then(res => {
        setPreguntas(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [moduloId]);

  const authHeader = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const handleSave = async e => {
    e.preventDefault();
    setError('');
    try {
      const codigoArr = codigo.split('\n');
      if (editing) {
        await axios.put(
          `${API_URL}/api/preguntas-quiz/${editing.id}`,
          { ...editing, titulo, codigo: codigoArr, vulnerableLine, explicacion },
          authHeader
        );
      } else {
        await axios.post(
          `${API_URL}/api/preguntas-quiz`,
          { titulo, codigo: codigoArr, vulnerableLine, explicacion, modulo: { id: moduloId } },
          authHeader
        );
      }
      setTitulo('');
      setCodigo('');
      setVulnerableLine(0);
      setExplicacion('');
      setEditing(null);
      const res = await axios.get(`${API_URL}/api/preguntas-quiz/modulo/${moduloId}`);
      setPreguntas(res.data);
    } catch {
      setError('Error al guardar la pregunta');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar esta pregunta?')) return;
    await axios.delete(`${API_URL}/api/preguntas-quiz/${id}`, authHeader);
    setPreguntas(preguntas.filter(p => p.id !== id));
  };

  const handleEdit = pregunta => {
    setEditing(pregunta);
    setTitulo(pregunta.titulo);
    setCodigo((pregunta.codigo || []).join('\n'));
    setVulnerableLine(pregunta.vulnerableLine);
    setExplicacion(pregunta.explicacion);
  };

  const handleCancel = () => {
    setEditing(null);
    setTitulo('');
    setCodigo('');
    setVulnerableLine(0);
    setExplicacion('');
  };

  return (
    <div className="admin-list">
      <h4>Preguntas de quiz de código</h4>
      <form className="admin-form" onSubmit={handleSave}>
        <input
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          placeholder="Título"
          required
        />
        <textarea
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          placeholder="Código (una línea por línea)"
          required
        />
        <input
          type="number"
          value={vulnerableLine}
          onChange={e => setVulnerableLine(Number(e.target.value))}
          placeholder="Índice de línea vulnerable (empezando en 0)"
          min={0}
        />
        <textarea
          value={explicacion}
          onChange={e => setExplicacion(e.target.value)}
          placeholder="Explicación"
          required
        />
        <button type="submit">{editing ? 'Guardar cambios' : 'Añadir pregunta'}</button>
        {editing && <button type="button" onClick={handleCancel}>Cancelar</button>}
        {error && <span className="error">{error}</span>}
      </form>
      {loading ? (
        <div>Cargando preguntas...</div>
      ) : (
        <ul>
          {preguntas.map(pregunta => (
            <li key={pregunta.id}>
              <strong>{pregunta.titulo}</strong>
              <pre>{(pregunta.codigo || []).join('\n')}</pre>
              <div>Línea vulnerable: {pregunta.vulnerableLine}</div>
              <div>Explicación: {pregunta.explicacion}</div>
              <button onClick={() => handleEdit(pregunta)}>Editar</button>
              <button onClick={() => handleDelete(pregunta.id)} className="error">Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PreguntasQuizCodigoList;