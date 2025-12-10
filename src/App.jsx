import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; // *** NYTT: För SEO ***

// 1. Importera ALLA dina sidor
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
import Boka from './pages/Boka';
import Blog from './pages/Blog';       
import BlogPost from './pages/BlogPost'; 
import Trygghet from './pages/Trygghet';
import Garanti from './pages/krav/Garanti';
import Bytesratt from './pages/krav/Bytesratt';
import Felsokning from './pages/krav/Felsokning';
import DataIntegritet from './pages/krav/DataIntegritet';
import Reklamation from './pages/krav/Reklamation';
import MedlemskapPolicy from './pages/krav/MedlemskapPolicy';
import Medlemskap from './pages/Medlemskap';

// 2. Importera alla layout- och adminkomponenter
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AdminIndex from './admin/AdminIndex';

// 3. Importera AuthProvider för att hantera inloggning
import { AuthProvider } from './admin/context/AuthContext';
// Importera CartProvider om den används i din app (den syntes i din tidigare kod men inte i texten du klistrade in nyss. 
// Om du använder CartProvider, låt den vara kvar. Jag utgår från din text här:)

// Denna komponent hanterar all logik för vad som ska visas
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Visa endast Header/Footer om det INTE är en admin-route */}
      {!isAdminRoute && <Header />}
      
      <ScrollToTop />
      
      {/* 'main'-taggen är nu utanför Routes för att alltid omsluta innehållet */}
      <main>
        <Routes>
          {/* Alla dina publika routes */}
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
          <Route path="/boka" element={<Boka />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/trygghet" element={<Trygghet />} />
          <Route path="/krav/garanti" element={<Garanti />} />
          <Route path="/krav/bytesratt" element={<Bytesratt />} />
          <Route path="/krav/felsokning" element={<Felsokning />} />
          <Route path="/krav/data-integritet" element={<DataIntegritet />} />
          <Route path="/krav/reklamation" element={<Reklamation />} />
          <Route path="/krav/medlemskapPolicy" element={<MedlemskapPolicy />} />
          <Route path="/medlemskap" element={<Medlemskap />} />
          
          {/* Route för hela den skyddade admin-sektionen */}
          <Route path="/admin/*" element={<AdminIndex />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </>
  );
};

// Huvud-App komponenten
function App() {
  return (
    // 4. Svep in hela appen i HelmetProvider, AuthProvider och BrowserRouter
    <HelmetProvider> 
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;