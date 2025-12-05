import React from 'react';
import './Spara.css';

const Spara = () => {
  return (
    <div className="container" style={{ padding: '100px 0', minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3em', marginBottom: '20px', fontWeight: 800 }}>Spåra din Reparation</h1>
        <p style={{ fontSize: '1.1em', color: '#6b7280', lineHeight: '1.8', maxWidth: '600px' }}>
          Denna sida är under uppbyggnad. Vi utvecklar just nu ett avancerat spårningssystem för dina reparationer.
        </p>
      </div>
    </div>
  );
};

export default Spara;