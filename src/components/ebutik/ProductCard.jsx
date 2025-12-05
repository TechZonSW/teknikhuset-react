import React from 'react';
import { Link } from 'react-router-dom';

const getConditionClass = (condition) => {
  if (!condition) return '';
  return condition.toLowerCase().replace(/\s+/g, '-');
};

const ProductCard = ({ product }) => {
  const handleAddToCart = () => {
    console.log(`Produkt lades till i korgen: ${product.id} - ${product.namn}`);
    // TODO: Implementera varukorgslogik
  };

  return (
    <div className="product-card">
      <Link to={`/produkt/${product.id}`} className="product-card-image-link">
        <div className="product-card-image-wrapper">
          <img src={product.media[0].url} alt={product.namn} />
          {product.skick && (
            <span className={`condition-badge ${getConditionClass(product.skick)}`}>
              {product.skick}
            </span>
          )}
        </div>
      </Link>

      <div className="product-card-content">
        <span className="product-card-brand">{product.marke}</span>
        <h4>{product.namn}</h4>
        
        <p className="price">{product.pris.toLocaleString('sv-SE')} kr</p>
        
        {product.delbetalning_mojlig && (
          <p className="price-installment">{product.delbetalning_pris}</p>
        )}

        <div className="product-card-buttons">
          <Link to={`/produkt/${product.id}`} className="details-btn">
            Detaljer
          </Link>
          <button onClick={handleAddToCart} className="add-to-cart-btn">
            Lägg i korg
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;