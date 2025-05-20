import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import App from './App'; // Página de inicio
import ModulePage from './modulo_sql_inj/ModulePage'; // Página del Módulo SQL
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<App />} />

        {/* Ruta del módulo SQL */}
        <Route path="/modulo/sql-inyeccion" element={<ModulePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// Opcional: seguir midiendo rendimiento
reportWebVitals();