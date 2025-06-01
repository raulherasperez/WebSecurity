import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './css/ModulePage.css';

import InteractiveTest from '../components/InteractiveTest';
import xssQuestions from './questions';
import ModuleList from '../components/ModuleList';
import ModuleComments from '../components/ModuleComments';
import { pistas, soluciones, explicacionNivel } from './xssHints';

import CodeQuiz from '../codequiz/CodeQuiz';
import CODE_QUIZ from '../codequiz/quizData';

function ModulePageXSS() {
  const { user } = useAuth();

  // Estados para mostrar pistas/soluciones por ejercicio y los desplegables
  const [showHint1, setShowHint1] = useState(false);
  const [showSolution1, setShowSolution1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [showSolution2, setShowSolution2] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showCodeQuiz, setShowCodeQuiz] = useState(false);

  // Nivel de dificultad
  const [nivel, setNivel] = useState('facil');

   const xssQuizQuestions = CODE_QUIZ.filter(q => q.type === "xss");

  return (
    <div className="ModulePage">
      <main className="ModuleContent">
        <h1 className="h1">Módulo 2: Cross-Site Scripting (XSS)</h1>
        <p>
          <strong>Cross-Site Scripting (XSS)</strong> es una de las vulnerabilidades más comunes y peligrosas en aplicaciones web. Ocurre cuando una aplicación permite que datos no confiables (proporcionados por el usuario) se inserten en una página web sin la validación o el escape adecuado, permitiendo que un atacante inyecte y ejecute código JavaScript malicioso en el navegador de otros usuarios.
        </p>
        <p>
          Los ataques XSS pueden tener consecuencias graves, como el robo de información sensible, suplantación de identidad, manipulación de la interfaz, redirección a sitios maliciosos, y mucho más. Los atacantes pueden aprovechar XSS para robar cookies de sesión, capturar pulsaciones de teclado, mostrar formularios falsos, modificar el contenido de la página o incluso propagar malware.
        </p>
        <ul>
          <li><strong>Robo de información sensible:</strong> como cookies de sesión, tokens de autenticación o datos personales.</li>
          <li><strong>Modificación del contenido:</strong> el atacante puede alterar la apariencia o el comportamiento de la página para engañar a los usuarios.</li>
          <li><strong>Redirección a sitios maliciosos:</strong> los usuarios pueden ser enviados a páginas de phishing o descarga de malware.</li>
          <li><strong>Propagación de gusanos:</strong> en aplicaciones con funcionalidades sociales, un XSS puede propagarse automáticamente a otros usuarios.</li>
        </ul>
        <p>
          <strong>¿Quieres saber más?</strong> Consulta estos recursos recomendados:
          <ul>
            <li>
              <a href="https://owasp.org/www-community/attacks/xss/" target="_blank" rel="noopener noreferrer">
                OWASP: Cross-site Scripting (XSS)
              </a>
            </li>
            <li>
              <a href="https://portswigger.net/web-security/cross-site-scripting" target="_blank" rel="noopener noreferrer">
                PortSwigger Web Security Academy: XSS
              </a>
            </li>
            <li>
              <a href="https://www.hacksplaining.com/exercises/xss" target="_blank" rel="noopener noreferrer">
                Hacksplaining: Ejercicio interactivo de XSS
              </a>
            </li>
            <li>
              <a href="https://developer.mozilla.org/es/docs/Web/Security/Types_of_attacks#cross-site_scripting_xss" target="_blank" rel="noopener noreferrer">
                MDN Web Docs: Tipos de ataques XSS
              </a>
            </li>
          </ul>
        </p>

        {/* Selector de nivel de dificultad */}
        <section>
          <h2>Selecciona el nivel de dificultad</h2>
          <label style={{ fontWeight: 600, marginRight: 8 }}>Nivel:</label>
          <select value={nivel} onChange={e => setNivel(e.target.value)}>
            <option value="facil">Fácil</option>
            <option value="medio">Medio</option>
            <option value="dificil">Difícil</option>
            <option value="imposible">Imposible</option>
          </select>
          <div style={{ marginTop: 8, color: '#555', fontSize: '0.98em' }}>
            {nivel === 'facil' && 'Sin protección, vulnerable a cualquier XSS.'}
            {nivel === 'medio' && 'Filtrado parcial, aún vulnerable a vectores conocidos.'}
            {nivel === 'dificil' && 'Escape básico, pero quedan vectores avanzados.'}
            {nivel === 'imposible' && 'Todas las protecciones activadas, no vulnerable.'}
          </div>
        </section>

        {/* Ejemplo en desplegable */}
        <section>
          <h2>Ejemplo</h2>
          <button onClick={() => setShowExample(e => !e)}>
            {showExample ? 'Ocultar ejemplo' : 'Mostrar ejemplo'}
          </button>
          {showExample && (
            <div className="example-details" style={{ marginTop: 14 }}>
              <p>
                <strong>Ejemplo 1: XSS reflejado</strong><br />
                Imagina un formulario de búsqueda en una web que muestra el término buscado sin validación:
              </p>
              <code className="sql-code">
                &lt;div&gt;Resultados para: {`{busquedaUsuario}`}&lt;/div&gt;
              </code>
              <p>
                Si el usuario introduce <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code>, el navegador ejecutará ese código, mostrando una alerta. Esto ocurre porque el valor de búsqueda se inserta directamente en el HTML sin escape.
              </p>
              <hr />
              <p>
                <strong>Ejemplo 2: XSS almacenado</strong><br />
                Supón que tienes un sistema de comentarios donde los mensajes se guardan y se muestran a todos los usuarios:
              </p>
              <code className="sql-code">
                &lt;div class="comentario"&gt;{`{comentarioUsuario}`}&lt;/div&gt;
              </code>
              <p>
                Si un atacante publica <code>&lt;img src="x" onerror="alert('XSS almacenado')"&gt;</code>, cada vez que alguien vea ese comentario, se ejecutará el código JavaScript.
              </p>
              <hr />
              <p>
                <strong>Ejemplo 3: XSS basado en DOM</strong><br />
                Un script en el frontend manipula el DOM usando datos de la URL:
              </p>
              <code className="sql-code">
                {`const valor = location.hash.substring(1);\ndocument.getElementById('saludo').innerHTML = valor;`}
              </code>
              <p>
                Si la URL es <code>https://ejemplo.com/#&lt;img src=x onerror=alert(1)&gt;</code>, el código se ejecutará al cargar la página.
              </p>
            </div>
          )}
        </section>

        {/* Vídeo en desplegable */}
        <section>
          <h2>Vídeo</h2>
          <button onClick={() => setShowVideo(v => !v)}>
            {showVideo ? 'Ocultar vídeo' : 'Mostrar vídeo'}
          </button>
          {showVideo && (
            <div className="video-container" style={{ marginTop: 14 }}>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/lG2XpAgy0Ns?si=gDA0RO3yltZgvEb7"
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
          <InteractiveTest questions={xssQuestions} />
        </section>

        {/* Ejercicio 1 */}
        <section>
          <h2>Ejercicio 1: XSS reflejado</h2>
          <p>
            Prueba a introducir código JavaScript en el campo de búsqueda de la aplicación vulnerable. ¿Puedes hacer que se ejecute un <code>alert()</code>? Piensa cómo podrías aprovechar que el valor de búsqueda se muestra directamente en la página.
          </p>
          <button className="hint-btn" onClick={() => setShowHint1(h => !h)}>
            {showHint1 ? 'Ocultar pista' : 'Mostrar pista'}
          </button>
          {showHint1 && (
            <div className="hint-box">
              {pistas[1][nivel]}
            </div>
          )}
          <button className="hint-btn" onClick={() => setShowSolution1(s => !s)}>
            {showSolution1 ? 'Ocultar solución' : 'Mostrar solución'}
          </button>
          {showSolution1 && (
            <div className="hint-box solution-box">
              {soluciones[1][nivel]}
            </div>
          )}
        </section>

        {/* Ejercicio 2 */}
        <section>
          <h2>Ejercicio 2: XSS almacenado</h2>
          <p>
            ¿Puedes guardar un comentario que ejecute código JavaScript cada vez que alguien lo vea? Prueba a dejar un comentario con un <code>&lt;script&gt;</code> o un <code>&lt;img&gt;</code> con <code>onerror</code>. Piensa cómo un atacante podría aprovechar esto para afectar a todos los usuarios que visiten la página.
          </p>
          <button className="hint-btn" onClick={() => setShowHint2(h => !h)}>
            {showHint2 ? 'Ocultar pista' : 'Mostrar pista'}
          </button>
          {showHint2 && (
            <div className="hint-box">
              {pistas[2][nivel]}
            </div>
          )}
          <button className="hint-btn" onClick={() => setShowSolution2(s => !s)}>
            {showSolution2 ? 'Ocultar solución' : 'Mostrar solución'}
          </button>
          {showSolution2 && (
            <div className="hint-box solution-box">
              {soluciones[2][nivel]}
            </div>
          )}
        </section>

        {/* Botón para abrir el entorno vulnerable */}
        <section>
          <h2>Acceso al entorno vulnerable</h2>
          <p>
            Pulsa el siguiente botón para abrir la aplicación vulnerable a XSS en una nueva pestaña y realizar los ejercicios.
          </p>
          <button
            className="sandbox-button"
            style={{ marginTop: 12 }}
            onClick={() => {
              localStorage.setItem('nivelXSS', nivel); // Guardar nivel seleccionado
              window.open('/modulo/xss/entorno', '_blank');
            }}
          >
            Abrir entorno vulnerable XSS
          </button>
          <div style={{ marginTop: 18 }}>
            <p style={{ marginBottom: 6, color: '#555', fontSize: '0.98rem' }}>
              ¿Quieres reiniciar tu progreso en el entorno XSS? Puedes limpiar tu sesión y los retos completados con este botón.
            </p>
            <button
              className="sandbox-button"
              style={{ background: '#e53935', color: '#fff' }}
              onClick={() => {
                localStorage.removeItem('xssLogin');
                localStorage.removeItem('xssRetosCompletados');
                localStorage.removeItem('nivelXSS');
                localStorage.removeItem('xssEj1Completado');
                localStorage.removeItem('xssEj2Completado');
                window.location.reload();
              }}
            >
              Limpiar progreso XSS
            </button>
          </div>

          <details style={{ marginTop: 32 }}>
            <summary
              style={{ cursor: 'pointer', fontWeight: 600, fontSize: '1.08em', marginBottom: 8 }}
              onClick={() => setShowCodeQuiz(s => !s)}
            >
              ¿Reconoces el código vulnerable? (quiz interactivo)
            </summary>
            {showCodeQuiz && (
              <div style={{ marginTop: 18 }}>
                <CodeQuiz questions={xssQuizQuestions} />
              </div>
            )}
          </details>

          {/* Explicación técnica de la vulnerabilidad en un desplegable */}
          <details style={{ marginTop: 32 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '1.08em' }}>
              ¿Por qué funciona la vulnerabilidad? (ver explicación técnica)
            </summary>
            <div style={{ marginTop: 16 }}>
              {explicacionNivel[nivel]}
            </div>
          </details>
        </section>

        <ModuleComments moduleId="xss" user={user} />

      </main>
      <ModuleList />
      <footer className="App-footer">
      </footer>
    </div>
  );
}

export default ModulePageXSS;