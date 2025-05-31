import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/SandboxShop.css';

const API_URL = process.env.REACT_APP_VULNERABLE_URL;

const SandboxUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detalle, setDetalle] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await axios.get(`${API_URL}/sandbox/admin/usuario/${id}`);
        setDetalle(res.data);
        setMsg('');
      } catch {
        setMsg('Error al cargar detalle');
      }
    };
    fetchDetalle();
  }, [id]);

  const handleEditar = async (e) => {
    e.preventDefault();
    const { id, nombre, email, rol } = detalle.usuario;
    try {
      await axios.post(`${API_URL}/sandbox/admin/usuario/${id}/editar`, { nombre, email, rol });
      setMsg('Usuario editado');
    } catch {
      setMsg('Error al editar usuario');
    }
  };

  return (
    <div className="sandbox-user-detail-page">
      <button className="sandbox-btn" onClick={() => navigate(-1)} style={{ marginBottom: 18 }}>
        Volver al panel
      </button>
      <h4>Detalle de usuario</h4>
      {msg && <div className="sandbox-review-msg">{msg}</div>}
      {detalle && (
        <>
          <form onSubmit={handleEditar} className="sandbox-user-detail-form">
            <label>Nombre:
              <input value={detalle.usuario.nombre} onChange={e => setDetalle({...detalle, usuario: {...detalle.usuario, nombre: e.target.value}})} />
            </label>
            <label>Email:
              <input value={detalle.usuario.email} onChange={e => setDetalle({...detalle, usuario: {...detalle.usuario, email: e.target.value}})} />
            </label>
            <label>Rol:
              <select value={detalle.usuario.rol} onChange={e => setDetalle({...detalle, usuario: {...detalle.usuario, rol: e.target.value}})}>
                <option value="usuario">usuario</option>
                <option value="admin">admin</option>
              </select>
            </label>
            <button className="sandbox-btn" type="submit">Guardar cambios</button>
          </form>
          <div className="sandbox-user-purchases">
            <h5>Historial de compras</h5>
            <ul>
              {detalle.compras.length === 0 && <li>No hay compras</li>}
              {detalle.compras.map(c => (
                <li key={c.id}>{c.fecha}: {c.nombre} ({c.precio}€)</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SandboxUserDetail;