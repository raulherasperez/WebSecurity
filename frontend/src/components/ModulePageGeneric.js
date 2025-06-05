import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import ModuleComments from '../components/ModuleComments';
import ModuleList from '../components/ModuleList';
import InteractiveTest from '../components/InteractiveTest';
import CodeQuiz from '../codequiz/CodeQuiz';
import './css/ModulePage.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function ModulePageGeneric() {
  const { id } = useParams();
  const [modulo, setModulo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showCodeQuiz, setShowCodeQuiz] = useState(false);
  const [showDescripcionTecnica, setShowDescripcionTecnica] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/api/modulos/${id}`)
      .then(res => {
        setModulo(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Cargando módulo...</div>;
  if (!modulo) return <div>No se encontró el módulo.</div>;

  // Adaptar preguntas teóricas para InteractiveTest
  const preguntasTeoricasAdaptadas = (modulo?.preguntasTeoricas || []).map(q => ({
    question: q.pregunta,
    options: q.opciones,
    correctAnswer: q.respuesta
  }));

  // Explicación técnica (si hay descripcionesTecnicas)
  const descripcionTecnica = modulo?.descripcionesTecnicas && modulo.descripcionesTecnicas.length > 0
    ? modulo.descripcionesTecnicas[0]
    : null;

  return (
    <div className="ModulePage">
      <main className="ModuleContent">
        <h1 className="h1">
          <MDEditor.Markdown source={modulo.nombre} className="markdown-content" data-color-mode="light" />
        </h1>
        <MDEditor.Markdown source={modulo.descripcion} className="markdown-content" data-color-mode="light" />

        {/* Ejemplos */}
        <section>
          <h2>
            <MDEditor.Markdown source={'Ejemplos'} className="markdown-content" data-color-mode="light" />
          </h2>
          <button onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Ocultar detalles' : 'Mostrar detalles'}
          </button>
          {showDetails && modulo.ejemplos && modulo.ejemplos.length > 0 && (
            <div className="example-details">
              {modulo.ejemplos.map((ejemplo, idx) => (
                <div key={ejemplo.id || idx} style={{ marginBottom: 24 }}>
                  <h4>
                    <MDEditor.Markdown source={ejemplo.titulo} className="markdown-content" data-color-mode="light" />
                  </h4>
                  <MDEditor.Markdown source={ejemplo.descripcion} className="markdown-content" data-color-mode="light" />
                  <pre className="sql-code">{ejemplo.codigo}</pre>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Vídeo */}
        {modulo.videoUrl && (
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
        )}

        {/* Descripción de ejercicios */}
        {modulo.descripcionEjercicios && (
          <section>
            <h2>
              <MDEditor.Markdown source={'Descripción de ejercicios'} className="markdown-content" data-color-mode="light" />
            </h2>
            <MDEditor.Markdown
              source={modulo.descripcionEjercicios}
              className="markdown-content"
              data-color-mode="light"
            />
          </section>
        )}

        {/* Test teórico */}
        {preguntasTeoricasAdaptadas.length > 0 && (
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
        )}
        {/* Información del entorno */}
        {modulo.infoEntorno && (
          <section>
            <h2>
              <MDEditor.Markdown source={'Información del entorno'} className="markdown-content" data-color-mode="light" />
            </h2>
            <MDEditor.Markdown source={modulo.infoEntorno} className="markdown-content" data-color-mode="light" />
            {modulo.vulnerableUrl && (
              <a
                href={modulo.vulnerableUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sandbox-button"
                style={{ marginTop: 12, display: 'inline-block' }}
              >
                Ir al entorno vulnerable
              </a>
            )}
          </section>
        )}

        {/* Quiz de código */}
        {modulo.preguntasQuizCodigo && modulo.preguntasQuizCodigo.length > 0 && (
          <section>
            <details style={{ marginTop: 24 }}>
              <summary
                style={{ cursor: 'pointer', fontWeight: 600, fontSize: '1.08em', marginBottom: 8 }}
                onClick={() => setShowCodeQuiz(s => !s)}
              >
                <MDEditor.Markdown source={'¿Reconoces el código vulnerable? (quiz interactivo)'} className="markdown-content" data-color-mode="light" />
              </summary>
              {showCodeQuiz && (
                <div style={{ marginTop: 18 }}>
                  <CodeQuiz questions={modulo.preguntasQuizCodigo} />
                </div>
              )}
            </details>
          </section>
        )}

        {/* Explicación técnica */}
        {descripcionTecnica && (
          <section>
            <details style={{ marginTop: 24 }}>
              <summary
                style={{ cursor: 'pointer', fontWeight: 600, fontSize: '1.08em', marginBottom: 8 }}
                onClick={() => setShowDescripcionTecnica(s => !s)}
              >
                <MDEditor.Markdown source={'Ver explicación técnica'} className="markdown-content" data-color-mode="light" />
              </summary>
              {showDescripcionTecnica && (
                <div style={{ marginTop: 18 }}>
                  <MDEditor.Markdown
                    source={descripcionTecnica.descripcion}
                    className="markdown-content"
                    data-color-mode="light"
                  />
                  {descripcionTecnica.codigoEjemplo && (
                    <pre className="sql-code">{descripcionTecnica.codigoEjemplo}</pre>
                  )}
                </div>
              )}
            </details>
          </section>
        )}

        

        {/* Comentarios */}
        <ModuleComments moduleId={modulo.id} user={null} />
      </main>
      <ModuleList />
      <footer className="App-footer"></footer>
    </div>
  );
}

export default ModulePageGeneric;