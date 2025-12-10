import React, { useState } from 'react';
import './Spara.css'; // Importera vår nya CSS

const Spara = () => {
  const [repairCode, setRepairCode] = useState('');
  const [repairData, setRepairData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRepairData(null);

    try {
      const response = await fetch(`/.netlify/functions/getRepairStatus?code=${repairCode}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Något gick fel.');
      }
      
      setRepairData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="spara-page-wrapper">
      <div className="spara-container">
        <div className="spara-header">
          <h1>Spåra din reparation live</h1>
          <p>Ange din unika reparationskod från ditt SMS för att se status i realtid.</p>
        </div>
        
        <div className="tracking-form-container">
          <form className="tracking-form" onSubmit={handleSearch}>
            <input 
              type="text"
              className="tracking-input"
              placeholder="Ex: ABC123"
              value={repairCode}
              onChange={(e) => setRepairCode(e.target.value)}
              required 
            />
            <button type="submit" className="cta-button tracking-button" disabled={isLoading}>
              {isLoading ? 'Söker...' : 'Spåra'}
            </button>
          </form>
        </div>
        
        {/* --- Här visas resultatet --- */}
        {isLoading && (
          <div className="status-result-container loading">
            <p>Hämtar status för ditt ärende...</p>
          </div>
        )}
        
        {error && (
          <div className="status-result-container error">
            <p>{error}</p>
          </div>
        )}
        
        {repairData && (
          <div className="status-result-container">
            <div className="status-header">
              <h2>Status för: {repairData.device_name}</h2>
            </div>
            <ul className="status-timeline">
              {repairData.status_history
                .sort((a, b) => (b.timestamp?._seconds || 0) - (a.timestamp?._seconds || 0))
                .map((update, index) => (
                  <li key={index} className="timeline-item">
                    <div className="timeline-item-content">
                      <p><strong>{update.status}</strong></p>
                      <small>
                        {update.timestamp?._seconds
                          ? new Date(update.timestamp._seconds * 1000).toLocaleString('sv-SE', {
                              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })
                          : 'Okänt datum'}
                      </small>
                    </div>
                  </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Spara;