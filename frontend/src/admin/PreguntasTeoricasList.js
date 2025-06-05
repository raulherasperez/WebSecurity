import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/admin-panel.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function PreguntasTeoricasList({ moduloId }) {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [pregunta, setPregunta] = useState('');
  const [opciones, setOpciones] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/api/preguntas-teoricas/modulo/${moduloId}`)
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
      const opcionesArr = opciones.split('\n');
      if (editing) {
        await axios.put(
          `${API_URL}/api/preguntas-teoricas/${editing.id}`,
          { ...editing, pregunta, opciones: opcionesArr, respuesta },
          authHeader
        );
      } else {
        await axios.post(
          `${API_URL}/api/preguntas-teoricas`,
          { pregunta, opciones: opcionesArr, respuesta, modulo: { id: moduloId }},
          authHeader
        );
      }
      setPregunta('');
      setOpciones('');
      setRespuesta('');
      setEditing(null);
      const res = await axios.get(`${API_URL}/api/preguntas-teoricas/modulo/${moduloId}`);
      setPreguntas(res.data);
    } catch {
      setError('Error al guardar la pregunta');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar esta pregunta?')) return;
    await axios.delete(`${API_URL}/api/preguntas-teoricas/${id}`, authHeader);
    setPreguntas(preguntas.filter(p => p.id !== id));
  };

  const handleEdit = preguntaObj => {
    setEditing(preguntaObj);
    setPregunta(preguntaObj.pregunta);
    setOpciones((preguntaObj.opciones || []).join('\n'));
    setRespuesta(preguntaObj.respuesta);
  };

  const handleCancel = () => {
    setEditing(null);
    setPregunta('');
    setOpciones('');
    setRespuesta('');
  };

  return (
    <div className="admin-list">
      <h4>Preguntas teóricas del módulo</h4>
      <form className="admin-form" onSubmit={handleSave}>
        <textarea
          value={pregunta}
          onChange={e => setPregunta(e.target.value)}
          placeholder="Pregunta"
          required
        />
        <textarea
          value={opciones}
          onChange={e => setOpciones(e.target.value)}
          placeholder="Opciones (una por línea)"
          required
        />
        <input
          value={respuesta}
          onChange={e => setRespuesta(e.target.value)}
          placeholder="Respuesta correcta"
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
          {preguntas.map(preguntaObj => (
            <li key={preguntaObj.id}>
              <strong>{preguntaObj.pregunta}</strong>
              <ul>
                {(preguntaObj.opciones || []).map((op, i) => (
                  <li key={i}>{op}</li>
                ))}
              </ul>
              <div>Respuesta correcta: {preguntaObj.respuesta}</div>
              <button onClick={() => handleEdit(preguntaObj)}>Editar</button>
              <button onClick={() => handleDelete(preguntaObj.id)} className="error">Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PreguntasTeoricasList;