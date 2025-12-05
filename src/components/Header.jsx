import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { List, X, ShoppingCartSimple, ArrowRight } from 'phosphor-react';

const Header = () => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeMegamenu, setActiveMegamenu] = useState(null);
  const megamenuTimeoutRef = useRef(null);

  const toggleMobileNav = () => {
    setMobileNavOpen(!isMobileNavOpen);
  };
  
  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  const handleMegamenuEnter = () => {
    if (megamenuTimeoutRef.current) {
      clearTimeout(megamenuTimeoutRef.current);
    }
    setActiveMegamenu('explore');
  };

  const handleMegamenuLeave = () => {
    megamenuTimeoutRef.current = setTimeout(() => {
      setActiveMegamenu(null);
    }, 300);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (megamenuTimeoutRef.current) {
        clearTimeout(megamenuTimeoutRef.current);
      }
    };
  }, []);

  // --- ÄNDRING STARTAR HÄR ---
  // Lade till "e-Butik" och "Företagslösningar" i listan.
  const exploreMegamenuItems = [
    {
      title: 'e-Butik',
      description: 'Handplockad teknik och tillbehör',
      icon: '🛒',
      path: '/e-butik',
    },
    {
      title: 'Företagslösningar',
      description: 'Skräddarsydd service för företag',
      icon: '🏢',
      path: '/for-foretag',
    },
    {
      title: 'Boka Tid',
      description: 'Säkra din personliga servicetid',
      icon: '🗓️',
      path: '/boka',
    },
    {
      title: 'Spåra din Reparation',
      description: 'Följ din reparation i realtid',
      icon: '📍',
      path: '/spara',
    },
    {
      title: 'Värdera din Enhet',
      description: 'Få ett bud på din gamla telefon',
      icon: '💰',
      path: '/vardering',
    },
  ];
  // --- ÄNDRING SLUTAR HÄR ---

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
          <nav className={isMobileNavOpen ? 'mobile-nav-active' : ''}>
            <div className="mobile-nav-header">
              <button className="mobile-menu-close" onClick={toggleMobileNav} aria-label="Stäng meny">
                <X size={32} weight="bold" />
              </button>
            </div>
            
            <ul>
              <li><NavLink to="/" onClick={closeMobileNav}>Hem</NavLink></li>
              {/* --- ÄNDRING: Tog bort "e-Butik" härifrån --- */}
              <li><NavLink to="/reparation" onClick={closeMobileNav}>Reparation</NavLink></li>
              <li><NavLink to="/priser" onClick={closeMobileNav}>Priser</NavLink></li>
              {/* --- ÄNDRING: Tog bort "Företagslösningar" härifrån --- */}
                            
              {/* UTFORSKA - DESKTOP MEGAMENU */} 
              <li 
                className="megamenu-wrapper-li"
                onMouseEnter={handleMegamenuEnter}
                onMouseLeave={handleMegamenuLeave}
              >
                <button 
                  className={`megamenu-trigger ${activeMegamenu === 'explore' ? 'active' : ''}`}
                  aria-label="Utforska meny"
                >
                  Utforska
                  <span className="megamenu-arrow">›</span>
                </button>
                
                {activeMegamenu === 'explore' && (
                  <div className="megamenu">
                    <div className="megamenu-content">
                      {exploreMegamenuItems.map((item, idx) => (
                        <Link 
                          key={idx}
                          to={item.path} 
                          className="megamenu-item"
                          onClick={() => {
                            setActiveMegamenu(null);
                            closeMobileNav();
                          }}
                        >
                          <div className="megamenu-item-icon">{item.icon}</div>
                          <div className="megamenu-item-text">
                            <h4>{item.title}</h4>
                            <p>{item.description}</p>
                          </div>
                          <ArrowRight size={16} weight="bold" className="megamenu-item-arrow" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>

              {/* MOBILE VERSION AV UTFORSKA */}
              <li className="megamenu-item-mobile">
                <span className="megamenu-toggle-mobile">Utforska</span>
                <ul className="megamenu-mobile">
                  {exploreMegamenuItems.map((item, idx) => (
                    <li key={idx}>
                      <NavLink to={item.path} onClick={closeMobileNav}>
                        <span className="megamenu-mobile-icon">{item.icon}</span>
                        {item.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>

              <li><NavLink to="/kontakt" onClick={closeMobileNav}>Om Oss</NavLink></li>
              
            </ul>
          </nav>

          <div className="cart-icon-container">
            <NavLink to="/kassa" aria-label="Varukorg" onClick={closeMobileNav}>
              <ShoppingCartSimple size={24} />
            </NavLink>
          </div>

          <button className="mobile-menu-toggle" onClick={toggleMobileNav} aria-label="Öppna meny">
            <List size={32} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;