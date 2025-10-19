import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  // Function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header>
      <div className="container header-container">
        <Link to="/" className="logo">
          {/* Se till att bild-sökvägen stämmer. Lägg bilder i public/-mappen */}
          <img src="xPublic/bilder/logo.png" alt="TEKNIKHUSET KALMAR" className="logo-img" />
        </Link>
        <div className="header-right">
          <nav>
            <ul className="desktop-nav">
              <li>
                <Link to="/" className={isActive('/')}>
                  Hem
                </Link>
              </li>
              <li className="dropdown">
                <Link to="/e-butik" className={isActive('/e-butik')}>
                  e-Butik <i className="ph ph-caret-down"></i>
                </Link>
                {/* Dropdown-logik behöver återskapas i React */}
              </li>
              <li>
                <Link to="/reparation" className={isActive('/reparation')}>
                  Reparation
                </Link>
              </li>
              <li>
                <Link to="/priser" className={isActive('/priser')}>
                  Priser
                </Link>
              </li>
              <li>
                <Link to="/vardering" className={isActive('/vardering')}>
                  Sälj/Byt In
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className={isActive('/kontakt')}>
                  Om Oss
                </Link>
              </li>
            </ul>
          </nav>
          <div className="header-actions">
            <div id="cart-icon-container" className="cart-icon-container">
              <Link to="/kassa">
                <i className="ph ph-shopping-cart-simple"></i>
                <span id="cart-count" className="cart-count" style={{ display: 'none' }}>0</span>
              </Link>
            </div>
            <button id="mobile-menu-toggle" className="mobile-menu-toggle">
              <i className="ph-bold ph-list"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;