import React, { useEffect, useState } from 'react';
import { getAllLogros } from '../services/logroService';
import './css/LogrosUsuario.css';

const LogrosAdmin = () => {
  const [logros, setLogros] = useState([]);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    getAllLogros(token).then(setLogros);
  }, [token]);

  return (
    <div className="logros-usuario-container">
      <h2>Todos los logros (admin)</h2>
      <ul>
        {logros.length === 0 && <li>No hay logros registrados.</li>}
        {logros.map(logro => (
          <li key={logro.id}>
            <strong>{logro.nombre}</strong> - {logro.descripcion}
            {logro.icono && (
              <img src={logro.icono.startsWith('http') ? logro.icono : `/uploads/${logro.icono}`} alt={logro.nombre} style={{ height: 32, marginLeft: 8 }} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogrosAdmin;