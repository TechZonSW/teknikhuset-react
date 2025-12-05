import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importera den nya layout-komponenten
import AdminLayout from './components/AdminLayout';

// Importera sidorna
import AdminDashboard from './pages/AdminDashboard';
import AdminReparationer from './pages/AdminReparationer';
import AdminLager from './pages/AdminLager';
import AdminLogin from './pages/AdminLogin';
// Vi kan lägga till en platshållare för Skanna-sidan också
const AdminSkanna = () => <h1>Skanna Sida</h1>; 

// Importera den delade admin-stylingen
import './Admin.css';

const AdminIndex = () => {
  return (
    <Routes>
      {/* En separat route för inloggningssidan som INTE har layouten */}
      <Route path="login" element={<AdminLogin />} />

      {/* Alla andra admin-sidor renderas inuti AdminLayout */}
      <Route path="/" element={<AdminLayout />}>
        {/* 'index' är default-sidan när man besöker /admin/ */}
        <Route index element={<AdminDashboard />} /> 
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="reparationer" element={<AdminReparationer />} />
        <Route path="lager" element={<AdminLager />} />
        <Route path="skanna" element={<AdminSkanna />} />
      </Route>
    </Routes>
  );
};

export default AdminIndex;