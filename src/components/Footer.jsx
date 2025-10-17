import { Link } from 'react-router-dom';

const Footer = () => {
  // OBS: Logiken för årtal behöver återskapas i React
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-column">
          <h4>TechZon Kalmar</h4>
          <p>Din certifierade partner för reparationer, tillbehör och service för all din hemelektronik.</p>
        </div>
        <div className="footer-column">
          <h4>Snabblänkar</h4>
          <ul>
            <li><Link to="/">Hem</Link></li>
            <li><Link to="/e-butik">e-Butik</Link></li>
            <li><Link to="/reparation">Reparation</Link></li>
            {/* Fortsätt med resten av länkarna... */}
            <li><Link to="/kontakt">Om Oss</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Kontakta oss</h4>
          <p>
            Exempelgatan 123<br />
            392 34 Kalmar<br />
            <a href="tel:0480123456">0480-123 456</a><br />
            <a href="mailto:info@techzonkalmar.se">info@techzonkalmar.se</a>
          </p>
        </div>
        <div className="footer-column">
          <h4>Öppettider</h4>
          <p>
            Mån - Fre: 10:00 - 18:00<br />
            Lördag: 11:00 - 15:00<br />
            Söndag: Stängt
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© <span id="currentYear">2024</span> TechZon Kalmar. Alla rättigheter förbehållna.</p>
      </div>
    </footer>
  );
};

export default Footer;