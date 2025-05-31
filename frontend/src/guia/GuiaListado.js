import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/GuiaListado.css';
import SidebarMenu from '../components/SidebarMenu';
import LogoHomeLink from '../components/LogoHomeLink';
import MDEditor from '@uiw/react-md-editor';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const GuiaListado = () => {
  const [guias, setGuias] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuias = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/guias`);
        setGuias(response.data);
      } catch (err) {
        setError('No se pudieron cargar las guías.');
      }
    };
    fetchGuias();
  }, []);

  if (error) return <div>{error}</div>;

  return (
      <div className="guia-listado-container">
        
        <div className="guia-listado-header">
          <h2>Listado de Guías</h2>
          <button
            className="guia-listado-crear-btn"
            onClick={() => navigate('/guias/crear')}
          >
            + Crear guía
          </button>
        </div>
        <ul className="guia-listado-list">
          {guias.map(guia => (
            <li key={guia.id} className="guia-listado-item">
              <Link to={`/guias/${guia.id}`} className="guia-listado-title">
                {guia.titulo}
              </Link>
              <div className="guia-listado-meta">
                Publicada por: {guia.usuario?.username || 'Desconocido'} | {new Date(guia.fechaAñadida).toLocaleString()}
              </div>
              <div className="guia-listado-preview" data-color-mode="light">
        <MDEditor.Markdown
          source={
            guia.contenido && guia.contenido.length > 120
              ? guia.contenido.slice(0, 120) + '...'
              : guia.contenido
          }
          style={{ background: 'transparent', fontSize: '1rem', padding: 0 }}
        />
      </div>
            </li>
          ))}
        </ul>
      </div>
  );
};

export default GuiaListado;