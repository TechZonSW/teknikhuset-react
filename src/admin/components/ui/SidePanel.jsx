import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function SidePanel({ title, isOpen, onClose, children }) {
  // Förhindra scroll på bakgrunden
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      <div 
        className={`side-panel-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <div className={`side-panel ${isOpen ? 'open' : ''}`}>
        <div className="side-panel-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="close-btn" title="Stäng">
            <X size={24} />
          </button>
        </div>
        <div className="side-panel-content">
          {children}
        </div>
      </div>
    </>
  );
}