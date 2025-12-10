import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { PlusCircle, Trash2, Image as ImageIcon } from 'lucide-react';
import '../Admin.css';

const AdminBlog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Alla'); 
  const [selectedRows, setSelectedRows] = useState([]); 

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "blogPosts"));
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      postsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    if (filter === 'Alla') return posts;
    return posts.filter(post => post.category === filter); // Exakt matchning för att undvika fel
  }, [posts, filter]);

  const handleSelectRow = (e, id) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredPosts.map(p => p.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/admin/blog/redigera/${id}`);
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Är du säker på att du vill radera ${selectedRows.length} inlägg permanent?`)) return;
    
    try {
      await Promise.all(selectedRows.map(id => 
        fetch('/.netlify/functions/manageBlog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id: id })
        })
      ));

      setPosts(prev => prev.filter(p => !selectedRows.includes(p.id)));
      setSelectedRows([]);
      
    } catch (error) {
      console.error("Error deleting posts:", error);
      alert("Ett fel uppstod vid radering.");
    }
  };

  const getBadgeClass = (category) => {
    const catLower = category?.toLowerCase() || '';
    if (catLower.includes('guide')) return 'badge-guider';
    if (catLower.includes('nyhet')) return 'badge-nyheter';
    if (catLower.includes('tips')) return 'badge-tips';
    return 'badge-allmant'; // Default (Allmänt)
  };

  // HÄR ÄR LISTAN DU VILLE UPPDATERA:
  const categories = ['Alla', 'Allmänt', 'Guider', 'Nyheter', 'Tips & Tricks'];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="view-switcher">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => { setFilter(cat); setSelectedRows([]); }} 
              className={`view-switcher-btn ${filter === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="btn-group">
          {selectedRows.length > 0 && (
            <button onClick={handleDeleteSelected} className="admin-btn admin-btn-danger">
              <Trash2 size={18} /> Radera ({selectedRows.length})
            </button>
          )}
          <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/blog/ny')}>
            <PlusCircle size={20} /> Skapa Nytt Inlägg
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
                  checked={filteredPosts.length > 0 && selectedRows.length === filteredPosts.length && filteredPosts.length > 0}
                />
              </th>
              <th>Bild</th>
              <th>Rubrik</th>
              <th>Kategori</th>
              <th>Datum</th>
              <th>Författare</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Laddar inlägg...</td></tr>
            )}
            
            {!loading && filteredPosts.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Inga inlägg hittades.</td></tr>
            )}

            {!loading && filteredPosts.map((post) => (
              <tr key={post.id} onClick={() => handleRowClick(post.id)}>
                <td className="checkbox-cell" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    checked={selectedRows.includes(post.id)} 
                    onChange={(e) => handleSelectRow(e, post.id)} 
                  />
                </td>
                
                <td style={{ width: '60px' }}>
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt="" className="table-thumb" />
                  ) : (
                    <div className="table-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImageIcon size={18} color="#cbd5e1" />
                    </div>
                  )}
                </td>

                <td>
                  <strong style={{ fontSize: '0.95em', color: 'var(--admin-secondary)' }}>
                    {post.title}
                  </strong>
                </td>

                <td>
                  <span className={`category-badge ${getBadgeClass(post.category)}`}>
                    {post.category || 'Saknas'}
                  </span>
                </td>

                <td style={{ color: 'var(--admin-text-secondary)', fontSize: '0.9em' }}>
                  {post.date}
                </td>

                <td style={{ fontSize: '0.9em' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                      {post.author ? post.author.charAt(0) : 'A'}
                    </div>
                    {post.author}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBlog;