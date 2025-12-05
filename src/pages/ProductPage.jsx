import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { allProducts } from '../data/products';
import { ArrowLeft } from '@phosphor-icons/react';
import './ProductPage.css';

const ProductPage = () => {
  const { productId } = useParams();
  const product = allProducts.find(p => p.id === productId);
  const [mainImage, setMainImage] = useState(product?.media[0]?.url);

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Produkt hittades inte</h2>
        <p>Produkten du letar efter verkar inte finnas.</p>
        <Link to="/e-butik" className="back-to-shop-link-error">
          Tillbaka till butiken
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    console.log(`Produkt lades till i korgen: ${product.id} - ${product.namn}`);
    // TODO: Implementera varukorgslogik
  };

  return (
    <div className="product-page-container">
      <div className="container">
        <Link to="/e-butik" className="back-to-shop-link">
          <ArrowLeft size={16} weight="bold" /> Tillbaka till alla produkter
        </Link>

        <div className="product-details-grid">
          {/* PRODUCT GALLERY */}
          <div className="product-gallery">
            <img src={mainImage} alt={product.namn} className="main-product-image" />
            
            {/* Thumbnail Gallery */}
            {product.media && product.media.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                {product.media.map((media, index) => (
                  <img
                    key={index}
                    src={media.url}
                    alt={`${product.namn} - bild ${index + 1}`}
                    onClick={() => setMainImage(media.url)}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: mainImage === media.url ? '2px solid var(--primary-color)' : '1px solid rgba(0,0,0,0.1)',
                      opacity: mainImage === media.url ? 1 : 0.6,
                      transition: 'all 0.3s ease',
                      objectFit: 'cover'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div className="product-info">
            <span className="product-page-brand">{product.marke}</span>
            <h1>{product.namn}</h1>
            <p className="product-page-short-desc">{product.beskrivning_kort}</p>

            {/* PRICE SECTION */}
            <div className="product-page-price-section">
              <p className="price">{product.pris.toLocaleString('sv-SE')} kr</p>
              {product.delbetalning_mojlig && (
                <p className="price-installment">💳 {product.delbetalning_pris}</p>
              )}
            </div>

            {/* ADD TO CART BUTTON */}
            <button 
              className="add-to-cart-btn-product-page"
              onClick={handleAddToCart}
            >
              Lägg i varukorg
            </button>

            {/* SPECIFICATIONS */}
            <div className="product-page-specs">
              <h3>Specifikationer</h3>
              <ul>
                {product.specifikationer.map(spec => (
                  <li key={spec.label}>
                    <span>{spec.label}</span>
                    <strong>{spec.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* LONG DESCRIPTION */}
        <div className="product-page-long-desc">
          <h2>Beskrivning</h2>
          <p>{product.beskrivning_lang}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;