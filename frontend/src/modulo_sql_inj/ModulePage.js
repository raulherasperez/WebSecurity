import React, { useState } from 'react';
import './css/ModulePage.css';
import InteractiveTest from '../components/InteractiveTest';
import sqlQuestions from './questions'; // Importamos las preguntas
import LogoHomeLink from '../components/LogoHomeLink';
function ModulePage() {
  const [showDetails, setShowDetails] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="ModulePage">

    <LogoHomeLink />
      {/* Título */}
      

      {/* Contenido principal */}
      <main className="ModuleContent">
        <h1 className="h1">Modulo 1</h1>
        {/* Texto inicial */}
        <p>
          En este módulo aprenderás sobre uno de los tipos de ataques más comunes en aplicaciones web: la inyección SQL.
          Este tipo de ataque permite a un atacante ejecutar código SQL arbitrario dentro de tu base de datos,
          lo que puede provocar daños graves como robo de datos o incluso eliminar información crítica.
        </p>

        {/* Sección Ejemplo */}
        <section>
          <h2>Ejemplo</h2>
          <button onClick={() => setShowDetails(!showDetails)}>
            Mostrar detalles
          </button>
          {showDetails && (
            <div className="example-details">
              <p>
                Imagina que una aplicación tiene esta consulta para verificar si un usuario existe:
                <code className="sql-code">
                  SELECT * FROM usuarios WHERE nombre = 'Pepe' AND contraseña = '1234'
                </code>
                Un atacante podría introducir esto en el campo de nombre de usuario:
                <code className="sql-code">
                  Pepe' OR 1=1 --
                </code>
                Entonces, la consulta quedaría así:
                <code className="sql-code">
                  SELECT * FROM usuarios WHERE nombre = 'Pepe' OR 1=1 --' AND contraseña = ''
                </code>
                Este código haría que se devuelvan todos los usuarios, ignorando la contraseña,
                ¡y el atacante podría acceder sin conocer la contraseña!
              </p>
            </div>
          )}
        </section>

        {/* Sección Vídeo */}
        <section>
          <h2>Vídeo</h2>
          <button onClick={() => setShowVideo(!showVideo)}>
            Mostrar vídeo
          </button>
          {showVideo && (
            <div className="video-container">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/qLeeLRn9Z78?si=yXBmGdkXtWBO-pMR"
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
          <h2>Test teórico</h2>
          <p>
            ¿Estás listo para poner a prueba tus conocimientos? Haz clic en el siguiente botón para acceder al test teórico:
          </p>
          <InteractiveTest questions={sqlQuestions} />
        </section>
      </main>

      {/* Panel lateral de Módulos */}
      <aside className="module-sidebar">
        <h2>Módulos</h2>
        <ul>
          <li>Inyección SQL</li>
          <li>XSS</li>
          <li>CSRF</li>
          <li>Insecure Deserialization</li>
          <li>Security Misconfiguration</li>
          <li>Sensitive Data Exposure</li>
          <li>Broken Access Control</li>
          <li>Vulnerable Components</li>
          <li>Logging & Monitoring</li>
          <li>API Security</li>
        </ul>
      </aside>

      {/* Botón Sandbox */}
      <footer className="App-footer">
        <button className="sandbox-button">Sandbox</button>
      </footer>
    </div>
  );
}

export default ModulePage;