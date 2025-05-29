import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './css/ModulePage.css';

import InteractiveTest from '../components/InteractiveTest';
import brokenAuthQuestions from './questions';
import ModuleList from '../components/ModuleList';
import ModuleComments from '../components/ModuleComments';
import { pistas, soluciones, explicacionNivel } from './brokenAuthHints';

function ModulePageBrokenAuth() {
  const { user } = useAuth();

  const [nivel, setNivel] = useState(localStorage.getItem('nivelBrokenAuth') || 'facil');
  const [showExample, setShowExample] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Guarda el nivel en localStorage al cambiarlo
  const handleNivelChange = e => {
    setNivel(e.target.value);
    localStorage.setItem('nivelBrokenAuth', e.target.value);
  };

  return (
    <div className="ModulePage">
      <main className="ModuleContent">
        <h1 className="h1">Módulo 6: Broken Authentication</h1>
        <p>
        <strong>Broken Authentication</strong> es una de las vulnerabilidades más críticas en aplicaciones web. Ocurre cuando los mecanismos de autenticación y gestión de sesiones no están correctamente implementados, permitiendo a los atacantes comprometer cuentas de usuarios, acceder a información sensible o realizar acciones como si fueran otros usuarios.
        </p>
        <p>
        Las causas más comunes incluyen:
        <ul>
            <li>Mensajes de error distintos para usuarios y contraseñas incorrectas, facilitando la enumeración de usuarios.</li>
            <li>Permitir intentos ilimitados de login, lo que facilita ataques de fuerza bruta y credential stuffing.</li>
            <li>Permitir contraseñas débiles o predecibles.</li>
            <li>No invalidar sesiones tras cerrar sesión o cambiar la contraseña.</li>
            <li>Gestión insegura de cookies de sesión (sin HttpOnly, Secure, SameSite, etc).</li>
            <li>Recuperación de contraseña insegura, permitiendo el secuestro de cuentas.</li>
            <li>No regenerar el identificador de sesión tras el login (session fixation).</li>
        </ul>
        </p>
        <p>
        <strong>Impacto:</strong> Un atacante puede acceder a cuentas ajenas, escalar privilegios, robar información sensible o realizar acciones en nombre de otros usuarios.
        </p>
        <p>
          <strong>¿Quieres saber más?</strong> Consulta estos recursos recomendados:
          <ul>
            <li>
              <a href="https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/" target="_blank" rel="noopener noreferrer">
                OWASP Top 10: Broken Authentication
              </a>
            </li>
            <li>
              <a href="https://portswigger.net/web-security/authentication" target="_blank" rel="noopener noreferrer">
                PortSwigger Web Security Academy: Authentication
              </a>
            </li>
          </ul>
        </p>

        {/* Selector de nivel de dificultad */}
        <section>
          <h2>Selecciona el nivel de dificultad</h2>
          <label style={{ fontWeight: 600, marginRight: 8 }}>Nivel:</label>
          <select value={nivel} onChange={handleNivelChange}>
            <option value="facil">Fácil</option>
            <option value="medio">Medio</option>
            <option value="dificil">Difícil</option>
            <option value="imposible">Imposible</option>
          </select>
          <div style={{ marginTop: 8, color: '#555', fontSize: '0.98em' }}>
            {nivel === 'facil' && 'Mensajes de error distintos, sin límite de intentos, contraseñas débiles.'}
            {nivel === 'medio' && 'Mensajes genéricos, pero sin límite de intentos ni protección de fuerza bruta.'}
            {nivel === 'dificil' && 'Mensajes genéricos y límite de intentos, pero sin captcha.'}
            {nivel === 'imposible' && 'Todo correctamente protegido: mensajes genéricos, límite de intentos, captcha y contraseñas fuertes.'}
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
                <strong>Ejemplo 1: Enumeración de usuarios</strong><br />
                Un formulario de login muestra mensajes distintos si el usuario existe o no:
              </p>
              <code className="sql-code">
                {`Usuario no encontrado`}<br />
                {`Contraseña incorrecta`}
              </code>
              <p>
                Esto permite a un atacante descubrir usuarios válidos.
              </p>
              <hr />
              <p>
                <strong>Ejemplo 2: Fuerza bruta sin límite</strong><br />
                El sistema permite infinitos intentos de login sin bloquear ni retrasar.
              </p>
              <code className="sql-code">
                {`POST /login (sin límite de intentos)`}
              </code>
              <p>
                Un atacante puede probar miles de contraseñas rápidamente.
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
                src="https://www.youtube.com/embed/8ZtInClXe1Q"
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
          <InteractiveTest questions={brokenAuthQuestions} />
        </section>

        {/* Ejercicio */}
        <section>
          <h2>Ejercicio: Explota Broken Authentication</h2>
          <p>
            <strong>Contexto:</strong> Imagina que eres un atacante y tienes acceso al formulario de login de una aplicación. 
            Tu objetivo es explotar fallos de autenticación para acceder a cuentas de otros usuarios, descubrir usuarios válidos o realizar fuerza bruta.
          </p>
          <ol>
            <li>Accede al entorno vulnerable del login.</li>
            <li>Prueba a introducir usuarios y contraseñas incorrectos y observa los mensajes de error.</li>
            <li>Intenta descubrir usuarios válidos o acceder a cuentas usando fuerza bruta.</li>
            <li>Según el nivel de dificultad, el sistema puede mostrar mensajes distintos, permitir intentos ilimitados o tener protección.</li>
          </ol>
          <div style={{ marginTop: 18 }}>
            <button className="hint-btn" onClick={() => setShowHint(h => !h)}>
              {showHint ? 'Ocultar pista' : 'Mostrar pista'}
            </button>
            {showHint && (
              <div className="hint-box">
                {pistas[nivel]}
              </div>
            )}
            <button className="hint-btn" onClick={() => setShowSolution(s => !s)}>
              {showSolution ? 'Ocultar solución' : 'Mostrar solución'}
            </button>
            {showSolution && (
              <div className="hint-box solution-box">
                {soluciones[nivel]}
              </div>
            )}
          </div>
        </section>

        {/* Acceso al entorno vulnerable */}
        <section>
          <h2>Acceso al entorno vulnerable</h2>
          <p>
            Pulsa el siguiente botón para abrir la aplicación vulnerable a Broken Authentication en una nueva pestaña y realizar el ejercicio.
          </p>
          <button
            className="sandbox-button"
            style={{ marginTop: 12 }}
            onClick={() => {
              localStorage.setItem('nivelBrokenAuth', nivel);
              window.open('/modulo/brokenauth/entorno', '_blank');
            }}
          >
            Abrir entorno vulnerable Broken Authentication
          </button>
          <div style={{ marginTop: 18 }}>
            <button
              className="sandbox-button"
              style={{ background: '#e53935', color: '#fff' }}
              onClick={async () => {
                localStorage.removeItem('nivelBrokenAuth');
                await fetch('http://localhost:5001/brokenauth-reset', { method: 'POST', credentials: 'include' });
                await fetch('http://localhost:5001/reset-nivel-brokenauth', { method: 'POST', credentials: 'include' });
                window.alert('¡Estado del entorno Broken Authentication restaurado!');
              }}
              type="button"
            >
              Reiniciar estado del ejercicio
            </button>
          </div>
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

        <ModuleComments moduleId="brokenauth" user={user} />

      </main>
      <ModuleList />
      <footer className="App-footer">
        <button className="sandbox-button">Sandbox</button>
      </footer>
    </div>
  );
}

export default ModulePageBrokenAuth;