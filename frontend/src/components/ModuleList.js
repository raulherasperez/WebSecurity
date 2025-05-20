import React from 'react';
import { Link } from 'react-router-dom';
import './css/ModuleList.css'; // Importamos los estilos

const ModuleList = () => {
  const modules = [
    { id: 1, title: 'Inyección SQL', path: '/modulo/sql-inyeccion' },
    { id: 2, title: 'XSS', path: '/modulo/xss' },
    { id: 3, title: 'CSRF', path: '/modulo/csrf' },
    { id: 4, title: 'Insecure Deserialization', path: '/modulo/deserializacion-insegura' },
    { id: 5, title: 'Security Misconfiguration', path: '/modulo/configuracion-insegura' },
    { id: 6, title: 'Sensitive Data Exposure', path: '/modulo/exposicion-datos' },
    { id: 7, title: 'Broken Access Control', path: '/modulo/acceso-roto' },
    { id: 8, title: 'Vulnerable Components', path: '/modulo/componentes-vulnerables' },
    { id: 9, title: 'Logging & Monitoring', path: '/modulo/logs-monitoring' },
    { id: 10, title: 'API Security', path: '/modulo/api-security' }
  ];

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
    </aside>
  );
};

export default ModuleList;