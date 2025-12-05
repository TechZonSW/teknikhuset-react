import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  return (
    <div className="product-grid">
      {products.length > 0 ? (
        products.map(product => <ProductCard key={product.id} product={product} />)
      ) : (
        <p className="no-results-message">Inga produkter matchade din sökning eller dina filter.</p>
      )}
    </div>
  );
};

export default ProductGrid;