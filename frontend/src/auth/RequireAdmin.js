import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Outlet,Navigate } from 'react-router-dom';

function RequireAdmin({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!user || !user.rol === 'ROLE_ADMIN') {
    // Redirige o muestra mensaje de acceso denegado
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default RequireAdmin;