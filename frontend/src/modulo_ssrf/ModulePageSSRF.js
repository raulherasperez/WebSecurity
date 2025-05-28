import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './css/ModulePage.css';

import InteractiveTest from '../components/InteractiveTest';
import ssrfQuestions from './questions';
import ModuleList from '../components/ModuleList';
import ModuleComments from '../components/ModuleComments';

function ModulePageSSRF() {
  const { user } = useAuth();

  const [showExample, setShowExample] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="ModulePage">
      <main className="ModuleContent">
        <h1 className="h1">Módulo 5: Server-Side Request Forgery (SSRF)</h1>
        <p>
          <strong>Server-Side Request Forgery (SSRF)</strong> es una vulnerabilidad que permite a un atacante manipular a un servidor para que realice peticiones HTTP o de otro tipo a recursos internos o externos, normalmente controlando la URL o el destino de la petición. 
          Esto puede permitir al atacante acceder a información interna, interactuar con servicios privados, escanear la red interna, o incluso acceder a metadatos sensibles en servicios en la nube.
        </p>
        <p>
          SSRF ocurre cuando una aplicación web obtiene una URL o dirección de destino desde la entrada del usuario y la utiliza para realizar una petición desde el backend, sin validar adecuadamente el destino. 
          Si el atacante puede controlar la URL, puede hacer que el servidor acceda a recursos internos (por ejemplo, <code>http://localhost</code>, <code>http://127.0.0.1</code>, <code>http://169.254.169.254</code> en AWS) o a servicios protegidos por firewalls.
        </p>
        <ul>
          <li><strong>Acceso a recursos internos:</strong> El atacante puede leer datos de servicios internos no expuestos públicamente.</li>
          <li><strong>Escaneo de red interna:</strong> El atacante puede descubrir servicios y puertos abiertos en la red privada.</li>
          <li><strong>Acceso a metadatos en la nube:</strong> En entornos cloud, puede acceder a endpoints como <code>169.254.169.254</code> para obtener credenciales temporales.</li>
          <li><strong>Bypass de controles de acceso:</strong> El atacante puede acceder a recursos restringidos desde el backend.</li>
        </ul>
        <p>
          <strong>¿Quieres saber más?</strong> Consulta estos recursos recomendados:
          <ul>
            <li>
              <a href="https://owasp.org/www-community/attacks/Server_Side_Request_Forgery" target="_blank" rel="noopener noreferrer">
                OWASP: Server-Side Request Forgery (SSRF)
              </a>
            </li>
            <li>
              <a href="https://portswigger.net/web-security/ssrf" target="_blank" rel="noopener noreferrer">
                PortSwigger Web Security Academy: SSRF
              </a>
            </li>
            <li>
              <a href="https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer">
                OWASP SSRF Prevention Cheat Sheet
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
                <strong>Ejemplo 1: Lectura de recursos internos</strong><br />
                Una aplicación permite a los usuarios obtener una vista previa de una imagen proporcionando una URL. El backend descarga la imagen usando la URL proporcionada:
              </p>
              <code className="sql-code">
                {`GET /preview?url=http://example.com/imagen.jpg`}
              </code>
              <p>
                Si el usuario envía <code>http://localhost:8080/admin</code> o <code>http://127.0.0.1:8000/secret</code>, el servidor podría acceder a recursos internos no expuestos públicamente.
              </p>
              <hr />
              <p>
                <strong>Ejemplo 2: Acceso a metadatos en la nube</strong><br />
                En servicios cloud como AWS, existe un endpoint especial para metadatos:
              </p>
              <code className="sql-code">
                {`GET /preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/`}
              </code>
              <p>
                Si el backend accede a esta URL, el atacante podría obtener credenciales temporales de la instancia y comprometer toda la infraestructura.
              </p>
              <hr />
              <p>
                <strong>Ejemplo 3: Escaneo de red interna</strong><br />
                El atacante puede probar diferentes direcciones IP y puertos internos:
              </p>
              <code className="sql-code">
                {`GET /preview?url=http://192.168.1.10:8080/`}
              </code>
              <p>
                Analizando los tiempos de respuesta o los mensajes de error, el atacante puede mapear la red interna y descubrir servicios ocultos.
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
                src="https://www.youtube.com/embed/5qT3QyQ6Q6E"
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
          <InteractiveTest questions={ssrfQuestions} />
        </section>

        {/* Ejercicio */}
        <section>
          <h2>Ejercicio: Explota SSRF para acceder a recursos internos</h2>
          <p>
            <strong>Contexto:</strong> Imagina que eres administrador de una tienda online y tienes acceso a un panel de administración donde puedes gestionar productos, usuarios y ver estadísticas. 
            El panel incluye una funcionalidad para obtener una <b>vista previa de la imagen de un producto</b> a partir de una URL externa. 
            Esta funcionalidad es vulnerable a SSRF, ya que el backend descarga cualquier recurso solicitado sin validar el destino.
          </p>
          <p>
            Tu objetivo es explotar esta funcionalidad para hacer que el servidor acceda a recursos internos o protegidos, demostrando la vulnerabilidad SSRF. 
            Puedes hacerlo directamente desde el formulario de vista previa de imagen en el entorno vulnerable, introduciendo URLs internas o de servicios sensibles.
          </p>
          <ol>
            <li>Accede al entorno vulnerable del panel de administración de la tienda.</li>
            <li>En la sección <b>Vista previa de imagen de producto</b>, introduce una URL de imagen pública y observa la vista previa.</li>
            <li>Ahora, prueba a introducir URLs internas como <code>http://localhost:5001/usuarios</code>, <code>http://127.0.0.1:5001/</code> o endpoints de metadatos en la nube (<code>http://169.254.169.254/</code>).</li>
            <li>Observa si el backend responde con información interna o sensible en vez de una imagen.</li>
          </ol>
          <div style={{ marginTop: 18 }}>
            <button className="hint-btn" onClick={() => setShowHint(h => !h)}>
              {showHint ? 'Ocultar pista' : 'Mostrar pista'}
            </button>
            {showHint && (
              <div className="hint-box">
                Puedes explotar la vulnerabilidad directamente desde el formulario de vista previa de imagen del panel. Prueba a introducir URLs internas o protegidas y observa la respuesta del servidor.
              </div>
            )}
            <button className="hint-btn" onClick={() => setShowSolution(s => !s)}>
              {showSolution ? 'Ocultar solución' : 'Mostrar solución'}
            </button>
            {showSolution && (
              <div className="hint-box solution-box">
                <b>¿Cómo explotar SSRF?</b>
                <ol>
                  <li>En el panel de administración, ve a la sección de vista previa de imagen de producto.</li>
                  <li>Introduce una URL interna como <code>http://localhost:5001/usuarios</code> o <code>http://169.254.169.254/latest/meta-data/</code> en el campo de URL.</li>
                  <li>Si el backend responde mostrando datos internos o sensibles en vez de una imagen, la aplicación es vulnerable a SSRF.</li>
                </ol>
                <b>Resumen:</b> Puedes explotar la vulnerabilidad desde la propia interfaz, sin necesidad de herramientas externas ni manipulación avanzada.
              </div>
            )}
          </div>
        </section>

        {/* Acceso al entorno vulnerable */}
        <section>
          <h2>Acceso al entorno vulnerable</h2>
          <p>
            Pulsa el siguiente botón para abrir la aplicación vulnerable a SSRF en una nueva pestaña y realizar el ejercicio.
          </p>
          <button
            className="sandbox-button"
            style={{ marginTop: 12 }}
            onClick={() => window.open('/modulo/ssrf/entorno', '_blank')}
          >
            Abrir entorno vulnerable SSRF
          </button>
          <div style={{ marginTop: 18 }}>
            <button
              className="sandbox-button"
              style={{ background: '#e53935', color: '#fff' }}
              onClick={async () => {
                await fetch('http://localhost:5001/ssrf-reset', { method: 'POST', credentials: 'include' });
                window.alert('¡Estado del entorno SSRF restaurado!');
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
            <p>
              La vulnerabilidad SSRF existe porque el backend acepta URLs proporcionadas por el usuario y realiza peticiones sin validar el destino. 
              Esto permite que un atacante fuerce al servidor a acceder a recursos internos, servicios privados o endpoints sensibles.
            </p>
            <p>
              Por ejemplo, si el backend tiene un endpoint como:
            </p>
            <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`@app.route('/preview')
def preview():
    url = request.args.get('url')
    # Descarga el recurso sin validar el destino
    response = requests.get(url)
    return response.content
`}
            </pre>
            <p>
              <strong>Solución:</strong> Para evitar SSRF, valida y restringe las URLs permitidas, evita acceder a direcciones internas o privadas, utiliza listas blancas de dominios y, si es posible, deshabilita el acceso a direcciones IP internas desde el backend.
            </p>
            <ul>
              <li>Valida y filtra las URLs proporcionadas por el usuario.</li>
              <li>Implementa listas blancas de dominios permitidos.</li>
              <li>Evita que el backend acceda a direcciones IP privadas o de loopback.</li>
              <li>Revisa y limita las capacidades de red del servidor.</li>
              <li>Audita y revisa cualquier funcionalidad que realice peticiones externas.</li>
            </ul>
          </div>
        </details>

        <ModuleComments moduleId="ssrf" user={user} />

      </main>
      <ModuleList />
      <footer className="App-footer">
        <button className="sandbox-button">Sandbox</button>
      </footer>
    </div>
  );
}

export default ModulePageSSRF;