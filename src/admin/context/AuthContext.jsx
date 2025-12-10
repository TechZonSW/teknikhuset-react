import React, { createContext, useContext, useState, useEffect } from 'react';

// Skapa en Context med null som defaultvärde
const AuthContext = createContext(null);

// Detta är komponenten som kommer att "hålla" inloggningsstatusen
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // För att hantera den initiala laddningen

  // Denna effekt körs EN GÅNG när appen startar
  // Den kollar om en token redan finns sparad från ett tidigare besök
  useEffect(() => {
    const storedToken = localStorage.getItem('admin_jwt_token');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false); // Vi är klara med den initiala kollen
  }, []);

  // Funktion för att logga in
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('admin_jwt_token', newToken);
  };

  // Funktion för att logga ut
  const logout = () => {
    setToken(null);
    localStorage.removeItem('admin_jwt_token');
  };

  // Värdet som alla barnkomponenter kommer att kunna komma åt
  const value = { token, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Detta är en "custom hook" som gör det enkelt för oss att använda kontexten
export const useAuth = () => {
  return useContext(AuthContext);
};