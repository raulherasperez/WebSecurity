import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import './index.css';
import LoginPage from './auth/LoginPage';
import App from './App'; // Página de inicio
import ModulePageSQLi from './modulo_sql_inj/ModulePageSQLi'; // Página del Módulo SQL
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
import GlosarioListado from './glosario/GlosarioListado';
import GlosarioCrear from './glosario/GlosarioCrear';
import GlosarioEditar from './glosario/GlosarioEditar';
import ReporteListado from './reporte/ReporteListado';
import ReporteCrear from './reporte/ReporteCrear';
import SugerenciaListado from './sugerencia/SugerenciaListado';
import SugerenciaCrear from './sugerencia/SugerenciaCrear';
import LogrosUsuario from './logros/LogrosUsuario';
import LogrosAdmin from './logros/LogrosAdmin';
import ModulePageXSS from './modulo_xss/ModulePageXSS';
import EntornoVulnerableXSS from './modulo_xss/EntornoVulnerableXSS';
import ModulePageCSRF from './modulo_csrf/ModulePageCSRF';
import EntornoVulnerableCSRF from './modulo_csrf/EntornoVulnerableCSRF';
import EntornoVulnerableCSRFForo from './modulo_csrf/EntornoVulnerableCSRFForo';
import ModulePageBAC from './modulo_bac/ModulePageBAC';
import EntornoVulnerableBAC from './modulo_bac/EntornoVulnerableBAC';
import ModulePageSSRF from './modulo_ssrf/ModulePageSSRF';
import EntornoVulnerableSSRFShop from './modulo_ssrf/EntornoVulnerableSSRFShop';

// Importa el layout principal
import MainLayout from './components/MainLayout';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          {/* Rutas SIN layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/modulo/sql-inyeccion/tienda" element={<VulnerableShop />} />
          <Route path="/modulo/sql-inyeccion/tienda/producto" element={<ProductoDetalle />} />
          <Route path="/modulo/xss/entorno" element={<EntornoVulnerableXSS />} />
          <Route path="/modulo/csrf/entorno" element={<EntornoVulnerableCSRF />} />
          <Route path="/modulo/csrf/entorno-foro" element={<EntornoVulnerableCSRFForo />} />
          <Route path="/modulo/bac/entorno" element={<EntornoVulnerableBAC />} />
          <Route path="/modulo/bac/entorno/:id" element={<EntornoVulnerableBAC />} />
          <Route path="/modulo/ssrf/entorno" element={<EntornoVulnerableSSRFShop />} />

          {/* Rutas CON layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<App />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/guias" element={<GuiaListado />} />
            <Route path="/guias/:id" element={<GuiaDetalle />} />
            <Route path="/guias/crear" element={<GuiaCrear />} />
            <Route path="/guias/:id/editar" element={<GuiaEditar />} />

            <Route path="/modulo/sql-inyeccion" element={<ModulePageSQLi />} />
            <Route path="/modulo/xss" element={<ModulePageXSS />} />
            <Route path="/modulo/csrf" element={<ModulePageCSRF />} />
            <Route path="/modulo/bac" element={<ModulePageBAC />} />
            <Route path="/modulo/ssrf" element={<ModulePageSSRF />} />
            
            {/* Rutas de máquinas virtuales */}
            <Route path="/machines" element={<VMListado />} />
            <Route path="/machines/crear" element={<VMCreador />} />
            <Route path="/machines/:id" element={<VMDetalle />} />
            <Route path="/machines/:id/editar" element={<VMCreador />} />
            {/* Rutas del glosario */}
            <Route path="/glosario" element={<GlosarioListado />} />
            <Route path="/glosario/crear" element={<GlosarioCrear />} />
            <Route path="/glosario/editar/:id" element={<GlosarioEditar />} />
            {/* Rutas de reportes */}
            <Route path="/reportes" element={<ReporteListado />} />
            <Route path="/reportes/crear" element={<ReporteCrear />} />
            {/* Rutas de sugerencias */}
            <Route path="/sugerencias" element={<SugerenciaListado />} />
            <Route path="/sugerencias/crear" element={<SugerenciaCrear />} />
            <Route path="/logros" element={<LogrosUsuario />} />
             <Route path="/logros/admin" element={<LogrosAdmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </AuthProvider>
);

// Opcional: seguir midiendo rendimiento
reportWebVitals();