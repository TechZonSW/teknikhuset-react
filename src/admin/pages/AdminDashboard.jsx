import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-page">
      <div className="admin-page-header">
        <h1>Översikt</h1>
      </div>
      <div className="admin-page-content">
        <p>Välkommen till adminpanelen. Här kommer snart en sammanfattning av pågående ärenden och lagerstatus att visas.</p>
        {/* Här kan vi bygga vidare med statistik-kort etc. */}
      </div>
    </div>
  );
};

export default AdminDashboard;