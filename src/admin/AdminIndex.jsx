import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importera komponenter och sidor
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminReparationer from './pages/AdminReparationer';
import AdminLager from './pages/AdminLager';
// *** NYA IMPORTER ***
import AdminBlog from './pages/AdminBlog';
import AdminBlogEditor from './pages/AdminBlogEditor';

const AdminSkanna = () => <h1>Skanna Sida</h1>;
import './Admin.css';

const AdminIndex = () => {
  return (
    <Routes>
      {/* Rutt 1: Inloggningssidan. Den är INTE skyddad. */}
      <Route path="login" element={<AdminLogin />} />

      {/* Rutt 2: En skyddad "wrapper" för alla andra admin-sidor */}
      <Route element={<ProtectedRoute />}>
        {/* Allt här innanför kräver inloggning */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="reparationer" element={<AdminReparationer />} />
          <Route path="lager" element={<AdminLager />} />
          <Route path="skanna" element={<AdminSkanna />} />

          {/* *** NYA BLOGG-ROUTES FÖR ADMIN *** */}
          <Route path="blog" element={<AdminBlog />} />
          <Route path="blog/ny" element={<AdminBlogEditor />} />
          <Route path="blog/redigera/:id" element={<AdminBlogEditor />} />
          
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminIndex;