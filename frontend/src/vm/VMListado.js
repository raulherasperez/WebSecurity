import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/VMListado.css';
import SidebarMenu from '../components/SidebarMenu';
import LogoHomeLink from '../components/LogoHomeLink';

const VMListado = () => {
  const [vms, setVMs] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Comprobar si hay usuario con sesión iniciada
  const user = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchVMs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/vms');
        setVMs(response.data);
      } catch (err) {
        setError('No se pudieron cargar las máquinas virtuales.');
      }
    };
    fetchVMs();
  }, []);

  if (error) return <div>{error}</div>;

  return (
  
   
      <div className="vm-listado-container">
        <div className="vm-listado-header">
          <h2>Máquinas Virtuales</h2>
          {user && (
            <button
              className="vm-listado-crear-btn"
              onClick={() => navigate('/machines/crear')}
            >
              + Añadir máquina
            </button>
          )}
        </div>
        <ul className="vm-listado-list">
          {vms.map(vm => (
            <li key={vm.id} className="vm-listado-item">
              <Link to={`/machines/${vm.id}`} className="vm-listado-title">
                {vm.nombre}
              </Link>
              <div className="vm-listado-meta">
                Añadida por: {vm.usuario?.username || 'Desconocido'} | {new Date(vm.fechaAñadida).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
   
  );
};

export default VMListado;