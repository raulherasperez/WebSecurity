import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './css/VMCreador.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const VMCreador = () => {
  const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [enlaceDescarga, setEnlaceDescarga] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(!!id);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (id) {
      const fetchVM = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/vms/${id}`);
          if (res.data.usuario?.username !== username) {
            setMessage('No tienes permiso para editar esta máquina.');
          } else {
            setNombre(res.data.nombre);
            setDescripcion(res.data.descripcion);
            setEnlaceDescarga(res.data.enlaceDescarga);
          }
        } catch {
          setMessage('No se pudo cargar la máquina.');
        } finally {
          setLoading(false);
        }
      };
      fetchVM();
    }
  }, [id, username, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (id) {
        await axios.put(
          `${API_URL}/api/vms/${id}`,
          { nombre, descripcion, enlaceDescarga },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        navigate(`/machines/${id}`);
      } else {
        await axios.post(
          `${API_URL}/api/vms`,
          { nombre, descripcion, enlaceDescarga },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        navigate('/machines');
      }
    } catch {
      setMessage('No se pudo guardar la máquina.');
    }
  };

  if (loading) return <div className="vm-detalle-loading">Cargando...</div>;

  return (
    <div className="vm-crear-container">
      <h2>{id ? 'Editar máquina virtual' : 'Añadir máquina virtual'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            className="vm-crear-titulo"
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            required
            className="vm-crear-titulo"
            style={{ minHeight: 80 }}
          />
        </div>
        <div>
          <label>Enlace de descarga:</label>
          <input
            type="url"
            value={enlaceDescarga}
            onChange={e => setEnlaceDescarga(e.target.value)}
            required
            className="vm-crear-titulo"
          />
        </div>
        <button type="submit" className="vm-crear-btn">{id ? 'Guardar cambios' : 'Publicar máquina'}</button>
        {message && <p className="vm-crear-error">{message}</p>}
      </form>
    </div>
  );
};

export default VMCreador;