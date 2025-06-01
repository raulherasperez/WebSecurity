import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './css/VMEdicion.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const VMEdicion = () => {
  const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [enlaceDescarga, setEnlaceDescarga] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchVM = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/vms/${id}`);
        setNombre(res.data.nombre);
        setDescripcion(res.data.descripcion);
        setEnlaceDescarga(res.data.enlaceDescarga);
      } catch {
        setError('No se pudo cargar la máquina.');
      } finally {
        setLoading(false);
      }
    };
    fetchVM();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(
        `${API_URL}/api/vms/${id}`,
        { nombre, descripcion, enlaceDescarga },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/machines/${id}`);
    } catch {
      setError('No se pudo guardar la máquina.');
    }
  };

  if (loading) return <div className="vm-edicion-loading">Cargando...</div>;
  if (error) return <div className="vm-edicion-error">{error}</div>;

  return (
    <div className="vm-edicion-container">
      <Link to={`/machines/${id}`} className="vm-edicion-back">&larr; Volver al detalle</Link>
      <h2>Editar máquina virtual</h2>
      <form onSubmit={handleSubmit} className="vm-edicion-form">
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <label>Descripción:</label>
        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          required
        />
        <label>Enlace de descarga:</label>
        <input
          type="url"
          value={enlaceDescarga}
          onChange={e => setEnlaceDescarga(e.target.value)}
          required
        />
        <button type="submit" className="vm-edicion-btn">Guardar cambios</button>
      </form>
    </div>
  );
};

export default VMEdicion;