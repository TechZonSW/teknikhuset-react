import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { List, X, ShoppingCartSimple, CaretDown } from 'phosphor-react';

const Header = () => {
  // State för att hantera mobilmenyns synlighet (öppen/stängd)
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  
  // State för att hantera dropdown-menyns synlighet
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  
  // State för att veta om sidan har scrollats (för att lägga till skugga på headern)
  const [scrolled, setScrolled] = useState(false);

  // Funktion för att växla (öppna/stänga) mobilmenyn
  const toggleMobileNav = () => {
    setMobileNavOpen(!isMobileNavOpen);
    // Stäng dropdown om mobilmenyn öppnas/stängs
    if (isDropdownOpen) setDropdownOpen(false); 
  };
  
  // Funktion för att växla dropdown-menyn
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Funktion för att stänga båda menyerna, t.ex. när man klickar på en länk
  const closeMenus = () => {
    setMobileNavOpen(false);
    setDropdownOpen(false);
  };

  // Effekt som kollar om användaren scrollar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    // Städa upp event listener när komponenten försvinner
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Lägger till 'scrolled'-klassen på headern när man scrollat lite
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="container">
        {/* Logotypen, klick leder till startsidan och stänger menyerna */}
        <Link to="/" className="logo" onClick={closeMenus}>
          {/* FIX: Sökvägen till bilder i 'public'-mappen ska starta med '/' */}
          <img src="logo.png" alt="TEKNIKHUSET KALMAR" className="logo-img" />
        </Link>
        
        <div className="header-right">
          {/* Navigering för datorer */}
          <nav className={isMobileNavOpen ? 'mobile-nav-active' : ''}>
            <ul>
              <li><NavLink to="/" onClick={closeMenus}>Hem</NavLink></li>
              
              {/* Dropdown för e-Butik */}
              <li className="dropdown">
                {/* Använder en knapp för att kunna kontrollera dropdown */}
                <button onClick={toggleDropdown} className={isDropdownOpen ? 'active' : ''}>
                  e-Butik <CaretDown size={16} />
                </button>
                {isDropdownOpen && (
                  <ul className="dropdown-menu">
                    <li><Link to="/e-butik/mobiler" onClick={closeMenus}>Mobiler</Link></li>
                    <li><Link to="/e-butik/datorer" onClick={closeMenus}>Datorer</Link></li>
                    <li><Link to="/e-butik/tillbehor" onClick={closeMenus}>Tillbehör</Link></li>
                  </ul>
                )}
              </li>

              <li><NavLink to="/reparation" onClick={closeMenus}>Reparation</NavLink></li>
              <li><NavLink to="/priser" onClick={closeMenus}>Priser</NavLink></li>
              <li><NavLink to="/vardering" onClick={closeMenus}>Sälj/Byt In</NavLink></li>
              <li><NavLink to="/kontakt" onClick={closeMenus}>Om Oss</NavLink></li>
            </ul>
          </nav>
          
          <div className="header-actions">
            <div className="cart-icon-container">
              <Link to="/kassa" aria-label="Varukorg">
                <ShoppingCartSimple size={24} />
                {/* Framtida logik för att visa antal varor kan läggas här */}
                {/* <span className="cart-count">0</span> */}
              </Link>
            </div>
            
            {/* Hamburgare-knapp som bara syns på mobilen (via CSS) */}
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