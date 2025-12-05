import React from 'react';

const AdminLogin = () => {
  return (
    <div className="admin-login-view">
      <div className="login-container">
        <h1>Personalportal</h1>
        <p className="login-intro">Logga in för att hantera ärenden och lager.</p>
        <form>
          <input type="text" placeholder="Användarnamn" required />
          <input type="password" placeholder="Lösenord" required />
          <button type="submit" className="login-button">Logga in</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;