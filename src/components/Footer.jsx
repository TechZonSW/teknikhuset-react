import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const Footer = () => {
  return (
    <footer>
      <div className="footer-grid">
        {/* Kolumn 1: Din beskrivning */}
        <div className="footer-column">
          <h4>Teknikhuset Kalmar</h4>
          <p>Din partner för en smartare vardag. Expertis, transparens och service i världsklass.</p>
        </div>

        {/* Kolumn 2: Våra Tjänster */}
        <div className="footer-column">
          <h4>Våra Tjänster</h4>
          <ul>
            <li><Link to="/reparation">Reparationer</Link></li>
            <li><Link to="/vardering">Sälj & Byt In</Link></li>
            <li><Link to="/e-butik">e-Butik</Link></li>
            <li><Link to="/priser">Priser</Link></li>
          </ul>
        </div>

        {/* Kolumn 3: Företagstjänster (NY) */}
        <div className="footer-column">
          <h4>Företagstjänster</h4>
          <ul>
            <li><Link to="/for-foretag">För Företag</Link></li>
            <li><span style={{ color: 'rgba(240, 237, 229, 0.5)' }}>Fler tjänster kommer</span></li>
          </ul>
        </div>

        {/* Kolumn 4: Företaget */}
        <div className="footer-column">
          <h4>Företaget</h4>
          <ul>
            <li><Link to="/kontakt">Om Oss</Link></li>
            <li><HashLink to="/kontakt#hitta-oss">Hitta till Oss</HashLink></li>
            <li><HashLink to="/kontakt#kontakt-formular">Kontakta Oss</HashLink></li>
          </ul>
        </div>

        {/* Kolumn 5: Kontaktuppgifter */}
        <div className="footer-column">
          <h4>Kontakta oss</h4>
          <p>
            Norra Långgatan 11B<br />
            392 32 Kalmar<br />
            <a href="tel:0480123456">0480-123 456</a><br />
            <a href="mailto:team@teknikhusetkalmar.se">team@teknikhusetkalmar.se</a>
          </p>
        </div>

        {/* Kolumn 6: Öppettider */}
        <div className="footer-column">
          <h4>Öppettider</h4>
          <p>
            Mån - Fre: 09:00 - 20:00<br />
            Lör - Sön: 10:00 - 18:00<br />
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Teknikhuset Kalmar AB. Alla rättigheter förbehållna.
        </p>
      </div>
    </footer>
  );
};

export default Footer;