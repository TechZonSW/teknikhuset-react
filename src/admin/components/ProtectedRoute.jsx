import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  // Om vi fortfarande kollar om en token finns, visa en laddningssida
  if (loading) {
    return <div>Laddar...</div>; // Eller en snyggare laddningsspinner
  }

  // Om vi är klara med laddningen och det INTE finns någon token, omdirigera
  if (!token) {
    // 'replace' ser till att användaren inte kan trycka "bakåt" till den skyddade sidan
    return <Navigate to="/admin/login" replace />;
  }

  // Om en token finns, rendera den faktiska sidan (t.ex. Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;