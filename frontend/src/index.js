import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

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
import VulnerableShop from './modulo_sql_inj/VulnerableShop';
import ProductoDetalle from './modulo_sql_inj/ProductoDetalle';
import VMListado from './vm/VMListado';
import VMDetalle from './vm/VMDetalle';
import VMCreador from './vm/VMCreador';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
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
        <Route path="/modulo/sql-inyeccion/tienda" element={<VulnerableShop />} />
        <Route path="/modulo/sql-inyeccion/tienda/producto" element={<ProductoDetalle />} />
        {/* Rutas de máquinas virtuales */}
        <Route path="/machines" element={<VMListado />} />
        <Route path="/machines/crear" element={<VMCreador />} />
        <Route path="/machines/:id" element={<VMDetalle />} />
        <Route path="/machines/:id/editar" element={<VMCreador />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
  </AuthProvider>
);

// Opcional: seguir midiendo rendimiento
reportWebVitals();