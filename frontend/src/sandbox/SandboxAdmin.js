import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/SandboxShop.css';
import { useNavigate } from 'react-router-dom';

const SandboxAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:5001/sandbox/admin/usuarios');
      setUsuarios(res.data.usuarios || []);
    } catch {
      setMsg('Error al cargar usuarios');
    }
  };

  const verDetalle = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5001/sandbox/admin/usuario/${id}`);
      setDetalle(res.data);
      setMsg('');
    } catch {
      setMsg('Error al cargar detalle');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return;
    try {
      await axios.post(`http://localhost:5001/sandbox/admin/usuario/${id}/eliminar`);
      setUsuarios(usuarios.filter(u => u.id !== id));
      setDetalle(null);
    } catch {
      setMsg('Error al eliminar usuario');
    }
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    const { id, nombre, email, rol } = detalle.usuario;
    try {
      await axios.post(`http://localhost:5001/sandbox/admin/usuario/${id}/editar`, { nombre, email, rol });
      setMsg('Usuario editado');
      fetchUsuarios();
    } catch {
      setMsg('Error al editar usuario');
    }
  };

  return (
    <div className="sandbox-product-detail-page">
      <h3>Panel de administración</h3>
      {msg && <div className="sandbox-review-msg">{msg}</div>}
      <table style={{ width: '100%', marginTop: 18, background: '#fff', borderRadius: 8 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.rol}</td>
              <td>
                <button className="sandbox-btn" style={{padding:'4px 10px', fontSize:'0.95rem', marginRight:6}} onClick={() => navigate(`/sandbox-tienda/admin/usuario/${u.id}`)}>Ver</button>
                <button className="sandbox-btn" style={{padding:'4px 10px', fontSize:'0.95rem', background:'#e74c3c'}} onClick={() => handleEliminar(u.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {detalle && (
        <div style={{marginTop:32, background:'#f8fafc', borderRadius:8, padding:24}}>
          <h4>Detalle de usuario</h4>
          <form onSubmit={handleEditar} style={{display:'flex', flexDirection:'column', gap:8, maxWidth:340}}>
            <label>Nombre: <input value={detalle.usuario.nombre} onChange={e => setDetalle({...detalle, usuario: {...detalle.usuario, nombre: e.target.value}})} /></label>
            <label>Email: <input value={detalle.usuario.email} onChange={e => setDetalle({...detalle, usuario: {...detalle.usuario, email: e.target.value}})} /></label>
            <label>Rol:
              <select value={detalle.usuario.rol} onChange={e => setDetalle({...detalle, usuario: {...detalle.usuario, rol: e.target.value}})}>
                <option value="usuario">usuario</option>
                <option value="admin">admin</option>
              </select>
            </label>
            <button className="sandbox-btn" type="submit">Guardar cambios</button>
          </form>
          <h5 style={{marginTop:18}}>Historial de compras</h5>
          <ul>
            {detalle.compras.length === 0 && <li>No hay compras</li>}
            {detalle.compras.map(c => (
              <li key={c.id}>{c.fecha}: {c.nombre} ({c.precio}€)</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SandboxAdmin;