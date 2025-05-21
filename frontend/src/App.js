import React, { useState } from 'react';
import './App.css';
import ModuleList from './components/ModuleList'; // Importamos el componente
import LogoHomeLink from './components/LogoHomeLink'; // Importamos el componente LogoHomeLink
import SidebarMenu from './components/SidebarMenu';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="App">
      {/* Botón hamburguesa */}
      <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        ☰
      </button>

      {/* Menú lateral izquierdo */}
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Título */}
      <LogoHomeLink />

      {/* Contenido principal */}
      <main className="App-main">
        <section className="news-section">
          <h2>Novedades</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </section>
      </main>

      {/* Panel lateral derecho (ahora usando el componente reutilizable) */}
      <ModuleList />

      {/* Botón Sandbox */}
      <footer className="App-footer">
        <button className="sandbox-button">Sandbox</button>
      </footer>
    </div>
  );
}

export default App;