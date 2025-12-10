import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Send, Trash2, Archive, CheckCircle, Smartphone, User, Phone, XCircle } from 'lucide-react';
import SidePanel from '../components/ui/SidePanel'; // Justera sökvägen om du sparade filen nån annanstans
import Modal from '../components/ui/Modal';         // Justera sökvägen om du sparade filen nån annanstans

// ----------------------------------------------------------------
// 1. FORMULÄR: SKAPA ÄRENDE (PREMIUM STYLE)
// ----------------------------------------------------------------
const CreateRepairForm = ({ onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({ deviceName: '', customerName: '', customerPhone: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="deviceName">Enhet & Modell</label>
        <div style={{ position: 'relative' }}>
            <input 
              className="form-input" 
              id="deviceName" 
              type="text" 
              value={formData.deviceName} 
              onChange={handleChange} 
              required 
              placeholder="T.ex. iPhone 15 Pro" 
            />
            <Smartphone size={18} style={{ position: 'absolute', right: 12, top: 14, color: '#9ca3af' }} />
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="customerName">Kundens Namn</label>
        <div style={{ position: 'relative' }}>
            <input 
              className="form-input" 
              id="customerName" 
              type="text" 
              value={formData.customerName} 
              onChange={handleChange} 
              required 
              placeholder="För- och efternamn" 
            />
            <User size={18} style={{ position: 'absolute', right: 12, top: 14, color: '#9ca3af' }} />
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="customerPhone">Mobilnummer</label>
        <div style={{ position: 'relative' }}>
            <input 
              className="form-input" 
              id="customerPhone" 
              type="tel" 
              value={formData.customerPhone} 
              onChange={handleChange} 
              required 
              placeholder="070..." 
            />
            <Phone size={18} style={{ position: 'absolute', right: 12, top: 14, color: '#9ca3af' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
        <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost">Avbryt</button>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={isLoading}>
          {isLoading ? 'Bearbetar...' : 'Skapa Ärende'}
        </button>
      </div>
    </form>
  );
};

// ----------------------------------------------------------------
// 2. FORMULÄR: UPPDATERA STATUS (PREMIUM STYLE)
// ----------------------------------------------------------------
const UpdateStatusForm = ({ repair, onStatusUpdated }) => {
    const [newStatus, setNewStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { token } = useAuth();

    const handleSubmit = async (e, customStatus = null, sendSms = false) => {
        if (e) e.preventDefault();
        
        const statusToSend = customStatus || newStatus;
        if (!statusToSend.trim() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const isFinalizing = statusToSend === 'Enhet hämtad av kund.';
            
            // API Anrop
            const updateResponse = await fetch('/.netlify/functions/updateRepairStatus', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    repairId: repair.id,
                    newStatus: statusToSend,
                    isFinalizing: isFinalizing
                }),
            });

            if (!updateResponse.ok) throw new Error((await updateResponse.json()).message);
            const updatedStatusEntry = await updateResponse.json();
            
            if (sendSms) {
                const smsMessage = `Hej ${repair.customer_name}, status för din ${repair.device_name}: "${statusToSend}". /Teknikhuset`;
                await fetch('/.netlify/functions/sendSms', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ repairId: repair.id, message: smsMessage })
                });
                alert('Status sparad och SMS skickat!');
            }

            onStatusUpdated(updatedStatusEntry, isFinalizing);
            setNewStatus(''); 

        } catch (error) {
            alert(`Fel: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ marginTop: '24px', background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--admin-secondary)' }}>Ny Statusuppdatering</h4>
            
            <div className="form-group">
                <input 
                    className="form-input"
                    type="text"
                    placeholder="Skriv status (t.ex. 'Väntar på reservdel')..."
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <button 
                    onClick={(e) => handleSubmit(e, null, false)} 
                    className="admin-btn admin-btn-secondary" 
                    disabled={isSubmitting || !newStatus.trim()}
                >
                    Endast Spara
                </button>
                <button 
                    onClick={(e) => handleSubmit(e, null, true)} 
                    className="admin-btn admin-btn-primary" 
                    disabled={isSubmitting || !newStatus.trim()}
                >
                    <Send size={16} /> Spara & SMS
                </button>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', margin: '16px 0' }}></div>

            <button 
                type="button" 
                onClick={(e) => handleSubmit(e, 'Enhet hämtad av kund.', false)}
                disabled={isSubmitting}
                className="admin-btn"
                style={{ width: '100%', backgroundColor: '#10b981', color: 'white' }}
            >
                <CheckCircle size={18} /> Markera som Hämtad & Avslutad
            </button>
        </div>
    );
};

// ----------------------------------------------------------------
// 3. DETALJPANEL (DASHBOARD KORT-STIL)
// ----------------------------------------------------------------
const RepairDetailsPanel = ({ repair, onStatusUpdated, onSendFollowUp }) => {
  if (!repair) return <p>Laddar...</p>;

  return (
    <div>
      {/* Informationskort */}
      <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--admin-secondary)', fontSize: '1.4em' }}>{repair.device_name}</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.95em' }}>
            <div>
                <span style={{ display: 'block', color: '#64748b', fontSize: '0.8em', fontWeight: 700, textTransform: 'uppercase' }}>Kund</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>{repair.customer_name}</span>
            </div>
            <div>
                <span style={{ display: 'block', color: '#64748b', fontSize: '0.8em', fontWeight: 700, textTransform: 'uppercase' }}>Telefon</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>{repair.customer_phone || '-'}</span>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
                 <span style={{ display: 'block', color: '#64748b', fontSize: '0.8em', fontWeight: 700, textTransform: 'uppercase' }}>Ärendekod</span>
                 <code style={{ background: '#fff', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'var(--admin-primary-dark)', fontSize: '1.1em' }}>{repair.repair_code}</code>
            </div>
        </div>
      </div>
      
      {/* Status Hantering */}
      {repair.status === 'active' && (
        <UpdateStatusForm repair={repair} onStatusUpdated={onStatusUpdated} />
      )}

      {/* Avslutad Hantering */}
      {repair.status === 'completed' && (
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ color: 'var(--admin-secondary)' }}>Avslutande Åtgärder</h4>
          <div style={{ background: '#dcfce7', padding: '16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <CheckCircle size={20} color="#166534" />
             <div>
                <strong style={{ color: '#166534' }}>Utlämnad till kund</strong><br/>
                <small style={{ color: '#166534' }}>
                  {repair.picked_up_at?._seconds 
                      ? new Date(repair.picked_up_at._seconds * 1000).toLocaleString('sv-SE') 
                      : 'Datum saknas'}
                </small>
             </div>
          </div>

          {!repair.follow_up_sent ? (
            <button onClick={() => onSendFollowUp(repair.id)} className="admin-btn admin-btn-primary" style={{ width: '100%' }}>
              <Send size={18} /> Skicka Uppföljning & Arkivera
            </button>
          ) : (
             <div style={{ textAlign: 'center', padding: '10px', color: '#166534', fontWeight: 600 }}>
                ✅ Uppföljnings-SMS skickat.
             </div>
          )}
        </div>
      )}
      
      {/* Arkiverad Info */}
      {(repair.status === 'archived' || repair.status === 'finished') && (
          <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '10px', border: '1px solid #e5e7eb', textAlign: 'center', color: '#6b7280' }}>
              <Archive size={20} style={{ marginBottom: '8px', display: 'block', margin: '0 auto' }}/> 
              <strong>Arkiverad</strong><br/>Detta ärende är stängt.
          </div>
      )}
      
      {/* Tidslinje Historik */}
      <div style={{ marginTop: '32px' }}>
          <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px' }}>Historik</h4>
          <ul style={{ listStyle: 'none', padding: 0, position: 'relative' }}>
            {/* Vertikal linje */}
            <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
            
            {repair.status_history && repair.status_history.length > 0 ? (
                repair.status_history
                  .sort((a,b) => (b.timestamp?._seconds || 0) - (a.timestamp?._seconds || 0))
                  .map((update, index) => (
                  <li key={index} style={{ marginBottom: '24px', paddingLeft: '32px', position: 'relative' }}>
                    {/* Prick */}
                    <div style={{ 
                        width: '16px', height: '16px', borderRadius: '50%', 
                        background: index === 0 ? 'var(--admin-primary)' : '#cbd5e1', 
                        position: 'absolute', left: 0, top: '4px', border: '3px solid #fff', zIndex: 1, 
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
                    }}></div>
                    
                    <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: '#1e293b' }}>{update.status}</p>
                    <small style={{ color: '#94a3b8', fontSize: '0.85em' }}>
                      {update.timestamp?._seconds 
                          ? new Date(update.timestamp._seconds * 1000).toLocaleString('sv-SE') 
                          : 'Okänt datum'}
                    </small>
                  </li>
                ))
            ) : <li style={{ paddingLeft: '32px', color: '#94a3b8' }}>Ingen historik.</li>}
          </ul>
      </div>
    </div>
  );
};


// ----------------------------------------------------------------
// 4. HUVUDKOMPONENT: ADMIN REPARATIONER
// ----------------------------------------------------------------
const AdminReparationer = () => {
  const [repairs, setRepairs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('active'); // 'active' eller 'finished'
  const { token } = useAuth();
  
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // --- DATAHÄMTNING ---
  const fetchRepairs = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    setSelectedRows([]);
    try {
      const response = await fetch(`/.netlify/functions/getRepairs?status=${view}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error((await response.json()).message);
      setRepairs(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [view, token]);

  useEffect(() => { fetchRepairs(); }, [fetchRepairs]);
  
  // --- HANDLERS ---
  const handleCreateRepair = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/createRepair', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error((await response.json()).message);
      const newRepair = await response.json();
      
      if (view === 'active') setRepairs(prev => [newRepair, ...prev]);
      alert(`Ärendet har skapats!\nKod: ${newRepair.repair_code}`);
      setIsCreateModalOpen(false);
    } catch (err) {
      alert(`Fel: ${err.message}`); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManageClick = (repair) => {
    setSelectedRepair(repair);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    // Vänta på animation innan vi nollställer datan
    setTimeout(() => setSelectedRepair(null), 300); 
  };

  const handleStatusUpdated = (newStatusEntry, isFinalizing) => {
    if (isFinalizing) {
        setRepairs(prev => prev.filter(r => r.id !== selectedRepair.id));
        handleClosePanel();
    } else {
        const updatedHistory = [newStatusEntry, ...(selectedRepair.status_history || [])];
        setSelectedRepair(prev => ({ ...prev, status_history: updatedHistory }));
        setRepairs(prev => prev.map(r => r.id === selectedRepair.id ? { ...r, status_history: updatedHistory } : r));
    }
  };

  const handleSendFollowUp = async (repairId) => {
    if (!window.confirm("Är du säker på att du vill skicka uppföljnings-SMS och arkivera ärendet?")) return;
    try {
        const response = await fetch('/.netlify/functions/sendManualFollowUp', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ repairId }),
        });
        if (!response.ok) throw new Error((await response.json()).message);
        
        alert('Uppföljning skickad och ärendet har arkiverats!');
        setRepairs(prev => prev.map(r => r.id === repairId ? { ...r, status: 'archived', follow_up_sent: true } : r));
        setSelectedRepair(prev => ({ ...prev, status: 'archived', follow_up_sent: true }));
    } catch (err) {
        alert(`Fel: ${err.message}`);
    }
  };
  
  const handleDeleteSelected = async () => {
    if (!window.confirm(`Är du säker på att du vill radera ${selectedRows.length} ärende(n) permanent?`)) return;
    try {
      const response = await fetch('/.netlify/functions/deleteRepairs', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ repairIds: selectedRows }),
      });
      if (!response.ok) throw new Error((await response.json()).message);
      setRepairs(prev => prev.filter(r => !selectedRows.includes(r.id)));
      setSelectedRows([]);
    } catch (err) {
      alert(`Fel vid radering: ${err.message}`);
    }
  };

  const handleSelectRow = (e, repairId) => {
    if (e.target.checked) {
      setSelectedRows(prev => [...prev, repairId]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== repairId));
    }
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(repairs.map(r => r.id));
    } else {
      setSelectedRows([]);
    }
  };

  // --- RENDER ---
  return (
    <>
      <div className="admin-page-header">
        {/* VIEW SWITCHER (FIXADE FLIKAR) */}
        <div className="view-switcher">
          <button 
            onClick={() => setView('active')} 
            className={`view-switcher-btn ${view === 'active' ? 'active' : ''}`}
          >
            Pågående
          </button>
          <button 
            onClick={() => setView('finished')} 
            className={`view-switcher-btn ${view === 'finished' ? 'active' : ''}`}
          >
            Avslutade
          </button>
        </div>
        
        {/* ACTIONS (FIXADE KNAPPAR) */}
        <div className="btn-group">
          {selectedRows.length > 0 && (
            <>
              <button onClick={() => alert("Arkivering kommer snart")} className="admin-btn admin-btn-secondary">
                <Archive size={18} /> Arkivera ({selectedRows.length})
              </button>
              <button onClick={handleDeleteSelected} className="admin-btn admin-btn-danger">
                <Trash2 size={18} /> Radera ({selectedRows.length})
              </button>
            </>
          )}
          <button className="admin-btn admin-btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            <PlusCircle size={20} /> Skapa Nytt Ärende
          </button>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="checkbox-cell">
                  <input 
                      type="checkbox" 
                      onChange={handleSelectAll} 
                      checked={repairs.length > 0 && selectedRows.length === repairs.length}
                  />
              </th>
              <th>Enhet</th>
              <th>Kund</th>
              <th>Ärendekod</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Laddar...</td></tr>}
            {error && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</td></tr>}
            {!isLoading && !error && repairs.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Inga ärenden hittades i denna vy.</td></tr>
            )}
            
            {!isLoading && !error && repairs.map(repair => (
              <tr key={repair.id} onClick={() => handleManageClick(repair)}>
                <td onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={selectedRows.includes(repair.id)} onChange={(e) => handleSelectRow(e, repair.id)} />
                </td>
                <td><strong>{repair.device_name}</strong></td>
                <td>{repair.customer_name}</td>
                <td><code>{repair.repair_code}</code></td>
                <td>
                    <span style={{ 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.85em', 
                        fontWeight: 700,
                        // LOGIK FÖR FÄRGERNA HÄR:
                        backgroundColor: repair.status === 'archived' ? '#14532d' : (repair.status === 'completed' ? '#dcfce7' : '#e0f2fe'),
                        color: repair.status === 'archived' ? '#ffffff' : (repair.status === 'completed' ? '#166534' : '#0369a1')
                    }}>
                        {repair.status === 'completed' ? 'Klar' : 
                        (repair.status === 'archived' || repair.status === 'finished') ? 'Arkiverad' : 'Pågående'}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* COMPONENT INJECTIONS */}
      <SidePanel isOpen={isPanelOpen} onClose={handleClosePanel} title={selectedRepair ? `Ärende: ${selectedRepair.repair_code}` : 'Ärendedetaljer'}>
        {selectedRepair && (
          <RepairDetailsPanel
            repair={selectedRepair}
            onStatusUpdated={handleStatusUpdated}
            onSendFollowUp={handleSendFollowUp}
          />
        )}
      </SidePanel>
      
      <Modal isOpen={isCreateModalOpen} onClose={() => !isSubmitting && setIsCreateModalOpen(false)} title="Skapa Nytt Ärende">
         <CreateRepairForm onSubmit={handleCreateRepair} onCancel={() => setIsCreateModalOpen(false)} isLoading={isSubmitting} />
      </Modal>
    </>
  );
};

export default AdminReparationer;