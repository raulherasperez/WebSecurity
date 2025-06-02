import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/admin-panel.css';
const API_URL = process.env.REACT_APP_BACKEND_URL;

function AdminPanel() {
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/api/modulos`)
      .then(res => {
        setModulos(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="admin-list" style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Panel de administración</h2>
      <p>Selecciona un módulo para editar su información y elementos asociados:</p>
      {loading ? (
        <div>Cargando módulos...</div>
      ) : (
        <ul>
          {modulos.map(modulo => (
            <li key={modulo.id}>
              <button
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  fontSize: '1.1rem',
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  background: '#f5f5f5',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onClick={() => navigate(`/admin/modulos/${modulo.id}`)}
              >
                <strong>{modulo.nombre}</strong>
                <div style={{ fontSize: '0.98em', color: '#555', marginTop: 4 }}>
                  {modulo.descripcion?.slice(0, 80)}...
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPanel;