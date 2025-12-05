import React from 'react';

const AdminLager = () => {
  return (
    <div className="admin-dashboard-page">
      <div className="admin-page-header">
        <h1>Översikt</h1>
      </div>
      <div className="admin-page-content">
        <p>Välkommen till adminpanelen. LAGER</p>
        {/* Här kan vi bygga vidare med statistik-kort etc. */}
      </div>
    </div>
  );
};

export default AdminLager;