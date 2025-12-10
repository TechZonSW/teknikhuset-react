import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowLeft, ShareNetwork } from 'phosphor-react';
import '../components/blog/Blog.css';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const q = query(collection(db, "blogPosts"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setPost(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  // --- FULLT FIXAD DELNINGSFUNKTION ---
  const handleShare = async () => {
    const shareData = {
      title: post.title || "Artikel",
      text: post.summary || post.title || "",
      url: window.location.href
    };

    // Steg 1: Native Share (iPhone/Android)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.log("Native share misslyckades:", err);
      }
    }

    // Steg 2: Clipboard (Desktop + Android)
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch (err) {
      console.log("Clipboard API misslyckades:", err);
    }

    // Steg 3: Fallback som även fungerar på iPhone Safari
    try {
      const tempInput = document.createElement("input");
      tempInput.value = window.location.href;
      tempInput.style.position = "fixed";
      tempInput.style.opacity = 0;
      document.body.appendChild(tempInput);

      tempInput.select();
      tempInput.setSelectionRange(0, 99999);

      const ok = document.execCommand("copy");
      document.body.removeChild(tempInput);

      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch (error) {
      console.log("Fallback kopiering misslyckades:", error);
    }

    // Steg 4: Sista utväg
    alert("Kunde inte dela automatiskt. Kopiera länken:\n" + window.location.href);
  };
  // -----------------------------------

  if (loading) {
    return (
      <div style={{ paddingTop: '150px', textAlign: 'center', color: '#64748b' }}>
        <p>Laddar artikel...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ paddingTop: '150px', textAlign: 'center' }}>
        <h1 style={{ color: '#0a0e27', marginBottom: '20px' }}>Artikel hittades inte.</h1>
        <Link to="/blog" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600 }}>
          ← Gå tillbaka till bloggen
        </Link>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | Teknikhuset Kalmar</title>
        <meta name="description" content={post.summary || post.title} />
      </Helmet>

      <div className="article-premium-page">
        
        {/* --- HERO TITLE SECTION --- */}
        <section className="article-hero-title">
          <div className="article-hero-title-wrapper">
            <nav className="article-nav">
              <Link to="/blog" className="back-link">
                <ArrowLeft size={20} weight="bold" />
              </Link>
            </nav>

            <h1 className="article-title">{post.title}</h1>
          </div>
        </section>

        {/* --- CONTENT SECTION --- */}
        <div className="article-paper">
          
          {/* --- LEAD/SUMMARY --- */}
          {post.summary && (
            <section className="article-lead-section">
              <p className="article-lead">{post.summary}</p>
            </section>
          )}

          {/* --- MAIN CONTENT --- */}
          <article className="article-content">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

        </div>

        {/* --- FOOTER --- */}
        <footer className="article-footer">
          <div className="article-footer-meta">
            <div className="meta-item">
              <User size={16} weight="bold" />
              <span>Av <strong>{post.author || 'Teknikhuset Kalmar'}</strong></span>
            </div>
            <div className="meta-item">
              <Calendar size={16} weight="bold" />
              <span><strong>{formatDate(post.date)}</strong></span>
            </div>
          </div>

          <button className="share-btn" onClick={handleShare}>
            <ShareNetwork size={18} weight="fill" />
            {copied ? 'Länk kopierad!' : 'Dela artikel'}
          </button>
        </footer>

      </div>
    </>
  );
};

export default BlogPost;
