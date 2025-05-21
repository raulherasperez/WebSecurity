import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import './css/GuiaDetalle.css';

const GuiaDetalle = () => {
  const { id } = useParams();
  const [guia, setGuia] = useState(null);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Usuario loggeado
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchGuia = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/guias/${id}`);
        setGuia(response.data);
      } catch (err) {
        setError('No se pudo cargar la guía.');
      }
    };
    fetchGuia();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:8080/api/guias/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/guias');
    } catch (err) {
      setError('No se pudo borrar la guía.');
      setDeleting(false);
      setShowModal(false);
    }
  };

  if (error) return <div className="guia-detalle-error">{error}</div>;
  if (!guia) return <div className="guia-detalle-loading">Cargando...</div>;

  // Solo el autor puede editar/borrar
  const esAutor = username && guia.usuario?.username === username;

  return (
    <div className="guia-detalle-container">
      <Link to="/guias" className="guia-detalle-back">&larr; Volver al listado</Link>
      <article className="guia-detalle-article">
        <h1 className="guia-detalle-title">{guia.titulo}</h1>
        <div className="guia-detalle-meta">
          Publicada por <span className="guia-detalle-autor">{guia.usuario?.username || 'Desconocido'}</span> |{' '}
          <span className="guia-detalle-fecha">{new Date(guia.fechaAñadida).toLocaleString()}</span>
        </div>
        {esAutor && (
          <div className="guia-detalle-actions">
            <Link to={`/guias/${id}/editar`} className="guia-detalle-edit-btn">Editar</Link>
            <button
              className="guia-detalle-delete-btn"
              onClick={() => setShowModal(true)}
              disabled={deleting}
            >
              {deleting ? 'Borrando...' : 'Borrar'}
            </button>
          </div>
        )}
        <div className="guia-detalle-contenido">
         <MDEditor.Markdown source={guia.contenido} />
        </div>
      </article>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="guia-modal-overlay">
          <div className="guia-modal">
            <p>¿Seguro que quieres borrar esta guía?</p>
            <div className="guia-modal-actions">
              <button
                className="guia-modal-cancel"
                onClick={() => setShowModal(false)}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                className="guia-modal-confirm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Borrando...' : 'Borrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuiaDetalle;