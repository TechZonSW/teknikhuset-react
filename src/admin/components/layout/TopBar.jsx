import React from 'react';
import { 
  Search,
  Settings,
  Bell,
  Menu,
  X
} from 'lucide-react';

export default function TopBar({ mobileMenuOpen, setMobileMenuOpen }) {
  // OBS: Vi kommer att hämta 'currentPage' från routen senare.
  // För nu kan vi lämna den statisk eller ta bort den.
  // I detta steg tar vi bort den för att förbereda för dynamisk data.

  return (
    <div className="admin-top-bar">
      <div className="top-bar-left">
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          title="Meny"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="breadcrumb">
          {/* Denna kommer uppdateras dynamiskt i ett senare skede */}
          <span className="breadcrumb-item active">Välkommen</span>
        </div>
      </div>
      
      <div className="quick-actions">
        <button className="quick-action-btn" title="Sök">
          <Search size={20} strokeWidth={1.5} />
        </button>
        <button className="quick-action-btn" title="Inställningar">
          <Settings size={20} strokeWidth={1.5} />
        </button>
        <button className="quick-action-btn notification-btn" title="Notifikationer">
          <Bell size={20} strokeWidth={1.5} />
          <span className="notification-badge">3</span>
        </button>
      </div>
    </div>
  );
}