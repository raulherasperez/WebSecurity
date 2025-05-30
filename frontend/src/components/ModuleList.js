import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/ModuleList.css'; // Importamos los estilos

const ModuleList = () => {
  const modules = [
    { id: 1, title: 'Inyección SQL', path: '/modulo/sql-inyeccion' },
    { id: 2, title: 'XSS', path: '/modulo/xss' },
    { id: 3, title: 'CSRF', path: '/modulo/csrf' },
    { id: 4, title: 'Broken Access Control', path: '/modulo/bac' },
    { id: 5, title: 'Server Side Request Forgery', path: '/modulo/ssrf' },
    { id: 6, title: 'Broken Authentication', path: '/modulo/brokenauth' },
  ];

  const navigate = useNavigate();

  return (
    <aside className="module-sidebar">
      <h2>Módulos</h2>
      <ul>
        {modules.map((module) => (
          <li key={module.id}>
            <Link to={module.path}>{module.title}</Link>
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