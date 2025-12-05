import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  Wrench, 
  Package, 
  QrCode, 
  ChevronLeft, 
  ChevronRight,
  Globe,
  LogOut,
  Shield
} from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', label: 'Översikt', icon: LayoutGrid, path: '/admin/dashboard' },
  { id: 'tickets', label: 'Ärenden', icon: Wrench, path: '/admin/reparationer' },
  { id: 'storage', label: 'Lager', icon: Package, path: '/admin/lager' },
  { id: 'scan', label: 'Skanna', icon: QrCode, path: '/admin/skanna' },
];

export default function Sidebar({ sidebarCollapsed, setSidebarCollapsed, mobileMenuOpen, setMobileMenuOpen }) {
  
  const handleNavLinkClick = () => {
    // Stäng mobilmenyn när en länk klickas
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      {/* Desktop Header */}
      <div className="sidebar-header-wrapper">
        {!sidebarCollapsed && (
          <div className="sidebar-header">
            <Shield size={24} className="admin-icon" />
            <span>Admin</span>
          </div>
        )}
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Expandera meny' : 'Komprimera meny'}
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="admin-nav">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => 
                isActive ? 'admin-nav-item active' : 'admin-nav-item'
              }
              title={item.label}
              onClick={handleNavLinkClick}
            >
              <Icon size={22} className="nav-icon" strokeWidth={1.5} />
              {!sidebarCollapsed && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <a
          href="/"
          className="sidebar-site-link"
          target="_blank"
          rel="noopener noreferrer"
          title="Öppna kundsidan"
        >
          <Globe size={20} strokeWidth={1.5} />
          {!sidebarCollapsed && <span>Till webbplatsen</span>}
        </a>
        <button className="logout-btn" title="Logga ut">
          <LogOut size={20} strokeWidth={1.5} />
          {!sidebarCollapsed && <span>Logga ut</span>}
        </button>
      </div>
    </aside>
  );
}