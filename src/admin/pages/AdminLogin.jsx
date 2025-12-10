import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/adminLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Något gick fel.');
      
      auth.login(data.token);
      navigate('/admin/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-view" style={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
      <div className="login-container">
        <h1>Personalportal</h1>
        <p className="login-intro">Logga in för att hantera ärenden och lager.</p>
        <form onSubmit={handleLogin}>
          {/* Använder den nya formulärstrukturen */}
          <div className="form-group">
            <input 
              type="text" 
              className="form-input"
              placeholder="Användarnamn" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              className="form-input"
              placeholder="Lösenord" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          {error && <p style={{ color: '#ef4444', margin: '10px 0 0 0' }}>{error}</p>}
          
          {/* Använder de nya knapp-klasserna */}
          <button 
            type="submit" 
            className="admin-btn admin-btn-primary login-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;