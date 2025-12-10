import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase'; // Kontrollera att sökvägen till firebase stämmer
import { 
  ArrowLeft, 
  Save, 
  Globe, 
  Image as ImageIcon, 
  Tag, // Använder Tag istället för LayoutTag för att undvika krasch
  Calendar, 
  User,
  Info
} from 'lucide-react';
import '../Admin.css';

const AdminBlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'Allmänt',
    imageUrl: '', 
    author: 'Teknikhuset Kalmar', 
    date: new Date().toISOString().split('T')[0]
  });

  // HÄMTA DATA (Säker överskrivning av state)
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const docRef = doc(db, "blogPosts", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Vi använder funktionell state-uppdatering för säkerhet
            setFormData(prev => ({
              ...prev,
              ...data 
            }));
          }
        } catch (error) {
          console.error("Kunde inte hämta inlägg:", error);
        } finally {
          setFetching(false);
        }
      };
      fetchPost();
    }
  }, [id]);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[åä]/g, 'a')
      .replace(/[ö]/g, 'o')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    if (!id) {
      setFormData(prev => ({ ...prev, title, slug: generateSlug(title) }));
    } else {
      setFormData(prev => ({ ...prev, title }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        action: id ? 'update' : 'create',
        id: id || null,
        postData: formData
      };

      const response = await fetch('/.netlify/functions/manageBlog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Något gick fel vid sparning');
      }

      navigate('/admin/blog');
      
    } catch (error) {
      console.error("Error saving post:", error);
      alert(`Fel: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'clean']
    ],
  };

  if (fetching) {
    return <div className="admin-page" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Hämtar inlägg...</div>;
  }

  return (
    <div className="admin-page">
      <form onSubmit={handleSave}>
        
        {/* --- HEADER --- */}
        <div className="admin-page-header" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              type="button" 
              onClick={() => navigate('/admin/blog')} 
              className="admin-btn admin-btn-secondary"
              style={{ padding: '8px 12px' }}
            >
               <ArrowLeft size={20} />
            </button>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--admin-secondary)' }}>
              {id ? 'Redigera Inlägg' : 'Skapa Nytt Inlägg'}
            </h2>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
            <Save size={18} />
            {loading ? 'Publicerar...' : 'Publicera Inlägg'}
          </button>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px',
          alignItems: 'start' 
        }}>
          
          {/* --- VÄNSTER KOLUMN --- */}
          <div style={{ flex: 2, minWidth: '60%' }}>
            
            <div className="admin-table-wrapper" style={{ padding: '24px', background: '#fff', marginBottom: '24px' }}>
              <div className="form-group">
                <label className="form-label">Rubrik</label>
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={handleTitleChange} 
                  required 
                  className="form-input"
                  style={{ fontSize: '1.2em', fontWeight: 'bold' }}
                  placeholder="Skriv en fångande rubrik..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sammanfattning (Ingress)</label>
                <textarea 
                  value={formData.summary || ''} 
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  rows="3"
                  className="form-input"
                  placeholder="Kort text som syns i listan och på Google..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Innehåll</label>
                <div style={{ background: '#fff' }}>
                  <ReactQuill 
                    theme="snow" 
                    value={formData.content || ''} 
                    onChange={(content) => setFormData({...formData, content})} 
                    modules={modules}
                    style={{ height: '400px', marginBottom: '50px' }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- HÖGER KOLUMN --- */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div className="admin-table-wrapper" style={{ padding: '24px', background: '#fff' }}>
              <h4 style={{ margin: '0 0 16px 0', color: 'var(--admin-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={18} /> Inställningar
              </h4>

              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select 
                  value={formData.category || 'Allmänt'} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="form-input"
                >
                  <option value="Allmänt">Allmänt</option>
                  <option value="Guider">Guider</option>
                  <option value="Nyheter">Nyheter</option>
                  <option value="Tips & Tricks">Tips & Tricks</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">URL-slug</label>
                <div style={{ position: 'relative' }}>
                  <Globe size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    value={formData.slug || ''} 
                    onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                    required 
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
              </div>

               <div className="form-group">
                <label className="form-label">Författare</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    value={formData.author || 'Teknikhuset Kalmar'} 
                    onChange={(e) => setFormData({...formData, author: e.target.value})} 
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
              </div>

               <div className="form-group">
                <label className="form-label">Datum</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                  <input 
                    type="date" 
                    value={formData.date || new Date().toISOString().split('T')[0]} 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
              </div>
            </div>

            {/* BILD-WIDGET */}
            <div className="admin-table-wrapper" style={{ padding: '24px', background: '#fff' }}>
              <h4 style={{ margin: '0 0 16px 0', color: 'var(--admin-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={18} /> Omslagsbild
              </h4>
              
              {/* Varning/Info om bilder */}
              <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '8px', fontSize: '0.85em', color: '#0369a1', marginBottom: '16px', display: 'flex', gap: '8px' }}>
                <Info size={32} style={{ flexShrink: 0 }} />
                <div>
                  <strong>OBS:</strong> Google Drive-länkar fungerar inte. Använd en direktlänk till en bild (ska sluta på .jpg/.png).
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Bild-URL</label>
                <input 
                  type="text" 
                  value={formData.imageUrl || ''} 
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://exempel.se/bild.jpg"
                  className="form-input"
                />
              </div>

              <div style={{ 
                height: '150px', 
                background: '#f1f5f9', 
                borderRadius: '8px', 
                border: '1px dashed #cbd5e1',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                overflow: 'hidden',
                marginTop: '12px'
              }}>
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                       onError={(e) => e.target.style.display = 'none'} />
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '0.9em' }}>Ingen bild vald</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogEditor;