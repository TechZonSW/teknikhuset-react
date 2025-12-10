import React, { useEffect, useState, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Helmet } from 'react-helmet-async';
import { MagnifyingGlass } from 'phosphor-react';
import BlogCard from '../components/blog/BlogCard';
import '../components/blog/Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State för Sök och Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alla');

  const categories = ['Alla', 'Allmänt', 'Guider', 'Nyheter', 'Tips & Tricks'];

  // Hämta inlägg
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogPosts"));
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sortera nyast först
        postsData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(postsData);
      } catch (error) {
        console.error("Error loading blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Filtreringslogik
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // 1. Matcha kategori
      const matchesCategory = selectedCategory === 'Alla' || post.category === selectedCategory;
      
      // 2. Matcha sökord (i titel eller sammanfattning)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        post.title?.toLowerCase().includes(searchLower) || 
        post.summary?.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [posts, searchTerm, selectedCategory]);

  return (
    <>
      <Helmet>
        <title>Teknikbloggen | Teknikhuset Kalmar</title>
        <meta name="description" content="Läs guider, nyheter och tips om mobilreparationer och teknik." />
      </Helmet>

      {/* --- HERO SECTION --- */}
      <section className="blog-hero">
        <div className="blog-hero__background">
          <img src="/bilder/hero-blog.png" alt="Teknikbloggen Bakgrund" onError={(e) => e.target.style.backgroundColor = '#0a0e27'} />
        </div>
        <div className="blog-hero__content">
          <h1>Teknikbloggen</h1>
          <p>Experttips, guider och det senaste från verkstaden.</p>
        </div>
      </section>

      {/* --- CONTROL BAR (Sök & Filter) --- */}
      <section className="blog-controls-section">
        <div className="blog-controls-wrapper">
          
          {/* Sökfält */}
          <div className="blog-search-container">
            <MagnifyingGlass className="blog-search-icon" weight="bold" />
            <input 
              type="text" 
              placeholder="Vad letar du efter? T.ex. 'Skärmbyte iPhone'..." 
              className="blog-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Taggar */}
          <div className="blog-filter-tags">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-tag ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* --- POST GRID --- */}
      <div className="blog-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
            <p style={{ fontSize: '1.1em' }}>Laddar artiklar...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="blog-grid">
            {filteredPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h3 style={{ color: '#0a0e27', marginBottom: '10px', fontSize: '1.5em' }}>Inga resultat hittades.</h3>
            <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '1em' }}>Försök med ett annat sökord eller kategori.</p>
            <button 
              className="filter-tag" 
              style={{ 
                marginTop: '20px', 
                background: '#d4af37', 
                color: '#fff', 
                border: 'none',
                padding: '12px 28px',
                fontSize: '1em',
                cursor: 'pointer'
              }}
              onClick={() => { setSearchTerm(''); setSelectedCategory('Alla'); }}
            >
              Visa alla inlägg
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;