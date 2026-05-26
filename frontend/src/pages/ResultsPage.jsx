import { useState, useEffect } from 'react';
import { DishCard, SkeletonCard } from '../components/DishCard';
import { Sidebar } from '../components/Sidebar';
import { filterDishes } from '../utils/filterDishes';

export const ResultsPage = ({ query, results, loading, error, onNewSearch, onRetry }) => {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('score');
  const [filteredResults, setFilteredResults] = useState(results);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let filtered = filterDishes(results, filters);

    // Sort
    if (sortBy === 'score') {
      filtered.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'hygiene') {
      filtered.sort((a, b) => b.hygieneScore - a.hygieneScore);
    } else if (sortBy === 'reviews') {
      filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    setFilteredResults(filtered);
  }, [filters, sortBy, results]);

  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <>
      <div style={{ background: 'var(--color-background-secondary)', padding: '12px 24px', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Results for:</span>
        <span style={{ fontSize: '13px', fontWeight: 500 }}>{query}</span>
        <button className="nav-btn" style={{ marginLeft: 'auto', fontSize: '12px', padding: '4px 12px' }} onClick={() => onNewSearch()}>
          ← New search
        </button>
      </div>
      <div className="main">
        {/* Mobile Filter Drawer */}
        <div className={`filter-drawer ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}>
          <div className="filter-drawer-content" onClick={(e) => e.stopPropagation()}>
            <Sidebar filters={filters} setFilters={setFilters} />
          </div>
        </div>

        {/* Desktop Sidebar */}
        <Sidebar filters={filters} setFilters={setFilters} />

        <div className="results">
          <div className="results-header">
            <span className="results-count">
              {filteredResults.length} results · {results.length} versions of <strong>{query}</strong> ranked
            </span>
            <select className="sort-sel" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="score">Sort: Aggregate score</option>
              <option value="price-low">Price: Low to high</option>
              <option value="hygiene">Hygiene score</option>
              <option value="reviews">Most reviewed</option>
            </select>
          </div>

          {/* Loading State */}
          {loading && (
            <div>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="error-state">
              <h2>⚠️ Couldn't fetch results</h2>
              <p>Something went wrong while searching. Please try again.</p>
              <button className="retry-btn" onClick={onRetry}>
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredResults.length === 0 && results.length > 0 && (
            <div className="empty-state">
              <h2>No dishes match your filters</h2>
              <p>Try adjusting your search criteria or resetting the filters.</p>
              <button className="reset-filters-btn" onClick={handleResetFilters}>
                Reset Filters
              </button>
            </div>
          )}

          {/* Results Grid */}
          {!loading && !error && filteredResults.length > 0 && (
            filteredResults.map((dish, idx) => (
              <DishCard key={idx} dish={dish} index={idx} isSponsored={dish.sponsored || false} />
            ))
          )}
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <button className="filter-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle filters">
        ☰
      </button>
    </>
  );
};


