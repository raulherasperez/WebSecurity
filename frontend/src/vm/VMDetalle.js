import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/VMDetalle.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const VMDetalle = () => {
  const { id } = useParams();
  const [vm, setVM] = useState(null);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const username = localStorage.getItem('username');
  const token = localStorage.getItem('authToken');
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    const fetchVM = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/vms/${id}`);
        setVM(response.data);
      } catch (err) {
        setError('No se pudo cargar la máquina virtual.');
      }
    };
    fetchVM();
  }, [id]);

  const puedeEditar = username && vm && vm.usuario?.username === username;
  const puedeBorrar = puedeEditar || rol === 'ADMIN' || rol === 'MODERATOR';

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/api/vms/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/machines');
    } catch {
      setError('No se pudo borrar la máquina.');
      setDeleting(false);
      setShowModal(false);
    }
  };

  if (error) return <div className="vm-detalle-error">{error}</div>;
  if (!vm) return <div className="vm-detalle-loading">Cargando...</div>;

  return (
    <div className="vm-detalle-container">
      <Link to="/machines" className="vm-detalle-back">&larr; Volver al listado</Link>
      <article>
        <h1 className="vm-detalle-title">{vm.nombre}</h1>
        <div className="vm-detalle-meta">
          Añadida por <span className="vm-detalle-autor">{vm.usuario?.username || 'Desconocido'}</span> |{' '}
          <span className="vm-detalle-fecha">{new Date(vm.fechaAñadida).toLocaleString()}</span>
        </div>
        {(puedeEditar || puedeBorrar) && (
          <div className="vm-detalle-actions">
            {puedeEditar && (
              <Link to={`/machines/${id}/editar`} className="vm-detalle-edit-btn">Editar</Link>
            )}
            {puedeBorrar && (
              <button
                className="vm-detalle-delete-btn"
                onClick={() => setShowModal(true)}
                disabled={deleting}
              >
                {deleting ? 'Borrando...' : 'Borrar'}
              </button>
            )}
          </div>
        )}
        <div className="vm-detalle-contenido">
          <p>{vm.descripcion}</p>
          <a href={vm.enlaceDescarga} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', fontWeight: 600 }}>
            Descargar máquina
          </a>
        </div>
      </article>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="vm-modal-overlay">
          <div className="vm-modal">
            <p>¿Seguro que quieres borrar esta máquina?</p>
            <div className="vm-modal-actions">
              <button
                className="vm-modal-cancel"
                onClick={() => setShowModal(false)}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                className="vm-modal-confirm"
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

export default VMDetalle;