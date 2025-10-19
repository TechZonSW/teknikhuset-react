import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { List, X, ShoppingCartSimple } from 'phosphor-react'; // Tog bort CaretDown

const Header = () => {
  // State för mobilmeny och header-scroll
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [imageError, setImageError] = useState(false);

  // === FÖRENKLAT: Funktion för att bara hantera mobilmenyn ===
  const toggleMobileNav = () => {
    setMobileNavOpen(!isMobileNavOpen);
  };
  
  // Funktion för att stänga menyn, t.ex. när man klickar på en länk
  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  // Effekt för scroll-beteende
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="container">
        <Link to="/" className="logo" onClick={closeMobileNav}>
          {imageError ? (
            <span className="logo-text">TEKNIKHUSET KALMAR</span>
          ) : (
            <img 
              src="/bilder/logo.png" 
              alt="TEKNIKHUSET KALMAR" 
              className="logo-img" 
              onError={() => setImageError(true)} 
            />
          )}
        </Link>
        
        <div className="header-right">
          {/* Klassen 'mobile-nav-active' styr synligheten på mobilen */}
          <nav className={isMobileNavOpen ? 'mobile-nav-active' : ''}>
            <ul>
              <li><NavLink to="/" onClick={closeMobileNav}>Hem</NavLink></li>
              
              {/* === FÖRENKLAT: e-Butik är nu en vanlig länk === */}
              <li><NavLink to="/e-butik" onClick={closeMobileNav}>e-Butik</NavLink></li>
              <li><NavLink to="/reparation" onClick={closeMobileNav}>Reparation</NavLink></li>
              <li><NavLink to="/priser" onClick={closeMobileNav}>Priser</NavLink></li>
              <li><NavLink to="/vardering" onClick={closeMobileNav}>Sälj/Byt In</NavLink></li>
              <li><NavLink to="/kontakt" onClick={closeMobileNav}>Om Oss</NavLink></li>
            </ul>
          </nav>
          
          <div className="header-actions">
            <div className="cart-icon-container">
              <Link to="/kassa" aria-label="Varukorg">
                <ShoppingCartSimple size={24} />
              </Link>
            </div>
            
            <button className="mobile-menu-toggle" onClick={toggleMobileNav} aria-label="Växla meny">
              {isMobileNavOpen ? <X size={32} /> : <List size={32} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;