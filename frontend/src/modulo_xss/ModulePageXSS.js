import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './css/ModulePage.css';

import InteractiveTest from '../components/InteractiveTest';
import xssQuestions from './questions';
import ModuleList from '../components/ModuleList';
import ModuleComments from '../components/ModuleComments';

function ModulePageXSS() {
  const { user } = useAuth();

  // Estados para mostrar pistas/soluciones por ejercicio
  const [showHint1, setShowHint1] = useState(false);
  const [showSolution1, setShowSolution1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [showSolution2, setShowSolution2] = useState(false);

  return (
    <div className="ModulePage">
      <main className="ModuleContent">
        <h1 className="h1">Módulo 2: Cross-Site Scripting (XSS)</h1>
        <p>
          <strong>XSS</strong> es una vulnerabilidad que permite a un atacante inyectar código JavaScript malicioso en páginas web vistas por otros usuarios.
          Esto puede permitir el robo de cookies, redirecciones, manipulación del DOM y mucho más.
        </p>
        <ul>
          <li>Robar información sensible del usuario (como cookies de sesión)</li>
          <li>Modificar el contenido de la página web</li>
          <li>Redirigir al usuario a sitios maliciosos</li>
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
          </ul>
        </p>

        {/* Ejemplo */}
        <section>
          <h2>Ejemplo</h2>
          <p>
            Imagina un formulario de comentarios que muestra el texto introducido por el usuario sin validación ni escape:
          </p>
          <code className="sql-code">
            &lt;div&gt;{`{comentarioUsuario}`}&lt;/div&gt;
          </code>
          <p>
            Si un atacante introduce <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code>, el navegador ejecutará ese código.
          </p>
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
            Prueba a introducir código JavaScript en el campo de búsqueda de la aplicación vulnerable. ¿Puedes hacer que se ejecute un <code>alert()</code>?
          </p>
          <button className="hint-btn" onClick={() => setShowHint1(h => !h)}>
            {showHint1 ? 'Ocultar pista' : 'Mostrar pista'}
          </button>
          {showHint1 && (
            <div className="hint-box">
              Si la aplicación es vulnerable, al buscar <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code> verás una alerta en pantalla. Esto ocurre porque el valor de búsqueda se muestra sin escapar en el HTML.
            </div>
          )}
          <button className="hint-btn" onClick={() => setShowSolution1(s => !s)}>
            {showSolution1 ? 'Ocultar solución' : 'Mostrar solución'}
          </button>
          {showSolution1 && (
            <div className="hint-box solution-box">
              Escribe <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code> o <code>&lt;img src=x onerror=alert('XSS')&gt;</code> en el campo de búsqueda y observa si se ejecuta el código al mostrar los resultados.
              
            </div>
          )}
        </section>

        {/* Ejercicio 2 */}
        <section>
          <h2>Ejercicio 2: XSS almacenado</h2>
          <p>
            ¿Puedes guardar un comentario que ejecute código JavaScript cada vez que alguien lo vea? Prueba a dejar un comentario con un <code>&lt;script&gt;</code> o un <code>&lt;img&gt;</code> con <code>onerror</code>.
          </p>
          <button className="hint-btn" onClick={() => setShowHint2(h => !h)}>
            {showHint2 ? 'Ocultar pista' : 'Mostrar pista'}
          </button>
          {showHint2 && (
            <div className="hint-box">
              Si el comentario se guarda y, al mostrarse en la lista, se ejecuta una alerta, la aplicación es vulnerable a XSS almacenado. Esto ocurre porque los comentarios se muestran usando <code>dangerouslySetInnerHTML</code> sin filtrar el contenido.
            </div>
          )}
          <button className="hint-btn" onClick={() => setShowSolution2(s => !s)}>
            {showSolution2 ? 'Ocultar solución' : 'Mostrar solución'}
          </button>
          {showSolution2 && (
            <div className="hint-box solution-box">
              Escribe un comentario como <code>&lt;img src=x onerror=alert('XSS')&gt;</code> y envíalo. Luego, recarga la página o revisa la lista de comentarios para ver si se ejecuta el código.
              
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
            onClick={() => window.open('/modulo/xss/entorno', '_blank')}
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
                window.location.reload();
              }}
            >
              Limpiar progreso XSS
            </button>
          </div>

          {/* Explicación técnica de la vulnerabilidad en un desplegable */}
          <details style={{ marginTop: 32 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '1.08em' }}>
              ¿Por qué funciona la vulnerabilidad? (ver explicación técnica)
            </summary>
            <div style={{ marginTop: 16 }}>
              <p>
                La vulnerabilidad XSS existe porque la aplicación muestra directamente los datos introducidos por el usuario en el HTML, sin validarlos ni escaparlos.
                Esto permite que un atacante inserte etiquetas <code>&lt;script&gt;</code> o atributos peligrosos como <code>onerror</code> en imágenes, logrando ejecutar JavaScript en el navegador de cualquier usuario.
              </p>
              <p>
                Por ejemplo, en el entorno vulnerable, el código de React utiliza <code>dangerouslySetInnerHTML</code> para mostrar el contenido sin filtrar:
              </p>
              <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`<div dangerouslySetInnerHTML={{ __html: comentarioUsuario }} />`}
              </pre>
              <p>
                Si el usuario introduce <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code> o <code>&lt;img src=x onerror=alert('XSS')&gt;</code>, el navegador ejecutará ese código.
              </p>
              <p>
                <strong>Solución:</strong> Para evitar XSS, nunca muestres datos del usuario sin escapar ni sanitizar. Utiliza funciones de escape o librerías de sanitización, y evita <code>dangerouslySetInnerHTML</code> salvo que sea estrictamente necesario y seguro.
              </p>
            </div>
          </details>
        </section>

        <ModuleComments moduleId="xss" user={user} />

      </main>
      <ModuleList />
      <footer className="App-footer">
        <button className="sandbox-button">Sandbox</button>
      </footer>
    </div>
  );
}

export default ModulePageXSS;