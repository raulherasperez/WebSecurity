import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './css/Glosario.css';

const GlosarioEditar = () => {
  const { id } = useParams();
  const [termino, setTermino] = useState('');
  const [significado, setSignificado] = useState('');
  const [enlaceReferencia, setEnlaceReferencia] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTermino = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/glosario/${id}`);
        setTermino(res.data.termino);
        setSignificado(res.data.significado);
        setEnlaceReferencia(res.data.enlaceReferencia || '');
      } catch {
        setMessage('No se pudo cargar el término.');
      }
    };
    fetchTermino();
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`http://localhost:8080/api/glosario/${id}`, {
        termino,
        significado,
        enlaceReferencia
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/glosario');
    } catch {
      setMessage('No se pudo actualizar el término.');
    }
  };

  return (
    <div className="glosario-form-container">
      <h2>Editar término</h2>
      <form onSubmit={handleSubmit}>
        <label>Término:</label>
        <input value={termino} onChange={e => setTermino(e.target.value)} required />
        <label>Significado:</label>
        <textarea value={significado} onChange={e => setSignificado(e.target.value)} required />
        <label>Enlace de referencia:</label>
        <input value={enlaceReferencia} onChange={e => setEnlaceReferencia(e.target.value)} />
        <button type="submit" className="glosario-crear-btn">Guardar</button>
        {message && <div className="glosario-error">{message}</div>}
      </form>
    </div>
  );
};

export default GlosarioEditar;