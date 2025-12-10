import React from 'react';
import { CheckCircle, Send, Archive } from 'lucide-react';
import UpdateStatusForm from './UpdateStatusForm'; // Förutsätter att du flyttar ut denna också

const RepairDetailsPanel = ({ repair, onStatusUpdated, onSendFollowUp }) => {
  return (
    <div>
      <h3>{repair.device_name}</h3>
      <p><strong>Kund:</strong> {repair.customer_name}</p>
      <p><strong>Telefon:</strong> {repair.customer_phone || 'Ej angivet'}</p>
      
      <hr style={{ margin: '24px 0' }}/>
      
      {repair.status === 'active' && <UpdateStatusForm repair={repair} onStatusUpdated={onStatusUpdated} />}
      
      {repair.status === 'completed' && (
        <div style={{ marginTop: '12px' }}>
          <h4>Tidslinje & Åtgärder</h4>
          {/* ... tidslinjen och knappen för manuell uppföljning ... */}
        </div>
      )}

      {repair.status === 'archived' && (
        <div style={{ background: '#f8f9fa', padding: '14px', borderRadius: '8px' }}>
          <p><strong><Archive size={16} /> Arkiverad:</strong> Ärendet är arkiverat.</p>
        </div>
      )}
      
      <hr style={{ margin: '24px 0' }}/>
      <h4>Statushistorik:</h4>
      {/* ... logiken för att rendera statushistoriken ... */}
    </div>
  );
};

export default RepairDetailsPanel;