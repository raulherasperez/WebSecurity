import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './css/ModulePage.css';

import InteractiveTest from '../components/InteractiveTest';
import bacQuestions from './questions';
import ModuleList from '../components/ModuleList';
import ModuleComments from '../components/ModuleComments';

function ModulePageBAC() {
  const { user } = useAuth();

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
                Prueba a cambiar el parámetro <code>id</code> en la URL o en las peticiones para acceder a datos de otros usuarios. Observa si puedes ver o modificar información ajena sin ser el propietario.
              </div>
            )}
            <button className="hint-btn" onClick={() => setShowSolution(s => !s)}>
              {showSolution ? 'Ocultar solución' : 'Mostrar solución'}
            </button>
            {showSolution && (
              <div className="hint-box solution-box">
                <b>¿Cómo explotar Broken Access Control?</b>
                <ol>
                  <li>Inicia sesión como un usuario normal.</li>
                  <li>Accede a tu perfil o datos personales.</li>
                  <li>Cambia el parámetro <code>id</code> en la URL o en el cuerpo de la petición por el de otro usuario.</li>
                  <li>Si puedes ver o modificar datos ajenos, la aplicación es vulnerable a Broken Access Control.</li>
                </ol>
                <b>Resumen:</b> La aplicación debe comprobar siempre en el backend que el usuario autenticado tiene permiso para acceder o modificar el recurso solicitado, sin confiar en el frontend ni en los parámetros enviados por el usuario.
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
            onClick={() => window.open('/modulo/bac/entorno', '_blank')}
          >
            Abrir entorno vulnerable BAC
          </button>
          <div style={{ marginTop: 18 }}>
            <button
              className="sandbox-button"
              style={{ background: '#e53935', color: '#fff' }}
              onClick={async () => {
                await fetch('http://localhost:5001/bac-reset-usuarios', { method: 'POST', credentials: 'include' });
                await fetch('http://localhost:5001/logout', { method: 'POST', credentials: 'include' });
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
            <p>
              La vulnerabilidad Broken Access Control existe porque la aplicación no verifica correctamente los permisos del usuario autenticado antes de mostrar o modificar recursos. 
              El backend confía en los parámetros enviados por el usuario (como el <code>id</code> en la URL) y no comprueba si realmente tiene permiso para acceder o modificar ese recurso.
            </p>
            <p>
              Por ejemplo, si el backend permite acceder a <code>/perfil/usuario2</code> o <code>/perfil?id=2</code> sin comprobar que el usuario autenticado es realmente <code>usuario2</code> o el propietario del <code>id=2</code>, cualquier usuario podría ver o modificar datos ajenos.
            </p>
            <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontSize: '0.97em', overflowX: 'auto' }}>
{String.raw`@app.route('/perfil/<usuario>', methods=['GET', 'POST'])
def perfil(usuario):
    # ...carga o modifica datos del usuario indicado...
    return render_template('perfil.html', datos=datos_usuario)
`}
            </pre>
            <p>
              <strong>Solución:</strong> El backend debe comprobar siempre que el usuario autenticado tiene permiso para acceder o modificar el recurso solicitado. 
              No confíes en los datos enviados por el cliente y valida los permisos en cada petición sensible.
            </p>
            <ul>
              <li>Asocia cada recurso a un propietario y verifica la identidad del usuario autenticado.</li>
              <li>No expongas identificadores predecibles si no es necesario.</li>
              <li>Implementa controles de acceso centralizados y revisa los endpoints sensibles.</li>
              <li>Realiza auditorías y pruebas de seguridad periódicas.</li>
            </ul>
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