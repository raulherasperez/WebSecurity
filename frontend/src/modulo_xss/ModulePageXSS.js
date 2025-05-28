import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './css/ModulePage.css';

import InteractiveTest from '../components/InteractiveTest';
import xssQuestions from './questions';
import ModuleList from '../components/ModuleList';
import ModuleComments from '../components/ModuleComments';

function ModulePageXSS() {
  const { user } = useAuth();

  // Estados para mostrar pistas/soluciones por ejercicio y los desplegables
  const [showHint1, setShowHint1] = useState(false);
  const [showSolution1, setShowSolution1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [showSolution2, setShowSolution2] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

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
              Si la aplicación es vulnerable, al buscar <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code> verás una alerta en pantalla. Esto ocurre porque el valor de búsqueda se muestra sin escapar en el HTML. También puedes probar con etiquetas <code>&lt;img&gt;</code> y atributos <code>onerror</code>.
            </div>
          )}
          <button className="hint-btn" onClick={() => setShowSolution1(s => !s)}>
            {showSolution1 ? 'Ocultar solución' : 'Mostrar solución'}
          </button>
          {showSolution1 && (
            <div className="hint-box solution-box">
              Escribe <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code> o <code>&lt;img src=x onerror=alert('XSS')&gt;</code> en el campo de búsqueda y observa si se ejecuta el código al mostrar los resultados. Si ves la alerta, la aplicación es vulnerable a XSS reflejado.
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
              Si el comentario se guarda y, al mostrarse en la lista, se ejecuta una alerta, la aplicación es vulnerable a XSS almacenado. Esto ocurre porque los comentarios se muestran usando <code>dangerouslySetInnerHTML</code> sin filtrar el contenido. Puedes probar también con otras etiquetas HTML y eventos.
            </div>
          )}
          <button className="hint-btn" onClick={() => setShowSolution2(s => !s)}>
            {showSolution2 ? 'Ocultar solución' : 'Mostrar solución'}
          </button>
          {showSolution2 && (
            <div className="hint-box solution-box">
              Escribe un comentario como <code>&lt;img src=x onerror=alert('XSS')&gt;</code> o <code>&lt;script&gt;alert('XSS almacenado')&lt;/script&gt;</code> y envíalo. Luego, recarga la página o revisa la lista de comentarios para ver si se ejecuta el código. Si ves la alerta, la aplicación es vulnerable a XSS almacenado.
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
                La vulnerabilidad XSS existe porque la aplicación muestra directamente los datos introducidos por el usuario en el HTML, sin validarlos ni escaparlos. Esto permite que un atacante inserte etiquetas <code>&lt;script&gt;</code> o atributos peligrosos como <code>onerror</code> en imágenes, logrando ejecutar JavaScript en el navegador de cualquier usuario.
              </p>
              <p>
                <strong>¿Cómo ocurre?</strong> Cuando los datos del usuario se insertan en el DOM sin escape, el navegador interpreta cualquier etiqueta HTML o JavaScript que se incluya. Esto puede suceder tanto en el backend (al renderizar plantillas) como en el frontend (al usar <code>dangerouslySetInnerHTML</code> en React, o <code>innerHTML</code> en JavaScript puro).
              </p>
              <p>
                Por ejemplo, en el entorno vulnerable, el código de React utiliza <code>dangerouslySetInnerHTML</code> para mostrar el contenido sin filtrar:
              </p>
              <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`<div dangerouslySetInnerHTML={{ __html: comentarioUsuario }} />`}
              </pre>
              <p>
                Si el usuario introduce <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code> o <code>&lt;img src=x onerror=alert('XSS')&gt;</code>, el navegador ejecutará ese código. Esto puede ser aprovechado para robar información, modificar la página, o realizar ataques más avanzados.
              </p>
              <p>
                <strong>Solución:</strong> Para evitar XSS, nunca muestres datos del usuario sin escapar ni sanitizar. Utiliza funciones de escape o librerías de sanitización (como DOMPurify), valida y filtra todas las entradas, y evita <code>dangerouslySetInnerHTML</code> salvo que sea estrictamente necesario y seguro. Además, implementa políticas de seguridad como Content Security Policy (CSP) para mitigar el impacto de posibles XSS.
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