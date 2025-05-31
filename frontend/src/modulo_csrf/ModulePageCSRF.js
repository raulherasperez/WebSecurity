import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './css/ModulePage.css';

import InteractiveTest from '../components/InteractiveTest';
import csrfQuestions from './questions';
import ModuleList from '../components/ModuleList';
import ModuleComments from '../components/ModuleComments';
import { pistas, soluciones, explicacionNivel } from './csrfHints';

import CodeQuiz from '../codequiz/CodeQuiz';
import CODE_QUIZ from '../codequiz/quizData';

function ModulePageCSRF() {
  const { user } = useAuth();

  const [showHint2, setShowHint2] = useState(false);
  const [showSolution2, setShowSolution2] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showCodeQuiz, setShowCodeQuiz] = useState(false);

  // Nivel de dificultad
  const [nivel, setNivel] = useState('facil');

  // Mensaje de éxito al reiniciar comentarios
  const [resetMsg, setResetMsg] = useState('');

  const csrfQuizQuestions = CODE_QUIZ.filter(q => q.type === "csrf");

  return (
    <div className="ModulePage">
      <main className="ModuleContent">
        <h1 className="h1">Módulo 3: Cross-Site Request Forgery (CSRF)</h1>
        <p>
          <strong>Cross-Site Request Forgery (CSRF)</strong> es una vulnerabilidad que permite a un atacante realizar acciones en nombre de un usuario autenticado en una aplicación web, sin su consentimiento. 
          El atacante engaña al navegador de la víctima para que envíe peticiones no deseadas (como transferencias de dinero, cambios de contraseña o borrado de datos) usando la sesión activa del usuario.
        </p>
        <p>
          CSRF explota el hecho de que los navegadores envían automáticamente las cookies de sesión con cada petición al dominio correspondiente, sin importar desde dónde se originó la petición. 
          Si la aplicación no implementa mecanismos de protección, un atacante puede crear una página maliciosa que fuerce al navegador de la víctima a ejecutar acciones en la aplicación legítima.
        </p>
        <ul>
          <li><strong>Modificar la contraseña de un usuario:</strong> El atacante puede cambiar la contraseña de la víctima si la aplicación no protege el endpoint correspondiente.</li>
          <li><strong>Realizar transferencias de dinero:</strong> En aplicaciones bancarias, un CSRF puede transferir fondos sin el consentimiento del usuario.</li>
          <li><strong>Cambiar la dirección de correo electrónico:</strong> El atacante puede secuestrar cuentas cambiando el email asociado.</li>
          <li><strong>Borrar información:</strong> Puede eliminar datos personales, comentarios o archivos.</li>
        </ul>
        <p>
          <strong>¿Quieres saber más?</strong> Consulta estos recursos recomendados:
          <ul>
            <li>
              <a href="https://owasp.org/www-community/attacks/csrf" target="_blank" rel="noopener noreferrer">
                OWASP: Cross-Site Request Forgery (CSRF)
              </a>
            </li>
            <li>
              <a href="https://portswigger.net/web-security/csrf" target="_blank" rel="noopener noreferrer">
                PortSwigger Web Security Academy: CSRF
              </a>
            </li>
            <li>
              <a href="https://www.hacksplaining.com/exercises/csrf" target="_blank" rel="noopener noreferrer">
                Hacksplaining: Ejercicio interactivo de CSRF
              </a>
            </li>
            <li>
              <a href="https://developer.mozilla.org/es/docs/Web/Security/Types_of_attacks#cross-site_request_forgery_csrf" target="_blank" rel="noopener noreferrer">
                MDN Web Docs: CSRF
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
            {nivel === 'facil' && 'Sin protección, vulnerable a cualquier CSRF.'}
            {nivel === 'medio' && 'Verificación básica de Referer/Origin, pero sin token.'}
            {nivel === 'dificil' && 'Requiere token CSRF débil, pero puede ser predecible.'}
            {nivel === 'imposible' && 'Token CSRF robusto y verificación estricta, no vulnerable.'}
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
                <strong>Ejemplo 1: Transferencia bancaria</strong><br />
                Imagina que estás autenticado en tu banco online y visitas una página maliciosa. Esa página puede enviar una petición para transferir dinero usando tus credenciales, sin que te des cuenta.
              </p>
              <code className="sql-code">
                {`<form action="https://banco.com/transferir" method="POST">
  <input type="hidden" name="cantidad" value="1000">
  <input type="hidden" name="destino" value="cuenta_atacante">
  <input type="submit" value="Enviar">
</form>
<script>document.forms[0].submit()</script>`}
              </code>
              <p>
                Si la aplicación no protege contra CSRF, esta petición se procesará como si la hubiera realizado el usuario legítimo.
              </p>
              <hr />
              <p>
                <strong>Ejemplo 2: Cambio de email</strong><br />
                Un atacante puede crear una página que cambie el email de la víctima en una aplicación vulnerable:
              </p>
              <code className="sql-code">
                {`<form action="https://ejemplo.com/cambiar-email" method="POST">
  <input type="hidden" name="email" value="atacante@evil.com">
  <input type="submit" value="Cambiar email">
</form>
<script>document.forms[0].submit()</script>`}
              </code>
              <p>
                Si la víctima está autenticada, su email será cambiado sin que lo sepa.
              </p>
              <hr />
              <p>
                <strong>Ejemplo 3: Borrado de comentarios</strong><br />
                Un atacante puede forzar el borrado de un comentario en un foro vulnerable:
              </p>
              <code className="sql-code">
                {`<form action="http://localhost:5001/foro-borrar-comentario" method="POST">
  <input type="hidden" name="id" value="1">
  <input type="submit" value="Borrar">
</form>
<script>document.forms[0].submit()</script>`}
              </code>
              <p>
                Si la víctima está autenticada en el foro, el comentario con ID 1 será borrado.
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
                src="https://www.youtube.com/embed/vRBihr41JTo"
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
          <InteractiveTest questions={csrfQuestions} />
        </section>

        {/* Ejercicio: Foro */}
        <section>
          <h2>Ejercicio: Explota CSRF para borrar comentarios en el foro</h2>
          <p>
            <strong>Contexto:</strong> Imagina que participas en un foro online. Puedes borrar tus propios comentarios desde la interfaz, pero la funcionalidad <b>no está protegida contra CSRF</b>.
            Un atacante podría engañarte para que, al visitar una web maliciosa mientras tienes la sesión iniciada, se envíe una petición para borrar uno de tus comentarios sin tu consentimiento.
          </p>
          <p>
            Accede al entorno vulnerable del foro y trata de explotar la vulnerabilidad para borrar un comentario tuyo mediante un ataque CSRF.
          </p>
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
            <button className="hint-btn" onClick={() => setShowHint2(h => !h)}>
              {showHint2 ? 'Ocultar pista' : 'Mostrar pista'}
            </button>
            {showHint2 && (
              <div className="hint-box">
                {pistas[1][nivel]}
              </div>
            )}
            <button className="hint-btn" onClick={() => setShowSolution2(s => !s)}>
              {showSolution2 ? 'Ocultar solución' : 'Mostrar solución'}
            </button>
            {showSolution2 && (
              <div className="hint-box solution-box">
                {soluciones[1][nivel]}
              </div>
            )}
          </div>
        </section>

        {/* Acceso al entorno vulnerable */}
        <section>
          <h2>Acceso al entorno vulnerable</h2>
          <p>
            Pulsa el siguiente botón para abrir el foro vulnerable a CSRF en una nueva pestaña y realizar el ejercicio.
          </p>
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
            <p style={{ marginBottom: 6, color: '#555', fontSize: '0.98rem' }}>
              ¿Quieres reiniciar los comentarios del foro? Puedes restaurar los comentarios originales con este botón.
            </p>
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
              ¿Reconoces el código vulnerable? (quiz interactivo)
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
            {explicacionNivel[nivel]}
          </div>
        </details>

        <ModuleComments moduleId="csrf" user={user} />

      </main>
      <ModuleList />
      <footer className="App-footer">

      </footer>
    </div>
  );
}

export default ModulePageCSRF;