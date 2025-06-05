import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/admin-panel.css';
import ModuloCreateForm from './ModuloCreateForm';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function AdminPanel() {
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Función para recargar los módulos
  const reloadModulos = () => {
    setLoading(true);
    axios.get(`${API_URL}/api/modulos`)
      .then(res => {
        setModulos(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    reloadModulos();
  }, []);

  const handleDelete = async (id) => {
    setError('');
    if (!window.confirm('¿Seguro que quieres eliminar este módulo?')) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/api/modulos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      reloadModulos();
    } catch (err) {
      setError('No se pudo eliminar el módulo');
    }
  };

  return (
    <div className="admin-list" style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Panel de administración</h2>
      {/* Formulario para crear un nuevo módulo */}
      <ModuloCreateForm onCreated={reloadModulos} />
      <p>Selecciona un módulo para editar su información y elementos asociados:</p>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div>Cargando módulos...</div>
      ) : (
        <ul>
          {modulos.map(modulo => (
            <li key={modulo.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                className="admin-dashboard-btn"
                onClick={() => navigate(`/admin/modulos/${modulo.id}`)}
              >
                <strong>{modulo.nombre}</strong>
                <div style={{ fontSize: '0.98em', color: '#555', marginTop: 4 }}>
                  {modulo.descripcion?.slice(0, 80)}...
                </div>
              </button>
              <button
                className="error"
                style={{ marginLeft: 8 }}
                onClick={() => handleDelete(modulo.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPanel;