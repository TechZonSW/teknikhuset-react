import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Importera alla sidor
import Home from './pages/Home';
import EButik from './pages/EButik';
import Reparation from './pages/Reparation';
import Priser from './pages/Priser';
import Vardering from './pages/Vardering';
import Kontakt from './pages/Kontakt';
import Kassa from './pages/Kassa';
import ForForetag from './pages/ForForetag';
import Spara from './pages/Spara';
import ProductPage from './pages/ProductPage';
import Boka from './pages/Boka'; // <-- ÄNDRING: Importera den nya Boka-sidan

// Importera de återanvändbara komponenterna
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Importera admin-komponenten
import AdminIndex from './admin/AdminIndex';

const MainLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      
      <ScrollToTop />
      <main>
        <Routes>
          {/* Befintliga publika routes */}
          <Route path="/" element={<Home />} />
          <Route path="/e-butik" element={<EButik />} />
          <Route path="/produkt/:productId" element={<ProductPage />} />
          <Route path="/reparation" element={<Reparation />} />
          <Route path="/priser" element={<Priser />} />
          <Route path="/vardering" element={<Vardering />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/kassa" element={<Kassa />} />
          <Route path="/for-foretag" element={<ForForetag />} />
          <Route path="/spara" element={<Spara />} />
          
          {/* --- ÄNDRING STARTAR HÄR --- */}
          {/* Lade till den nya routen för bokningssidan */}
          <Route path="/boka" element={<Boka />} />
          {/* --- ÄNDRING SLUTAR HÄR --- */}
          
          {/* Route för hela admin-sektionen */}
          <Route path="/admin/*" element={<AdminIndex />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </>
  );
};


function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;