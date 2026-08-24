import React, { useState, useEffect } from 'react';
import { searchProducts, ALL_BRANDS, MOCK_PRODUCTS } from '../lib/mockProducts.js';

export default function SearchFilter({ onVoiceSearch, voiceQuery, voiceMaxPrice }) {
  const [textQuery, setTextQuery] = useState('');
  const [brand, setBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState(500);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (voiceMaxPrice != null) {
      setMaxPrice(voiceMaxPrice);
      setShowResults(true);
    }
  }, [voiceMaxPrice]);

  useEffect(() => {
    if (voiceQuery) {
      setShowResults(true);
    }
  }, [voiceQuery]);

  // Voice search query overrides text query
  const activeQuery = voiceQuery || textQuery;
  const results = showResults || voiceQuery || voiceMaxPrice != null
    ? searchProducts(activeQuery, { brand: brand || undefined, maxPrice })
    : [];

  const handleTextSearch = (e) => {
    e.preventDefault();
    setShowResults(true);
  };

  return (
    <section className="search-filter" aria-label="Search products">
      <h2 className="search-filter__heading">
        Search catalog
        <span className="search-filter__badge">{MOCK_PRODUCTS.length} products</span>
      </h2>

      <form className="search-filter__form" onSubmit={handleTextSearch}>
        <input
          id="search-input"
          className="search-filter__input"
          type="text"
          value={textQuery}
          onChange={(e) => { setTextQuery(e.target.value); setShowResults(false); }}
          placeholder="Search by name…"
          aria-label="Search products by name"
        />
        <button type="submit" className="search-filter__submit" aria-label="Run product search">
          Search
        </button>
      </form>

      <div className="search-filter__filters">
        <label className="search-filter__filter-label">
          Brand
          <select
            id="brand-filter"
            className="search-filter__select"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            aria-label="Filter by brand"
          >
            <option value="">All brands</option>
            {ALL_BRANDS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </label>

        <label className="search-filter__filter-label">
          Max price: ₹{maxPrice}
          <input
            id="price-filter"
            className="search-filter__range"
            type="range"
            min="10"
            max="500"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            aria-label={`Maximum price: ₹${maxPrice}`}
          />
        </label>
      </div>

      {(showResults || voiceQuery) && (
        <ul className="search-results" aria-label="Product search results" aria-live="polite">
          {results.length === 0 && (
            <li className="search-results__empty">No products found.</li>
          )}
          {results.map((p) => (
            <li key={p.id} className="search-result-item">
              <span className="search-result-item__name">{p.name}</span>
              <span className="search-result-item__brand">{p.brand}</span>
              <span className="search-result-item__price">₹{p.price}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
