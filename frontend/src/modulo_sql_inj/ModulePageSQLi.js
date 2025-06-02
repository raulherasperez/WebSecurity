import React, { useState, useEffect } from 'react';
import './css/ModulePage.css';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

import InteractiveTest from '../components/InteractiveTest';
import ModuleList from '../components/ModuleList';
import ModuleComments from '../components/ModuleComments';
import CodeQuiz from '../codequiz/CodeQuiz';
import MDEditor from '@uiw/react-md-editor';

function ModulePageSQLi() {
  const [showDetails, setShowDetails] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showHint, setShowHint] = useState({});
  const [showSolution, setShowSolution] = useState({});
  const [showCodeQuiz, setShowCodeQuiz] = useState(false);
  const [showDescripcionTecnica, setShowDescripcionTecnica] = useState(false);

  const [nivel, setNivel] = useState('facil');
  const { user } = useAuth();

  const [modulo, setModulo] = useState(null);
  const [loadingModulo, setLoadingModulo] = useState(true);

  console.log(modulo?.soluciones)
  console.log(modulo?.id)

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

  useEffect(() => {
    setLoadingModulo(true);
    axios.get(`${API_URL}/api/modulos/1`)
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

  const preguntasTeoricasAdaptadas = (modulo?.preguntasTeoricas || []).map(q => ({
    question: q.pregunta,
    options: q.opciones,
    correctAnswer: q.respuesta
  }));

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
                  ? 'Sin protección, vulnerable a cualquier SQLi.'
                  : nivel === 'medio'
                  ? 'Filtrado básico, pero aún vulnerable a técnicas conocidas.'
                  : nivel === 'dificil'
                  ? 'Consultas preparadas, pero quedan vectores avanzados (blind/error-based).'
                  : 'Todas las protecciones activadas, no vulnerable.'
              }
              className="markdown-content"
              data-color-mode="light"
            />
          </div>
        </section>

        {/* Ejemplo */}
        <section>
          <h2>
            <MDEditor.Markdown source={'Ejemplo'} className="markdown-content" data-color-mode="light" />
          </h2>
          <button onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Ocultar detalles' : 'Mostrar detalles'}
          </button>
          {showDetails && modulo.ejemplos && modulo.ejemplos.length > 0 && (
            <div className="example-details">
              <h4>
                <MDEditor.Markdown source={modulo.ejemplos[0].titulo} className="markdown-content" data-color-mode="light" />
              </h4>
              <MDEditor.Markdown source={modulo.ejemplos[0].descripcion} className="markdown-content" data-color-mode="light" />
              <pre className="sql-code">{modulo.ejemplos[0].codigo}</pre>
            </div>
          )}
        </section>

        {/* Vídeo */}
        <section>
          <h2>
            <MDEditor.Markdown source={'Vídeo'} className="markdown-content" data-color-mode="light" />
          </h2>
          <button onClick={() => setShowVideo(!showVideo)}>
            {showVideo ? 'Ocultar vídeo' : 'Mostrar vídeo'}
          </button>
          {showVideo && (
            <div className="video-container">
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

        {/* Test teórico */}
        <section>
          <h2>
            <MDEditor.Markdown source={'Test teórico'} className="markdown-content" data-color-mode="light" />
          </h2>
          <MDEditor.Markdown
            source={'¿Estás listo para poner a prueba tus conocimientos? Haz clic en el siguiente botón para acceder al test teórico:'}
            className="markdown-content"
            data-color-mode="light"
          />
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
              localStorage.setItem('nivelSQLi', nivel);
              window.open('/modulo/sql-inyeccion/tienda', '_blank');
            }}
          >
            Abrir entorno vulnerable
          </button>
          <div style={{ marginTop: 18 }}>
            <MDEditor.Markdown
              source={
                '¿Quieres reiniciar tu progreso en la tienda vulnerable? Puedes limpiar tu sesión y los retos completados con este botón. ' +
                'Si has desbloqueado logros, se mantendrán, pero perderás el progreso en los retos de SQLi.'
              }
              className="markdown-content"
              data-color-mode="light"
            />
            <button
              className="sandbox-button"
              style={{ background: '#e53935', color: '#fff' }}
              onClick={() => {
                localStorage.removeItem('vshopLogin');
                localStorage.removeItem('vshopRetosCompletados');
                window.location.reload();
              }}
            >
              Limpiar progreso SQLi
            </button>
          </div>

          {/* Quiz de código SQLi en desplegable */}
          <details style={{ marginTop: 32 }}>
            <summary
              style={{ cursor: 'pointer', fontWeight: 600, fontSize: '1.08em', marginBottom: 8 }}
              onClick={() => setShowCodeQuiz(s => !s)}
            >
              <MDEditor.Markdown source={'¿Reconoces el código vulnerable? (quiz interactivo)'} className="markdown-content" data-color-mode="light" />
            </summary>
            {showCodeQuiz && (
              <div style={{ marginTop: 18 }}>
                <CodeQuiz questions={modulo.preguntasQuizCodigo || []} />
              </div>
            )}
          </details>

          {/* Descripción técnica en desplegable igual que el quiz, usando Markdown */}
          <details style={{ marginTop: 24 }}>
            <summary
              style={{ cursor: 'pointer', fontWeight: 600, fontSize: '1.08em', marginBottom: 8 }}
              onClick={() => setShowDescripcionTecnica(s => !s)}
            >
              <MDEditor.Markdown source={'Ver explicación técnica de este nivel'} className="markdown-content" data-color-mode="light" />
            </summary>
            {showDescripcionTecnica && (
              <div style={{ marginTop: 18 }}>
                {descripcionTecnica ? (
                  <div>
                    <MDEditor.Markdown
                      source={descripcionTecnica.descripcion}
                      className="markdown-content"
                      data-color-mode="light"
                    />
                    {descripcionTecnica.codigoEjemplo && (
                      <pre className="sql-code">{descripcionTecnica.codigoEjemplo}</pre>
                    )}
                  </div>
                ) : (
                  <MDEditor.Markdown source={'No hay descripción técnica para este nivel.'} className="markdown-content" data-color-mode="light" />
                )}
              </div>
            )}
          </details>
        </section>

        {/* Comentarios */}
        <ModuleComments moduleId={modulo.id} user={user} />
      </main>
      <ModuleList />
      <footer className="App-footer"></footer>
    </div>
  );
}

export default ModulePageSQLi;