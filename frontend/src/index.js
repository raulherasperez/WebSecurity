import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import LoginPage from './auth/LoginPage';
import App from './App'; // Página de inicio
import ModulePage from './modulo_sql_inj/ModulePage'; // Página del Módulo SQL
import reportWebVitals from './reportWebVitals';
import UserProfile from './user/UserProfile';
import RegisterPage from './auth/RegisterPage';
import GuiaListado from './guia/GuiaListado';
import GuiaDetalle from './guia/GuiaDetalle';
import GuiaCrear from './guia/GuiaCrear';
import GuiaEditar from './guia/GuiaEdicion';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/guias" element={<GuiaListado />} />
        <Route path="/guias/:id" element={<GuiaDetalle />} />
        <Route path="/guias/crear" element={<GuiaCrear />} />
        <Route path="/guias/:id/editar" element={<GuiaEditar />} />
        {/* Ruta del módulo SQL */}
        <Route path="/modulo/sql-inyeccion" element={<ModulePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// Opcional: seguir midiendo rendimiento
reportWebVitals();