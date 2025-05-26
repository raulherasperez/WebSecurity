import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './css/Reporte.css';
import SidebarMenu from '../components/SidebarMenu';
import LogoHomeLink from '../components/LogoHomeLink';


const ReporteListado = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('http://localhost:8080/api/reportes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReportes(res.data);
      } catch {
        setError('No se pudieron cargar los reportes.');
      } finally {
        setLoading(false);
      }
    };
    fetchReportes();
  }, []);

  if (loading) return <div className="reporte-loading">Cargando...</div>;
  if (error) return <div className="reporte-error">{error}</div>;

  return (

    <div className="reporte-container">
      <h2>Reportes de errores</h2>
      <a href="/reportes/crear" className="reporte-crear-btn">+ Nuevo reporte</a>
      <ul className="reporte-list">
        {reportes.map(rep => (
          <li key={rep.id} className="reporte-item">
            <div className="reporte-titulo">
              <strong>{rep.titulo}</strong>
              <span className="reporte-autor">
                {user?.rol === 'ADMIN' && ` | Usuario: ${rep.usuario?.username}`}
              </span>
            </div>
            <div className="reporte-texto">{rep.texto}</div>
            <div className="reporte-fecha">{new Date(rep.fechaPublicacion).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>

  );
};

export default ReporteListado;