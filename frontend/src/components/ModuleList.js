import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/ModuleList.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Módulos con página específica y su path
const staticModules = [
  { id: 1, title: 'Inyección SQL', path: '/modulo/sql-inyeccion' },
  { id: 2, title: 'XSS', path: '/modulo/xss' },
  { id: 3, title: 'CSRF', path: '/modulo/csrf' },
  { id: 4, title: 'Broken Access Control', path: '/modulo/bac' },
  { id: 5, title: 'Server Side Request Forgery', path: '/modulo/ssrf' },
  { id: 6, title: 'Broken Authentication', path: '/modulo/brokenauth' },
];

const staticIds = staticModules.map(m => m.id);

const ModuleList = () => {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/modulos`)
      .then(res => setModules(res.data))
      .catch(() => setModules([]));
  }, []);

  return (
    <aside className="module-sidebar">
      <h2>Módulos</h2>
      <ul>
        {/* Módulos con página específica */}
        {staticModules.map(module => (
          <li key={module.id}>
            <Link to={module.path}>{module.title}</Link>
          </li>
        ))}
        {/* Módulos dinámicos (los que no están en la lista estática) */}
        {modules
          .filter(module => !staticIds.includes(module.id))
          .map(module => (
            <li key={module.id}>
              <Link to={`/modulo/${module.id}`}>{module.nombre}</Link>
            </li>
          ))}
      </ul>
      <button
        className="sandbox-access-btn"
        style={{ marginTop: 24, width: '100%' }}
        onClick={() => window.open('/sandbox-tienda')}
      >
        Acceder al Sandbox
      </button>
    </aside>
  );
};

export default ModuleList;