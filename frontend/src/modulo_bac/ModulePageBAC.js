import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './css/ModulePage.css';

import InteractiveTest from '../components/InteractiveTest';
import bacQuestions from './questions';
import ModuleList from '../components/ModuleList';
import ModuleComments from '../components/ModuleComments';
import { pistas, soluciones, explicacionNivel } from './bacHints';

function ModulePageBAC() {
  const { user } = useAuth();

  const [nivel, setNivel] = useState('facil');
  const [showExample, setShowExample] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="ModulePage">
      <main className="ModuleContent">
        <h1 className="h1">Módulo 4: Broken Access Control (BAC)</h1>
        <p>
          <strong>Broken Access Control</strong> es una de las vulnerabilidades más frecuentes y peligrosas en aplicaciones web modernas. Ocurre cuando una aplicación no restringe correctamente el acceso a recursos o acciones, permitiendo a usuarios no autorizados realizar operaciones restringidas. 
          Esto puede deberse a la ausencia de comprobaciones de permisos, validaciones insuficientes en el backend o confiar únicamente en el frontend para controlar el acceso.
        </p>
        <p>
          Las consecuencias de Broken Access Control pueden ser muy graves: exposición de datos sensibles, modificación o borrado de información de otros usuarios, escalada de privilegios, acceso a funcionalidades administrativas, entre otros. 
          Es una de las principales causas de brechas de seguridad y está en el puesto #1 del <a href="https://owasp.org/Top10/A01_2021-Broken_Access_Control/" target="_blank" rel="noopener noreferrer">OWASP Top 10</a>.
        </p>
        <ul>
          <li><strong>Acceso a datos de otros usuarios:</strong> Ver o modificar información personal ajena.</li>
          <li><strong>Escalada de privilegios:</strong> Obtener permisos de administrador o acceder a funciones restringidas.</li>
          <li><strong>Modificación o borrado de recursos ajenos:</strong> Cambiar o eliminar datos de otros usuarios.</li>
          <li><strong>Acceso a paneles de administración:</strong> Entrar en áreas reservadas sin autorización.</li>
        </ul>
        <p>
          <strong>¿Quieres saber más?</strong> Consulta estos recursos recomendados:
          <ul>
            <li>
              <a href="https://owasp.org/Top10/A01_2021-Broken_Access_Control/" target="_blank" rel="noopener noreferrer">
                OWASP Top 10: Broken Access Control
              </a>
            </li>
            <li>
              <a href="https://portswigger.net/web-security/access-control" target="_blank" rel="noopener noreferrer">
                PortSwigger Web Security Academy: Access Control
              </a>
            </li>
            <li>
              <a href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer">
                OWASP Access Control Cheat Sheet
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
            {nivel === 'facil' && 'Sin control de acceso en backend, puedes ver y modificar cualquier perfil.'}
            {nivel === 'medio' && 'Solo el frontend protege, pero el backend sigue vulnerable.'}
            {nivel === 'dificil' && 'Solo puedes modificar tu perfil, pero puedes ver los de otros.'}
            {nivel === 'imposible' && 'Solo puedes ver y modificar tu propio perfil, el backend comprueba todo.'}
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
                <strong>Ejemplo 1: Acceso a perfil ajeno</strong><br />
                Imagina una aplicación donde los usuarios pueden ver y editar su perfil accediendo a <code>/perfil/usuario1</code>. Si un usuario puede acceder a <code>/perfil/usuario2</code> simplemente cambiando la URL, existe un problema de Broken Access Control.
              </p>
              <code className="sql-code">
                {`GET /perfil/usuario2`}
              </code>
              <p>
                Si la aplicación no verifica que el usuario autenticado es realmente el dueño del perfil solicitado, cualquier usuario podría ver o modificar datos ajenos.
              </p>
              <hr />
              <p>
                <strong>Ejemplo 2: Escalada de privilegios</strong><br />
                Un usuario normal descubre que puede acceder a <code>/admin</code> o enviar peticiones para cambiar su rol a administrador, simplemente manipulando parámetros en la URL o en el cuerpo de la petición.
              </p>
              <code className="sql-code">
                {`POST /cambiar-rol\n{\n  "usuario": "juan",\n  "rol": "admin"\n}`}
              </code>
              <p>
                Si el backend no valida que el usuario tiene permiso para cambiar su propio rol, podría convertirse en administrador.
              </p>
              <hr />
              <p>
                <strong>Ejemplo 3: Modificación de recursos ajenos</strong><br />
                Un usuario puede borrar o modificar recursos de otros simplemente cambiando el identificador en la petición:
              </p>
              <code className="sql-code">
                {`DELETE /documentos/123`}
              </code>
              <p>
                Si no se comprueba que el usuario es el dueño del documento, podría eliminar documentos de otros usuarios.
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
                src="https://www.youtube.com/embed/vUFVxoV5y_I?si=X1SoPdHOMmqn7dIk"
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
          <InteractiveTest questions={bacQuestions} />
        </section>

        {/* Ejercicio */}
        <section>
          <h2>Ejercicio: Explota Broken Access Control</h2>
          <p>
            <strong>Contexto:</strong> Imagina que participas en una aplicación donde puedes ver y editar tus propios datos. Sin embargo, la aplicación no comprueba correctamente los permisos y podrías acceder o modificar datos de otros usuarios cambiando parámetros en la URL o en las peticiones.
          </p>
          <p>Inicia sesión como John en el usuario y john en la contraseña, accederás a una página de edición de perfil.</p>
          <p>¿Podrás ser capaz de ver y editar otros perfiles del entorno?</p>
          <button
            className="sandbox-button"
            style={{ marginTop: 12 }}
            onClick={() => window.open('/modulo/bac/entorno', '_blank')}
          >
            Abrir entorno vulnerable BAC
          </button>
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
            Pulsa el siguiente botón para abrir la aplicación vulnerable a Broken Access Control en una nueva pestaña y realizar el ejercicio.
          </p>
          <button
            className="sandbox-button"
            style={{ marginTop: 12 }}
            onClick={() => {
              localStorage.setItem('nivelBAC', nivel);
              window.open('/modulo/bac/entorno', '_blank')}}
          >
            Abrir entorno vulnerable BAC
          </button>
          <div style={{ marginTop: 18 }}>
            <button
              className="sandbox-button"
              style={{ background: '#e53935', color: '#fff' }}
              onClick={async () => {
                localStorage.removeItem('nivelBAC');
                await fetch('http://localhost:5001/bac-reset-usuarios', { method: 'POST', credentials: 'include' });
                await fetch('http://localhost:5001/logout', { method: 'POST', credentials: 'include' });
                await fetch('http://localhost:5001/reset-nivel-bac', { method: 'POST', credentials: 'include' });
                window.alert('¡Usuarios y sesión restaurados! Tendrás que iniciar sesión de nuevo.');
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

        <ModuleComments moduleId="bac" user={user} />

      </main>
      <ModuleList />
      <footer className="App-footer">
        <button className="sandbox-button">Sandbox</button>
      </footer>
    </div>
  );
}

export default ModulePageBAC;