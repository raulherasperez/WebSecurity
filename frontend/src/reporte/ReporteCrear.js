import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Reporte.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ReporteCrear = () => {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_URL}/api/reportes`, { titulo, texto }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/reportes');
    } catch {
      setMessage('No se pudo enviar el reporte.');
    }
  };

  return (
    <div className="reporte-form-container">
      <h2>Nuevo reporte de error</h2>
      <form onSubmit={handleSubmit}>
        <label>Título:</label>
        <input value={titulo} onChange={e => setTitulo(e.target.value)} required />
        <label>Descripción:</label>
        <textarea value={texto} onChange={e => setTexto(e.target.value)} required />
        <button type="submit" className="reporte-crear-btn">Enviar</button>
        {message && <div className="reporte-error">{message}</div>}
      </form>
    </div>
  );
};

export default ReporteCrear;