import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Sugerencia.css';
import ModalLogroDesbloqueado from '../components/ModalLogroDesbloqueado';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const SugerenciaCrear = () => {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [message, setMessage] = useState('');
  const [logroDesbloqueado, setLogroDesbloqueado] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(`${API_URL}/api/sugerencias`, { titulo, texto }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.logroDesbloqueado) {
        setLogroDesbloqueado(res.data.logroDesbloqueado);
      } else {
        navigate('/sugerencias');
      }
    } catch {
      setMessage('No se pudo enviar la sugerencia.');
    }
  };

  const handleCloseModal = () => {
    setLogroDesbloqueado(null);
    navigate('/sugerencias');
  };

  return (
    <div className="sugerencia-form-container">
      <h2>Nueva sugerencia</h2>
      <form onSubmit={handleSubmit}>
        <label>Título:</label>
        <input value={titulo} onChange={e => setTitulo(e.target.value)} required />
        <label>Descripción:</label>
        <textarea value={texto} onChange={e => setTexto(e.target.value)} required />
        <button type="submit" className="sugerencia-crear-btn">Enviar</button>
        {message && <div className="sugerencia-error">{message}</div>}
      </form>
      {logroDesbloqueado && (
        <ModalLogroDesbloqueado logro={logroDesbloqueado} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SugerenciaCrear;