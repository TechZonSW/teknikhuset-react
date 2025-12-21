import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

// Befintliga ikoner från Lucide
import { Phone, Mail, MapPin } from 'lucide-react';

// NYA: Sociala ikoner från Phosphor (samma stil som Home.jsx) för en "mer levande" look
import { InstagramLogo, FacebookLogo, TiktokLogo } from 'phosphor-react';

const Footer = () => {
  return (
    <footer>
      <div className="footer-grid">

        {/* SEKTION 1 — Företagsinfo & Sociala Medier */}
        <div className="footer-column">
          <h4>Teknikhuset Kalmar</h4>
          <p>
            Din partner för en smartare vardag.  
            Expertis, transparens och service i världsklass.
          </p>
        </div>

        {/* SEKTION 2 — Tjänster */}
        <div className="footer-column">
          <h4>Tjänster</h4>
          <ul>
            <li><Link to="/reparation">Reparationer</Link></li>
            <li><Link to="/priser">Priser</Link></li>
            <li><Link to="/vardering">Sälj & Byt In</Link></li>

            {/* e-butik med badge */}
            <li>
              <Link to="/e-butik">e-Butik</Link>
              <span style={{ color: 'rgba(240, 237, 229, 0.5)' }}> (Lanserar 2026)</span>
            </li>
          </ul>
        </div>

        {/* SEKTION 3 — Upptäck */}
        <div className="footer-column">
          <h4>Upptäck</h4>
          <ul>
            <li><Link to="/spara">Spåra Reparation</Link></li>
            <li><Link to="/boka">Boka Tid</Link></li>
            <li><Link to="/medlemskap">Bli Medlem</Link></li>
            <li><Link to="/blog">Teknikbloggen</Link></li>
            <li><Link to="/for-foretag">Företagstjänster</Link></li>
          </ul>
        </div>

        {/* SEKTION 4 — Företaget */}
        <div className="footer-column">
          <h4>Företaget</h4>
          <ul>
            <li><Link to="/kontakt">Om Oss</Link></li>
            <li><Link to="/trygghet">Trygghet & Villkor</Link></li>
            <li><HashLink to="/kontakt#hitta-oss">Hitta till Oss</HashLink></li>
            <li><HashLink to="/kontakt#kontakt-formular">Kontakta Oss</HashLink></li>
          </ul>
        </div>

        {/* SEKTION 5 — Kontakt */}
        <div className="footer-column">
          <h4>Kontakt</h4>
          <p>
            <span className="footer-icon"><Phone size={14} /></span>
            <a href="tel:0761723014"> 076-172 30 14</a>
            <br />

            <span className="footer-icon"><Mail size={14} /></span>
            <a href="mailto:team@teknikhusetkalmar.se"> team@teknikhusetkalmar.se</a>
            <br />

            <span className="footer-icon"><MapPin size={14} /></span>
            {' '}Norra Långgatan 11B<br />
            392 32 Kalmar
          </p>
        </div>

        {/* SEKTION 6 — Öppettider */}
        <div className="footer-column">
          <h4>Öppettider</h4>
          <p>
            Mån - Fre: 09:00 - 20:00<br />
            Lör - Sön: 10:00 - 18:00
          </p>
        </div>

        {/* NYTT: Sociala medier */}
          <div className="footer-social-links" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <a 
              href="https://instagram.com/teknikhuset.kalmar" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              style={{ color: 'inherit', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <InstagramLogo size={32} weight="fill" />
            </a>
            <a 
              href="https://tiktok.com/@teknikhuset.kalmar" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="TikTok"
              style={{ color: 'inherit', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <TiktokLogo size={32} weight="fill" />
            </a>
            <a 
              href="https://www.facebook.com/people/Teknikhuset-Kalmar/61584528936727/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook"
              style={{ color: 'inherit', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <FacebookLogo size={32} weight="fill" />
            </a>
          </div>
      </div>

      {/* BOTTOM LINE */}
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Teknikhuset Kalmar AB. Alla rättigheter förbehållna.
        </p>
      </div>
    </footer>
  );
};

export default Footer;