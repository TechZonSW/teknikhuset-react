import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import EButik from './pages/EButik';
import Reparation from './pages/Reparation';
import Priser from './pages/Priser';
import Vardering from './pages/Vardering';
import Kontakt from './pages/Kontakt';
import Kassa from './pages/Kassa';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="e-butik" element={<EButik />} />
          <Route path="reparation" element={<Reparation />} />
          <Route path="priser" element={<Priser />} />
          <Route path="vardering" element={<Vardering />} />
          <Route path="kontakt" element={<Kontakt />} />
          <Route path="kassa" element={<Kassa />} />
          {/* Lägg till fler sidor här vid behov */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;