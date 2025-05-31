import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './css/Sugerencia.css';


const API_URL = process.env.REACT_APP_BACKEND_URL;

const SugerenciaListado = () => {
  const [sugerencias, setSugerencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchSugerencias = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`${API_URL}/api/sugerencias`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSugerencias(res.data);
      } catch {
        setError('No se pudieron cargar las sugerencias.');
      } finally {
        setLoading(false);
      }
    };
    fetchSugerencias();
  }, []);

  if (loading) return <div className="sugerencia-loading">Cargando...</div>;
  if (error) return <div className="sugerencia-error">{error}</div>;

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1 }}>
        <div className="sugerencia-container">
          <h2>Sugerencias</h2>
          <a href="/sugerencias/crear" className="sugerencia-crear-btn">+ Nueva sugerencia</a>
          <ul className="sugerencia-list">
            {sugerencias.map(sug => (
              <li key={sug.id} className="sugerencia-item">
                <div className="sugerencia-titulo">
                  <strong>{sug.titulo}</strong>
                  <span className="sugerencia-autor">
                    {user?.rol === 'ADMIN' && ` | Usuario: ${sug.usuario?.username}`}
                  </span>
                </div>
                <div className="sugerencia-texto">{sug.texto}</div>
                <div className="sugerencia-fecha">{new Date(sug.fechaPublicacion).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default SugerenciaListado;