import React, { useState, useEffect } from 'react';
import './App.css';
import ModuleList from './components/ModuleList';
import LogoHomeLink from './components/LogoHomeLink';
import SidebarMenu from './components/SidebarMenu';
import Footer from './components/Footer';
import ModalLogroDesbloqueado from './components/ModalLogroDesbloqueado';

function App() {
  const [logroDesbloqueado, setLogroDesbloqueado] = useState(null);

  useEffect(() => {
    const logro = localStorage.getItem('logroDesbloqueado');
    if (logro) {
      setLogroDesbloqueado(JSON.parse(logro));
      localStorage.removeItem('logroDesbloqueado');
    }
  }, []);

  const handleCloseModal = () => setLogroDesbloqueado(null);

  return (
    <div className="App">
      {/* Modal de logro desbloqueado */}
      {logroDesbloqueado && (
        <ModalLogroDesbloqueado logro={logroDesbloqueado} onClose={handleCloseModal} />
      )}

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