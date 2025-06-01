import React, { useEffect, useState } from 'react';
import { getLogrosDesbloqueados, getLogrosPendientes, desbloquearLogro } from '../services/logroService';
import './css/LogrosUsuario.css';

const LogrosUsuario = () => {
  const [desbloqueados, setDesbloqueados] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchLogros = async () => {
      setLoading(true);
      try {
        const [desb, pend] = await Promise.all([
          getLogrosDesbloqueados(token),
          getLogrosPendientes(token)
        ]);
        setDesbloqueados(desb.map(l => l.logro || l));
        setPendientes(pend);
      } catch {
        setMensaje('No se pudieron cargar los logros');
      }
      setLoading(false);
    };
    fetchLogros();
  }, [token]);

  const handleDesbloquear = async (nombreLogro) => {
    try {
      await desbloquearLogro(token, nombreLogro);
      setMensaje('¡Logro desbloqueado!');
      // Refresca la lista
      const [desb, pend] = await Promise.all([
        getLogrosDesbloqueados(token),
        getLogrosPendientes(token)
      ]);
      setDesbloqueados(desb.map(l => l.logro || l));
      setPendientes(pend);
    } catch {
      setMensaje('No se pudo desbloquear el logro');
    }
  };

  if (loading) return <div className="logros-usuario-container">Cargando logros...</div>;

  return (
    <div className="logros-usuario-container">
      <h2>Logros desbloqueados</h2>
      <ul>
        {desbloqueados.length === 0 && <li>No has desbloqueado logros aún.</li>}
        {desbloqueados.map(logro => (
        <li key={logro.id}>
          {logro.icono && (
            <img
              src={`data:image/png;base64,${logro.icono}`}
              alt={logro.nombre}
              style={{ height: 28, width: 28, marginLeft: 8, verticalAlign: 'middle', objectFit: 'contain' ,marginRight: 8}}
            />
          )}
          <strong>{logro.nombre}</strong> - {logro.descripcion}
        </li>
      ))}
      </ul>
      <h2>Logros pendientes</h2>
        <ul>
        {pendientes.length === 0 && <li>No tienes logros pendientes.</li>}
        {pendientes.map(logro => (
            <li key={logro.id}>
            <strong>{logro.nombre}</strong> - {logro.descripcion}
            {/* Elimina el botón de desbloquear */}
            </li>
        ))}
        </ul>
      {mensaje && <div style={{ marginTop: 12 }}>{mensaje}</div>}
    </div>
  );
};

export default LogrosUsuario;