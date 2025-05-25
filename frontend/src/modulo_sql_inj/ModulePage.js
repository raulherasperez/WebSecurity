import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ModulePage.css';
import { useAuth } from '../context/AuthContext';

import InteractiveTest from '../components/InteractiveTest';
import sqlQuestions from './questions';
import LogoHomeLink from '../components/LogoHomeLink';
import ModuleList from '../components/ModuleList';
import SidebarMenu from '../components/SidebarMenu';
import ModuleComments from '../components/ModuleComments';

function ModulePage() {
  const [showDetails, setShowDetails] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { user } = useAuth();

  // Estados para mostrar pistas/soluciones por ejercicio
  const [showHint1, setShowHint1] = useState(false);
  const [showSolution1, setShowSolution1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [showSolution2, setShowSolution2] = useState(false);
  const [showHint3, setShowHint3] = useState(false);
  const [showSolution3, setShowSolution3] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="ModulePage">
      {/* Botón hamburguesa */}
      <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        ☰
      </button>

      {/* Menú lateral izquierdo */}
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Título */}
      <LogoHomeLink />

      <main className="ModuleContent">
        <h1 className="h1">Módulo 1: Inyección SQL</h1>
        <p>
          La <strong>inyección SQL</strong> es una de las vulnerabilidades más peligrosas y frecuentes en aplicaciones web. 
          Ocurre cuando una aplicación construye consultas SQL de forma insegura, permitiendo que un usuario malicioso inserte código SQL propio en los campos de entrada (como formularios de login, búsqueda o parámetros en la URL).
        </p>
        <p>
          Si una aplicación no valida ni filtra correctamente los datos que recibe del usuario, un atacante puede manipular las consultas a la base de datos. Esto puede permitirle:
        </p>
        <ul>
          <li>Acceder a información confidencial (usuarios, contraseñas, datos personales...)</li>
          <li>Modificar, borrar o insertar datos en la base de datos</li>
          <li>Eludir controles de autenticación y acceder como otro usuario</li>
          <li>Obtener acceso total al sistema en casos graves</li>
        </ul>
        <p>
          Por ejemplo, si un formulario de login construye la consulta SQL directamente con los datos introducidos por el usuario, un atacante podría alterar la lógica de autenticación y acceder sin conocer la contraseña.
        </p>
        <p>
          En este módulo aprenderás a identificar, explotar y entender el impacto de la inyección SQL, así como a proteger tus aplicaciones frente a este tipo de ataques.
        </p>
        <p>
          <strong>¿Quieres saber más?</strong> Consulta estos recursos recomendados:
          <ul>
            <li>
              <a href="https://owasp.org/www-community/attacks/SQL_Injection" target="_blank" rel="noopener noreferrer">
                OWASP: SQL Injection
              </a>
            </li>
            <li>
              <a href="https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer">
                OWASP Cheat Sheet: Prevención de SQL Injection
              </a>
            </li>
            <li>
              <a href="https://portswigger.net/web-security/sql-injection" target="_blank" rel="noopener noreferrer">
                PortSwigger Web Security Academy: SQL Injection
              </a>
            </li>
            <li>
              <a href="https://www.hacksplaining.com/exercises/sql-injection" target="_blank" rel="noopener noreferrer">
                Hacksplaining: Ejercicio interactivo de SQL Injection
              </a>
            </li>
          </ul>
        </p>


        {/* Ejemplo y vídeo */}
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

                {/* Ejercicio 1 */}
        <section>
          <h2>Ejercicio 1: Login vulnerable</h2>
          <p>
            El primer paso para acceder a la tienda es iniciar sesión. El formulario de login es vulnerable a inyección SQL,
            lo que significa que puedes acceder como cualquier usuario sin conocer su contraseña real.
          </p>
          <button className="hint-btn" onClick={() => setShowHint1(h => !h)}>
            {showHint1 ? 'Ocultar pista' : 'Mostrar pista'}
          </button>
          {showHint1 && (
            <div className="hint-box">
              Prueba a escribir algo especial en el campo de usuario o contraseña para alterar la consulta SQL.
            </div>
          )}
          <button className="hint-btn" onClick={() => setShowSolution1(s => !s)}>
            {showSolution1 ? 'Ocultar solución' : 'Mostrar solución'}
          </button>
          {showSolution1 && (
            <div className="hint-box solution-box">
              Por ejemplo, puedes probar con: <code>admin' OR 1=1 --</code> en el campo de usuario.
            </div>
          )}
        </section>

        {/* Ejercicio 2 */}
        <section>
          <h2>Ejercicio 2: Detalles de producto vulnerables</h2>
          <p>
            Una vez dentro, puedes ver el catálogo de productos. Si haces clic en un producto, accederás a una pantalla de detalle.
            El endpoint que obtiene los detalles es vulnerable a inyección SQL, así que puedes manipular el parámetro <code>id</code> en la URL para intentar acceder a productos ocultos o a información de otros productos.
          </p>
          <button className="hint-btn" onClick={() => setShowHint2(h => !h)}>
            {showHint2 ? 'Ocultar pista' : 'Mostrar pista'}
          </button>
          {showHint2 && (
            <div className="hint-box">
              Prueba a modificar el valor del parámetro <code>id</code> directamente en la barra de direcciones del navegador tras acceder al detalle de un producto.
            </div>
          )}
          <button className="hint-btn" onClick={() => setShowSolution2(s => !s)}>
            {showSolution2 ? 'Ocultar solución' : 'Mostrar solución'}
          </button>
          {showSolution2 && (
            <div className="hint-box solution-box">
              Cambia la URL de la página de detalle, por ejemplo:<br />
              <code>/modulo/sql-inyeccion/tienda/producto?id=1 OR 1=1</code><br />
              Esto puede permitirte ver productos ocultos o información adicional si el backend es vulnerable.
            </div>
          )}
        </section>

        {/* Ejercicio 3 */}
        <section>
          <h2>Ejercicio 3: Filtros avanzados vulnerables</h2>
          <p>
            Utiliza los filtros de búsqueda (nombre, categoría) en el catálogo. Todos los filtros son vulnerables a inyección SQL.
          </p>
          <button className="hint-btn" onClick={() => setShowHint3(h => !h)}>
            {showHint3 ? 'Ocultar pista' : 'Mostrar pista'}
          </button>
          {showHint3 && (
            <div className="hint-box">
              Intenta escribir algo inesperado en los campos de búsqueda o categoría para ver si puedes mostrar productos ocultos.
            </div>
          )}
          <button className="hint-btn" onClick={() => setShowSolution3(s => !s)}>
            {showSolution3 ? 'Ocultar solución' : 'Mostrar solución'}
          </button>
          {showSolution3 && (
            <div className="hint-box solution-box">
              Por ejemplo, en el campo de búsqueda puedes probar: <code>' OR 1=1 --</code>
            </div>
          )}
        </section>

        {/* Botón para abrir el entorno vulnerable */}
        <section>
          <h2>Acceso al entorno vulnerable</h2>
          <p>
            Pulsa el siguiente botón para abrir la tienda vulnerable en una nueva pestaña y realizar los ejercicios libremente.
            Recuerda: el entorno vulnerable integra todos los retos en una única experiencia, como una tienda real.
          </p>
          <button
            className="sandbox-button"
            style={{ marginTop: 12 }}
            onClick={() => window.open('/modulo/sql-inyeccion/tienda', '_blank')}
          >
            Abrir entorno vulnerable
          </button>
        </section>

        <ModuleComments moduleId="sql-inyeccion" user={user} />

      </main>
      <ModuleList />
      <footer className="App-footer">
        <button className="sandbox-button">Sandbox</button>
      </footer>
    </div>
  );
}

export default ModulePage;