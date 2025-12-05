import React, { useState, useEffect, useMemo } from 'react';
import { X, CaretDown } from '@phosphor-icons/react';

const FilterPanel = ({
  isOpen,
  onClose,
  onApply,
  allProducts, // This is already pre-filtered by category from EButik.js
  initialFilters
}) => {
  const [tempFilters, setTempFilters] = useState(initialFilters);
  const [openDropdowns, setOpenDropdowns] = useState({
    marke: false,
    typ: false,
    farger: false
  });

  const maxPrice = useMemo(() => Math.max(...allProducts.map(p => p.pris), 15000), [allProducts]);
  const minPrice = useMemo(() => Math.min(...allProducts.map(p => p.pris), 0), [allProducts]);

  useEffect(() => {
    setTempFilters(initialFilters);
  }, [initialFilters, isOpen]);

  // Live filtering for product count
  const dynamicallyFilteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const { marke, typ, farger, priceRange } = tempFilters;
      if (marke.length > 0 && !marke.includes(p.marke)) return false;
      if (typ.length > 0 && !typ.includes(p.typ)) return false;
      if (farger.length > 0 && !farger.includes(p.farg)) return false;
      if (p.pris < priceRange[0] || p.pris > priceRange[1]) return false;
      return true;
    });
  }, [tempFilters, allProducts]);

  if (!isOpen) {
    return null;
  }

  const brands = [...new Set(allProducts.map(p => p.marke))].sort();
  const types = [...new Set(allProducts.map(p => p.typ))].sort();
  const colors = [...new Set(allProducts.map(p => p.farg).filter(Boolean))].sort();

  const handleCheckboxChange = (filterType, value) => {
    const currentSelection = tempFilters[filterType] || [];
    const newSelection = currentSelection.includes(value)
      ? currentSelection.filter(item => item !== value)
      : [...currentSelection, value];

    setTempFilters(prev => ({
      ...prev,
      [filterType]: newSelection
    }));
  };

  const handlePriceRangeChange = (newRange) => {
    setTempFilters(prev => ({ ...prev, priceRange: newRange }));
  };
  
  const toggleDropdown = (filterType) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const handleApplyFilters = () => {
    onApply(tempFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      marke: [],
      typ: [],
      farger: [],
      priceRange: [minPrice, maxPrice]
    };
    onApply(clearedFilters); // Apply the cleared filters immediately
    onClose(); // And close the modal
  };
  
  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-panel-modal" onClick={e => e.stopPropagation()}>

        <div className="filter-modal-header">
          <h3>Filtrera</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={24} weight="bold" />
          </button>
        </div>

        <div className="filter-modal-body">

          <div className="price-filter-group">
            <h4>💰 Pris</h4>
            
            <div className="price-range-display">
              <span>{tempFilters.priceRange[0].toLocaleString('sv-SE')} kr</span>
              <span>–</span>
              <span>{tempFilters.priceRange[1].toLocaleString('sv-SE')} kr</span>
            </div>

            <PriceRangeSlider
              min={minPrice}
              max={maxPrice}
              values={tempFilters.priceRange}
              onChange={handlePriceRangeChange}
            />
          </div>

          <div className="filter-group">
            <h4>🏷️ Märke</h4>
            <button
              className={`filter-dropdown-toggle ${openDropdowns.marke ? 'active' : ''}`}
              onClick={() => toggleDropdown('marke')}
            >
              <span>{(tempFilters.marke?.length || 0) > 0 ? `${tempFilters.marke.length} vald${tempFilters.marke.length !== 1 ? 'a' : ''}` : 'Välj märke'}</span>
              <CaretDown size={16} weight="fill" style={{ transform: openDropdowns.marke ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            <div className={`filter-dropdown-content ${openDropdowns.marke ? 'open' : ''}`}>
              <div className="filter-options">
                {brands.map(brand => (
                  <label key={brand}>
                    <input
                      type="checkbox"
                      checked={(tempFilters.marke || []).includes(brand)}
                      onChange={() => handleCheckboxChange('marke', brand)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="filter-group">
            <h4>📱 Typ</h4>
            <button
              className={`filter-dropdown-toggle ${openDropdowns.typ ? 'active' : ''}`}
              onClick={() => toggleDropdown('typ')}
            >
              <span>{(tempFilters.typ?.length || 0) > 0 ? `${tempFilters.typ.length} vald${tempFilters.typ.length !== 1 ? 'a' : ''}` : 'Välj typ'}</span>
              <CaretDown size={16} weight="fill" style={{ transform: openDropdowns.typ ? 'rotate(180deg)' : 'rotate(0deg)'}} />
            </button>
            <div className={`filter-dropdown-content ${openDropdowns.typ ? 'open' : ''}`}>
              <div className="filter-options">
                {types.map(type => (
                  <label key={type}>
                    <input
                      type="checkbox"
                      checked={(tempFilters.typ || []).includes(type)}
                      onChange={() => handleCheckboxChange('typ', type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {colors.length > 0 && (
            <div className="filter-group">
              <h4>🎨 Färg</h4>
              <button
                className={`filter-dropdown-toggle ${openDropdowns.farger ? 'active' : ''}`}
                onClick={() => toggleDropdown('farger')}
              >
                <span>{(tempFilters.farger?.length || 0) > 0 ? `${tempFilters.farger.length} vald${tempFilters.farger.length !== 1 ? 'a' : ''}` : 'Välj färg'}</span>
                <CaretDown size={16} weight="fill" style={{ transform: openDropdowns.farger ? 'rotate(180deg)' : 'rotate(0deg)'}} />
              </button>
              <div className={`filter-dropdown-content ${openDropdowns.farger ? 'open' : ''}`}>
                <div className="filter-options">
                  {colors.map(color => (
                    <label key={color}>
                      <input
                        type="checkbox"
                        checked={(tempFilters.farger || []).includes(color)}
                        onChange={() => handleCheckboxChange('farger', color)}
                      />
                      <span>{color}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="filter-modal-footer">
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Rensa alla
          </button>
          <button className="apply-filters-btn" onClick={handleApplyFilters}>
            Använd filter
            <span className="apply-count-badge">{dynamicallyFilteredProducts.length}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

const PriceRangeSlider = ({ min, max, values, onChange }) => {
  const [minVal, setMinVal] = useState(values[0]);
  const [maxVal, setMaxVal] = useState(values[1]);

  useEffect(() => {
    setMinVal(values[0]);
    setMaxVal(values[1]);
  }, [values]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(value);
    onChange([value, maxVal]);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(value);
    onChange([minVal, value]);
  };

  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className="custom-range-slider-wrapper">
      <div className="slider-track" style={{
        background: `linear-gradient(to right, #dadae5 ${minPercent}%, #0066cc ${minPercent}%, #0066cc ${maxPercent}%, #dadae5 ${maxPercent}%)`
      }}></div>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={handleMinChange}
        className="thumb thumb--left"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={handleMaxChange}
        className="thumb thumb--right"
      />
    </div>
  );
};

export default FilterPanel;