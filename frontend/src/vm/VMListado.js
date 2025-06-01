import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/VMListado.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const VMListado = () => {
  const [vms, setVMs] = useState([]);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vmToDelete, setVmToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchVMs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/vms`);
        setVMs(response.data);
      } catch (err) {
        setError('No se pudieron cargar las máquinas virtuales.');
      }
    };
    fetchVMs();
  }, []);

  useEffect(() => {
    if (token) {
      axios.get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setUserData(res.data))
        .catch(() => setUserData(null));
    }
  }, [token]);

  const handleDeleteClick = (id) => {
    setVmToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/api/vms/${vmToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVMs(vms.filter(vm => vm.id !== vmToDelete));
      setShowModal(false);
      setVmToDelete(null);
    } catch {
      alert('No se pudo borrar la máquina.');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setVmToDelete(null);
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="vm-listado-container">
      <div className="vm-listado-header">
        <h2>Máquinas Virtuales</h2>
        {token && (
          <button
            className="vm-listado-crear-btn"
            onClick={() => navigate('/machines/crear')}
          >
            + Añadir máquina
          </button>
        )}
      </div>
      <ul className="vm-listado-list">
        {vms.map(vm => {
          const puedeEditarOBorrar =
            userData &&
            (userData.username === vm.usuario?.username ||
              userData.rol === 'ADMIN' ||
              userData.rol === 'MODERATOR');
          return (
            <li key={vm.id} className="vm-listado-item">
              <Link to={`/machines/${vm.id}`} className="vm-listado-title">
                {vm.nombre}
              </Link>
              <div className="vm-listado-meta">
                Añadida por: {vm.usuario?.username || 'Desconocido'} | {new Date(vm.fechaAñadida).toLocaleString()}
              </div>
              {puedeEditarOBorrar && (
                <div className="vm-listado-actions">
                  <button
                    className="vm-listado-edit-btn"
                    onClick={() => navigate(`/machines/${vm.id}/editar`)}
                  >
                    Editar
                  </button>
                  <button
                    className="vm-listado-delete-btn"
                    onClick={() => handleDeleteClick(vm.id)}
                  >
                    Borrar
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {showModal && (
        <div className="vm-modal-overlay">
          <div className="vm-modal">
            <p>¿Seguro que quieres borrar esta máquina virtual?</p>
            <div className="vm-modal-actions">
              <button
                className="vm-modal-cancel"
                onClick={handleCancelDelete}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                className="vm-modal-confirm"
                onClick={handleConfirmDelete}
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

export default VMListado;