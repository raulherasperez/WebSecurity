import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Glosario.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const GlosarioCrear = () => {
  const [termino, setTermino] = useState('');
  const [significado, setSignificado] = useState('');
  const [enlaceReferencia, setEnlaceReferencia] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_URL}/api/glosario`, {
        termino,
        significado,
        enlaceReferencia
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/glosario');
    } catch {
      setMessage('No se pudo crear el término.');
    }
  };

  return (
    <div className="glosario-form-container">
      <h2>Crear término</h2>
      <form onSubmit={handleSubmit}>
        <label>Término:</label>
        <input value={termino} onChange={e => setTermino(e.target.value)} required />
        <label>Significado:</label>
        <textarea value={significado} onChange={e => setSignificado(e.target.value)} required />
        <label>Enlace de referencia:</label>
        <input value={enlaceReferencia} onChange={e => setEnlaceReferencia(e.target.value)} />
        <button type="submit" className="glosario-crear-btn">Crear</button>
        {message && <div className="glosario-error">{message}</div>}
      </form>
    </div>
  );
};

export default GlosarioCrear;