import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, User } from 'phosphor-react';
import './Blog.css';

const BlogCard = ({ post }) => {
  // Formatera datum
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <article className="blog-card">
      <Link to={`/blog/${post.slug}`} className="blog-card-image-wrapper">
        {post.imageUrl ? (
          <img src={post.imageUrl} alt={post.title} loading="lazy" />
        ) : (
          /* PREMIUM FALLBACK - Visas när bild saknas */
          <div className="blog-card-placeholder">
            <span className="placeholder-brand">TEKNIKHUSET</span>
            <span className="placeholder-sub">KALMAR</span>
          </div>
        )}
        <span className="blog-card-category">{post.category || 'Allmänt'}</span>
      </Link>
      
      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span className="meta-item">
            <Calendar size={14} weight="bold" /> 
            {formatDate(post.date)}
          </span>
        </div>
        
        <h3>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        
        <p>{post.summary ? post.summary.substring(0, 120) + '...' : 'Läs mer för att få hela historien.'}</p>
        
        <div className="blog-card-footer">
          <div className="meta-author">
            <User size={14} weight="fill" /> 
            {post.author || 'Teknikhuset'}
          </div>
          <Link to={`/blog/${post.slug}`} className="read-more-btn">
            Läs <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;