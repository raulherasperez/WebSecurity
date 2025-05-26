import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './css/Glosario.css';
import SidebarMenu from '../components/SidebarMenu';
import LogoHomeLink from '../components/LogoHomeLink';
import { useAuth } from '../context/AuthContext';

const GlosarioListado = () => {
  const [terminos, setTerminos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [terminoToDelete, setTerminoToDelete] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const rol = user?.rol || 'USER';

  useEffect(() => {
    const fetchTerminos = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/glosario');
        setTerminos(res.data);
      } catch {
        setError('No se pudo cargar el glosario.');
      } finally {
        setLoading(false);
      }
    };
    fetchTerminos();
  }, []);

  const openDeleteModal = (termino) => {
    setTerminoToDelete(termino);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTerminoToDelete(null);
  };

  const handleDelete = async () => {
    if (!terminoToDelete) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:8080/api/glosario/${terminoToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTerminos(terminos.filter(t => t.id !== terminoToDelete.id));
      closeModal();
    } catch {
      alert('No se pudo borrar el término.');
      closeModal();
    }
  };

  if (loading) return <div className="glosario-loading">Cargando...</div>;
  if (error) return <div className="glosario-error">{error}</div>;

  return (
    <>

      <div className="glosario-container">
        <h2>Glosario</h2>
        {rol === 'ADMIN' && (
          <button
            className="glosario-crear-btn"
            onClick={() => navigate('/glosario/crear')}
          >
            + Crear término
          </button>
        )}
        <ul className="glosario-list">
          {terminos.map(termino => (
            <li key={termino.id} className="glosario-item">
              <div className="glosario-titulo">
                <strong>{termino.termino}</strong>
                {rol === 'ADMIN' && (
                  <span>
                    <button
                      className="glosario-edit-btn"
                      onClick={() => navigate(`/glosario/editar/${termino.id}`)}
                    >Editar</button>
                    <button
                      className="glosario-delete-btn"
                      onClick={() => openDeleteModal(termino)}
                    >Borrar</button>
                  </span>
                )}
              </div>
              <div className="glosario-significado">{termino.significado}</div>
              {termino.enlaceReferencia && (
                <div className="glosario-enlace">
                  <a href={termino.enlaceReferencia} target="_blank" rel="noopener noreferrer">
                    Referencia
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>¿Seguro que quieres borrar el término?</h3>
            <p><strong>{terminoToDelete?.termino}</strong></p>
            <div style={{ marginTop: 18 }}>
              <button className="glosario-delete-btn" onClick={handleDelete}>Borrar</button>
              <button className="glosario-edit-btn" onClick={closeModal} style={{ marginLeft: 12 }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlosarioListado;