import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './css/ModulePage.css';

import InteractiveTest from '../components/InteractiveTest';
import ModuleList from '../components/ModuleList';
import ModuleComments from '../components/ModuleComments';
import CodeQuiz from '../codequiz/CodeQuiz';
import MDEditor from '@uiw/react-md-editor';
import axios from 'axios';

function ModulePageCSRF() {
  const { user } = useAuth();

  const [showHint, setShowHint] = useState({});
  const [showSolution, setShowSolution] = useState({});
  const [showExample, setShowExample] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showCodeQuiz, setShowCodeQuiz] = useState(false);

  // Nivel de dificultad
  const [nivel, setNivel] = useState('facil');

  // Mensaje de éxito al reiniciar comentarios
  const [resetMsg, setResetMsg] = useState('');

  // Estado para datos del backend
  const [modulo, setModulo] = useState(null);
  const [loadingModulo, setLoadingModulo] = useState(true);

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  // Mapear nivel string a enum del backend
  const nivelEnum = {
    'facil': 'FACIL',
    'medio': 'MEDIO',
    'dificil': 'DIFICIL',
    'imposible': 'IMPOSIBLE'
  };

  // Obtener descripción técnica según nivel
  const getDescripcionTecnica = () => {
    if (!modulo || !modulo.descripcionesTecnicas) return null;
    return modulo.descripcionesTecnicas.find(
      d => d.nivel === nivelEnum[nivel]
    );
  };

  // Obtener todas las pistas y soluciones según nivel
  const pistasActuales = (modulo?.pistas || []).filter(p => p.nivel === nivelEnum[nivel]);
  const solucionesActuales = (modulo?.soluciones || []).filter(s => s.nivel === nivelEnum[nivel]);

  // Adaptar preguntas teóricas si existen
  const preguntasTeoricasAdaptadas = (modulo?.preguntasTeoricas || []).map(q => ({
    question: q.pregunta,
    options: q.opciones,
    correctAnswer: q.respuesta
  }));

  // Adaptar preguntas de quiz de código si existen
  const csrfQuizQuestions = modulo?.preguntasQuizCodigo || [];

  useEffect(() => {
    setLoadingModulo(true);
    // El id del módulo CSRF debe coincidir con el backend (ajusta si es necesario)
    axios.get(`${API_URL}/api/modulos/3`)
      .then(res => {
        setModulo(res.data);
        setLoadingModulo(false);
      })
      .catch(err => {
        console.error('Error al cargar el módulo:', err);
        setLoadingModulo(false);
      });
  }, [API_URL]);

  if (loadingModulo) return <div>Cargando módulo...</div>;
  if (!modulo) return <div>No se encontró el módulo.</div>;

  const descripcionTecnica = getDescripcionTecnica();

  return (
    <div className="ModulePage">
      <main className="ModuleContent">
        <h1 className="h1">
          <MDEditor.Markdown source={modulo.nombre} className="markdown-content" data-color-mode="light" />
        </h1>
        <MDEditor.Markdown source={modulo.descripcion} className="markdown-content" data-color-mode="light" />

        {/* Selector de nivel de dificultad */}
        <section>
          <h2>
            <MDEditor.Markdown source={'Selecciona el nivel de dificultad'} className="markdown-content" data-color-mode="light" />
          </h2>
          <label style={{ fontWeight: 600, marginRight: 8 }}>
            <MDEditor.Markdown source={'Nivel:'} className="markdown-content" data-color-mode="light" />
          </label>
          <select value={nivel} onChange={e => setNivel(e.target.value)}>
            <option value="facil">Fácil</option>
            <option value="medio">Medio</option>
            <option value="dificil">Difícil</option>
            <option value="imposible">Imposible</option>
          </select>
          <div style={{ marginTop: 8, color: '#555', fontSize: '0.98em' }}>
            <MDEditor.Markdown
              source={
                nivel === 'facil'
                  ? 'Sin protección, vulnerable a cualquier CSRF.'
                  : nivel === 'medio'
                  ? 'Verificación básica de Referer/Origin, pero sin token.'
                  : nivel === 'dificil'
                  ? 'Requiere token CSRF débil, pero puede ser predecible.'
                  : 'Token CSRF robusto y verificación estricta, no vulnerable.'
              }
              className="markdown-content"
              data-color-mode="light"
            />
          </div>
        </section>

        {/* Ejemplo en desplegable */}
        <section>
          <h2>
            <MDEditor.Markdown source={'Ejemplo'} className="markdown-content" data-color-mode="light" />
          </h2>
          <button onClick={() => setShowExample(e => !e)}>
            {showExample ? 'Ocultar ejemplo' : 'Mostrar ejemplo'}
          </button>
          {showExample && modulo.ejemplos && modulo.ejemplos.length > 0 && (
            <div className="example-details" style={{ marginTop: 14 }}>
              <h4>
                <MDEditor.Markdown source={modulo.ejemplos[0].titulo} className="markdown-content" data-color-mode="light" />
              </h4>
              <MDEditor.Markdown source={modulo.ejemplos[0].descripcion} className="markdown-content" data-color-mode="light" />
              {modulo.ejemplos[0].codigo && (
                <pre className="sql-code">{modulo.ejemplos[0].codigo}</pre>
              )}
            </div>
          )}
        </section>

        {/* Vídeo en desplegable */}
        <section>
          <h2>
            <MDEditor.Markdown source={'Vídeo'} className="markdown-content" data-color-mode="light" />
          </h2>
          <button onClick={() => setShowVideo(v => !v)}>
            {showVideo ? 'Ocultar vídeo' : 'Mostrar vídeo'}
          </button>
          {showVideo && (
            <div className="video-container" style={{ marginTop: 14 }}>
              <iframe
                width="560"
                height="315"
                src={modulo.videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </section>

        {/* Test interactivo */}
        <section>
          <h2>
            <MDEditor.Markdown source={'Test teórico'} className="markdown-content" data-color-mode="light" />
          </h2>
          <InteractiveTest questions={preguntasTeoricasAdaptadas} />
        </section>

        {/* Ejercicios con pistas y soluciones por nivel */}
        <section>
          <h2>
            <MDEditor.Markdown source={'Ejercicios'} className="markdown-content" data-color-mode="light" />
          </h2>
          {/* Mostrar la descripción de ejercicios en Markdown */}
          {modulo.descripcionEjercicios && (
            <div style={{ marginBottom: 16 }}>
              <MDEditor.Markdown
                source={modulo.descripcionEjercicios}
                className="markdown-content"
                data-color-mode="light"
              />
            </div>
          )}

          {/* Mostrar todas las pistas */}
          <MDEditor.Markdown
            source={pistasActuales.length > 0 ? 'Pistas para este nivel:' : 'No hay pistas para este nivel.'}
            className="markdown-content"
            data-color-mode="light"
          />
          {pistasActuales.map((pista, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <button className="hint-btn" onClick={() => setShowHint(h => ({ ...h, [idx]: !h[idx] }))}>
                {showHint[idx] ? 'Ocultar pista' : `Mostrar pista ${idx + 1}`}
              </button>
              {showHint[idx] && (
                <div className="hint-box">
                  <MDEditor.Markdown source={pista.texto} className="markdown-content" data-color-mode="light" />
                </div>
              )}
            </div>
          ))}

          {/* Mostrar todas las soluciones */}
          <MDEditor.Markdown
            source={solucionesActuales.length > 0 ? 'Soluciones para este nivel:' : 'No hay soluciones para este nivel.'}
            className="markdown-content"
            data-color-mode="light"
          />
          {solucionesActuales.map((solucion, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <button className="hint-btn" onClick={() => setShowSolution(s => ({ ...s, [idx]: !s[idx] }))}>
                {showSolution[idx] ? 'Ocultar solución' : `Mostrar solución ${idx + 1}`}
              </button>
              {showSolution[idx] && (
                <div className="hint-box solution-box">
                  <MDEditor.Markdown source={solucion.texto} className="markdown-content" data-color-mode="light" />
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Acceso al entorno vulnerable */}
        <section>
          <h2>
            <MDEditor.Markdown source={'Acceso al entorno vulnerable'} className="markdown-content" data-color-mode="light" />
          </h2>
          <MDEditor.Markdown source={modulo.infoEntorno} className="markdown-content" data-color-mode="light" />
          <button
            className="sandbox-button"
            style={{ marginTop: 12 }}
            onClick={() => {
              localStorage.setItem('nivelCSRF', nivel);
              window.open('/modulo/csrf/entorno-foro', '_blank');
            }}
          >
            Abrir entorno vulnerable Foro
          </button>
          <div style={{ marginTop: 18 }}>
            <MDEditor.Markdown
              source={
                '¿Quieres reiniciar los comentarios del foro? Puedes restaurar los comentarios originales con este botón.'
              }
              className="markdown-content"
              data-color-mode="light"
            />
            <button
              className="sandbox-button"
              style={{ background: '#e53935', color: '#fff' }}
              onClick={async () => {
                setResetMsg('');
                // Reiniciar comentarios del foro
                const res = await fetch(`${process.env.REACT_APP_VULNERABLE_URL}/foro-reset-comentarios`, { method: 'POST' });
                // Reiniciar nivel CSRF en el backend
                await fetch(`${process.env.REACT_APP_VULNERABLE_URL}/reset-nivel-csrf`, {
                  method: 'POST',
                  credentials: 'include'
                });
                if (res.ok) {
                  setResetMsg('¡Comentarios del foro y nivel de dificultad restaurados correctamente!');
                } else {
                  setResetMsg('No se pudo reiniciar el foro. Inténtalo de nuevo.');
                }
              }}
            >
              Reiniciar comentarios del foro
            </button>
            {resetMsg && (
              <div style={{ marginTop: 10, color: resetMsg.startsWith('¡') ? '#388e3c' : '#b71c1c', fontWeight: 500 }}>
                {resetMsg}
              </div>
            )}
          </div>
        </section>

        <section>
          <details style={{ marginTop: 32 }}>
            <summary
              style={{
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1.08em',
                marginBottom: 8
              }}
              onClick={() => setShowCodeQuiz(s => !s)}
            >
              <MDEditor.Markdown source={'¿Reconoces el código vulnerable? (quiz interactivo)'} className="markdown-content" data-color-mode="light" />
            </summary>
            {showCodeQuiz && (
              <div style={{ marginTop: 18 }}>
                <CodeQuiz questions={csrfQuizQuestions} />
              </div>
            )}
          </details>
        </section>

        {/* Explicación técnica de la vulnerabilidad en un desplegable */}
        <details style={{ marginTop: 32 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '1.08em' }}>
            ¿Por qué funciona la vulnerabilidad? (ver explicación técnica)
          </summary>
          <div style={{ marginTop: 16 }}>
            {descripcionTecnica ? (
              <MDEditor.Markdown source={descripcionTecnica.descripcion} className="markdown-content" data-color-mode="light" />
            ) : (
              <MDEditor.Markdown source={'No hay descripción técnica para este nivel.'} className="markdown-content" data-color-mode="light" />
            )}
          </div>
        </details>

        <ModuleComments moduleId={modulo.id} user={user} />

      </main>
      <ModuleList />
      <footer className="App-footer">
      </footer>
    </div>
  );
}

export default ModulePageCSRF;