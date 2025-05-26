import React, { useState } from 'react';
import './App.css';
import ModuleList from './components/ModuleList'; // Importamos el componente
import LogoHomeLink from './components/LogoHomeLink'; // Importamos el componente LogoHomeLink
import SidebarMenu from './components/SidebarMenu';
import Footer from './components/Footer'; // Importamos el componente Footer
function App() {
  

  return (
    <div className="App">
      
      {/* Contenido principal */}
      <main className="App-main">
        <section className="news-section">
          <h2>Novedades</h2>
          <p>
            Esta es la versión inicial de la aplicación. Aquí puedes encontrar las últimas novedades y actualizaciones.
          </p>
        </section>
      </main>

      <ModuleList />
    </div>
  );
}

export default App;