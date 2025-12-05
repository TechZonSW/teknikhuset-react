import React, { useState, useMemo } from 'react';
import { allProducts } from '../data/products';
import ProductGrid from '../components/ebutik/ProductGrid';
import FilterPanel from '../components/ebutik/FilterPanel';
import { Funnel, MagnifyingGlass, LockKey, HourglassHigh } from '@phosphor-icons/react';
import './EButik.css';

const EButik = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' eller 'list'
  
  const minPrice = useMemo(() => Math.min(...allProducts.map(p => p.pris), 0), []);
  const maxPrice = useMemo(() => Math.max(...allProducts.map(p => p.pris), 15000), []);

  const [activeFilters, setActiveFilters] = useState({
    marke: [],
    typ: [],
    farger: [],
    priceRange: [minPrice, maxPrice]
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Produkt lades till i korgen: ${product.id} - ${product.namn}`);
  };

  const categories = [
    { id: 'all', label: 'Alla produkter' },
    { id: 'apple-original', label: 'Apple Original' },
    { id: 'andrahand', label: 'Andrahandsenheter' },
    { id: 'tillbehor', label: 'Tillbehör' }
  ];

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (activeCategory === 'all') {
      // No filter
    } else if (activeCategory === 'apple-original') {
      filtered = filtered.filter(p => p.isAppleOriginal === true);
    } else if (activeCategory === 'andrahand') {
      filtered = filtered.filter(p => p.kategori === 'andrahand');
    } else if (activeCategory === 'tillbehor') {
      filtered = filtered.filter(p => p.kategori === 'tillbehor');
    }

    if (searchTerm.trim()) {
      const lowercased = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.namn.toLowerCase().includes(lowercased) ||
        p.marke.toLowerCase().includes(lowercased) ||
        p.typ.toLowerCase().includes(lowercased)
      );
    }

    if (activeFilters.marke.length > 0) {
      filtered = filtered.filter(p => activeFilters.marke.includes(p.marke));
    }

    if (activeFilters.typ.length > 0) {
      filtered = filtered.filter(p => activeFilters.typ.includes(p.typ));
    }

    if (activeFilters.farger.length > 0) {
      filtered = filtered.filter(p => activeFilters.farger.includes(p.farg));
    }

    filtered = filtered.filter(p =>
      p.pris >= activeFilters.priceRange[0] &&
      p.pris <= activeFilters.priceRange[1]
    );

    return filtered;
  }, [searchTerm, activeFilters, activeCategory]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleApplyFilters = (appliedFilters) => {
    setActiveFilters(appliedFilters);
    setCurrentPage(1);
  };
  
  // Corrected logic for counting active filters
  const appliedFilterCount = useMemo(() => {
    const checkboxCount = activeFilters.marke.length + activeFilters.typ.length + activeFilters.farger.length;
    const isPriceChanged = activeFilters.priceRange[0] > minPrice || activeFilters.priceRange[1] < maxPrice;
    return checkboxCount + (isPriceChanged ? 1 : 0);
  }, [activeFilters, minPrice, maxPrice]);

  return (
    <div className="e-butik-page">


      {/* Tillfällig lösning: PREMIUM OVERLAY --- */}
      <div className="premium-lock-overlay">
        <div className="premium-lock-content">
          <div className="lock-icon-wrapper">
            <LockKey size={48} weight="duotone" />
          </div>
          <h2>Lanserar 2026</h2>
          <div className="divider-line"></div>
          <p>
            Vi förbereder just nu en exklusiv shoppingupplevelse. 
            Välkommen åter när vi slår upp portarna.
          </p>
          <span className="premium-badge">COMING SOON</span>
        </div>
      </div>
      {/* --- NY KOD SLUTAR HÄR --- */}


      <div className="shop-header-wrapper">
        <div className="shop-header-container">
          <div className="category-tabs-section">
            <div className="category-tabs-container">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setCurrentPage(1);
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="shop-controls-bar">
            <button
              className={`filter-toggle-btn ${appliedFilterCount > 0 ? 'has-active' : ''}`}
              onClick={() => setIsFilterModalOpen(true)}
            >
              <Funnel size={18} weight="fill" />
              <span>Filter</span>
              {appliedFilterCount > 0 && (
                <span className="filter-badge">{appliedFilterCount}</span>
              )}
            </button>

            <div className="search-bar-wrapper">
              <MagnifyingGlass size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Sök..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && setCurrentPage(1)}
              />
              <button className="search-button" onClick={() => setCurrentPage(1)}>
                Sök
              </button>
            </div>

            <div className="view-toggle">
              <button
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Rutnätsvy"
              >
                ⊞⊞<br/>⊞⊞
              </button>
              <button
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Listvy"
              >
                ≡
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="shop-main-content">
        <div className="container">
          <div className="product-grid-header">
            <h1>
              {categories.find(c => c.id === activeCategory)?.label}
            </h1>
            <p>
              {filteredProducts.length} produkt{filteredProducts.length !== 1 ? 'er' : ''}
              {searchTerm && ` för "${searchTerm}"`}
            </p>
          </div>

          <div className={`product-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map(product => (
                <a href={`/produkt/${product.id}`} key={product.id} className="product-card-link-wrapper">
                  <div className="product-card">
                    <div className="product-card-image-wrapper">
                      <img src={product.media[0].url} alt={product.namn} />
                      {product.skick && (
                        <span className={`condition-badge ${product.skick.toLowerCase().replace(/\s+/g, '-')}`}>
                          {product.skick}
                        </span>
                      )}
                    </div>
                    
                    <div className="product-card-content">
                      {viewMode === 'grid' ? (
                        <>
                          <div className="product-card-text-content">
                            <div className="product-card-details-grid">
                              <div className="product-card-details-left">
                                <span className="product-card-brand">{product.marke}</span>
                                <h4>{product.namn}</h4>
                              </div>
                              <div className="product-card-details-right">
                                <p className="price">{product.pris.toLocaleString('sv-SE')} kr</p>
                                {product.delbetalning_mojlig && (
                                  <p className="price-installment">{product.delbetalning_pris}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="product-card-buttons">
                            <button className="add-to-cart-btn" onClick={(e) => handleAddToCart(e, product)}>
                              Lägg i varukorg
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="list-view-info">
                            <span className="product-card-brand">{product.marke}</span>
                            <h4>{product.namn}</h4>
                          </div>
                          <div className="list-view-actions">
                            <div className="price-block">
                              <p className="price">{product.pris.toLocaleString('sv-SE')} kr</p>
                              {product.delbetalning_mojlig && (
                                <p className="price-installment">{product.delbetalning_pris}</p>
                              )}
                            </div>
                            <div className="product-card-buttons">
                              <button className="add-to-cart-btn" onClick={(e) => handleAddToCart(e, product)}>
                                Lägg i varukorg
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <p className="no-results-message">Inga produkter matchade din sökning eller dina filter.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                ← Tidigare
              </button>
              {[...Array(totalPages).keys()].map(i => (
                <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                Nästa →
              </button>
            </div>
          )}
        </div>
      </main>

      <FilterPanel
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        allProducts={filteredProducts} /* Pass the category-filtered list */
        initialFilters={activeFilters}
      />
    </div>
  );
};

export default EButik;