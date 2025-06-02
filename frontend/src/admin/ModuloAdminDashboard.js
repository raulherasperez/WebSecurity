import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ModuloInfoForm from './ModuloInfoForm';
import PistasList from './PistasList';
import SolucionesList from './SolucionesList';
import DescripcionesTecnicasList from './DescripcionesTecnicasList';
import EjemplosList from './EjemplosList';
import PreguntasQuizCodigoList from './PreguntasQuizCodigoList';
import PreguntasTeoricasList from './PreguntasTeoricasList';
import axios from 'axios';
import './css/admin-panel.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function ModuloAdminDashboard() {
  const { id } = useParams();
  const [modulo, setModulo] = useState(null);
  const [section, setSection] = useState('info');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/api/modulos/${id}`)
      .then(res => {
        setModulo(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="admin-dashboard-center">Cargando módulo...</div>;
  if (!modulo) return <div className="admin-dashboard-center">No se encontró el módulo.</div>;

  return (
    <div className="admin-dashboard-center">
      <div className="admin-dashboard-content">
        <h3 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>
          Administrar módulo: {modulo.nombre}
        </h3>
        <ul className="admin-dashboard-menu">
          <li>
            <button
              className={`admin-dashboard-btn${section === 'info' ? ' active' : ''}`}
              onClick={() => setSection('info')}
            >
              Editar información general
            </button>
          </li>
          <li>
            <button
              className={`admin-dashboard-btn${section === 'pistas' ? ' active' : ''}`}
              onClick={() => setSection('pistas')}
            >
              Editar pistas
            </button>
          </li>
          <li>
            <button
              className={`admin-dashboard-btn${section === 'soluciones' ? ' active' : ''}`}
              onClick={() => setSection('soluciones')}
            >
              Editar soluciones
            </button>
          </li>
          <li>
            <button
              className={`admin-dashboard-btn${section === 'descripciones' ? ' active' : ''}`}
              onClick={() => setSection('descripciones')}
            >
              Editar descripciones técnicas
            </button>
          </li>
          <li>
            <button
              className={`admin-dashboard-btn${section === 'ejemplos' ? ' active' : ''}`}
              onClick={() => setSection('ejemplos')}
            >
              Editar ejemplos
            </button>
          </li>
          <li>
            <button
              className={`admin-dashboard-btn${section === 'quizcodigo' ? ' active' : ''}`}
              onClick={() => setSection('quizcodigo')}
            >
              Editar preguntas de quiz de código
            </button>
          </li>
          <li>
            <button
              className={`admin-dashboard-btn${section === 'teoricas' ? ' active' : ''}`}
              onClick={() => setSection('teoricas')}
            >
              Editar preguntas teóricas
            </button>
          </li>
        </ul>
        <div style={{ marginTop: 32 }}>
          {section === 'info' && <ModuloInfoForm modulo={modulo} />}
          {section === 'pistas' && <PistasList moduloId={modulo.id} />}
          {section === 'soluciones' && <SolucionesList moduloId={modulo.id} />}
          {section === 'descripciones' && <DescripcionesTecnicasList moduloId={modulo.id} />}
          {section === 'ejemplos' && <EjemplosList moduloId={modulo.id} />}
          {section === 'quizcodigo' && <PreguntasQuizCodigoList moduloId={modulo.id} />}
          {section === 'teoricas' && <PreguntasTeoricasList moduloId={modulo.id} />}
        </div>
      </div>
    </div>
  );
}

export default ModuloAdminDashboard;