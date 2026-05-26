export const Sidebar = ({ filters, setFilters }) => {
  return (
    <div className="sidebar">
      <h3>Location</h3>
      <select
        className="full"
        value={filters.area || 'All Mumbai'}
        onChange={(e) => setFilters({ ...filters, area: e.target.value })}
        style={{ marginBottom: '12px', fontSize: '13px', padding: '7px 10px' }}
      >
        <option>All Mumbai</option>
        <option>Bandra</option>
        <option>Andheri</option>
        <option>Powai</option>
        <option>Juhu</option>
        <option>Colaba</option>
        <option>Dadar</option>
        <option>Malad</option>
      </select>

      <h3>Price range</h3>
      <div className="range-row">
        <div className="range-label">
          <span>₹0</span>
          <span>₹{filters.maxPrice || 800}</span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          value={filters.maxPrice || 800}
          step="50"
          onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
        />
      </div>

      <h3>Hygiene score</h3>
      <div className="range-row">
        <div className="range-label">
          <span>Min</span>
          <span>{filters.minHygiene || 7}+</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={filters.minHygiene || 7}
          step="1"
          onChange={(e) => setFilters({ ...filters, minHygiene: parseInt(e.target.value) })}
        />
      </div>

      <h3>Filters</h3>
      <div className="filter-row">
        <span className="filter-label">Open now</span>
        <button
          className={`toggle ${filters.openNow ? 'on' : ''}`}
          onClick={() => setFilters({ ...filters, openNow: !filters.openNow })}
        ></button>
      </div>
      <div className="filter-row">
        <span className="filter-label">Delivery available</span>
        <button
          className={`toggle ${filters.delivery ? 'on' : ''}`}
          onClick={() => setFilters({ ...filters, delivery: !filters.delivery })}
        ></button>
      </div>
      <div className="filter-row">
        <span className="filter-label">Dine-in</span>
        <button
          className={`toggle ${filters.dineIn ? 'on' : ''}`}
          onClick={() => setFilters({ ...filters, dineIn: !filters.dineIn })}
        ></button>
      </div>
      <div className="filter-row">
        <span className="filter-label">FSSAI certified</span>
        <button
          className={`toggle ${filters.fssai ? 'on' : ''}`}
          onClick={() => setFilters({ ...filters, fssai: !filters.fssai })}
        ></button>
      </div>

      <h3>Dish type</h3>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={filters.isVeg === true}
          onChange={() => setFilters({ ...filters, isVeg: filters.isVeg === true ? null : true })}
        />
        Vegetarian
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={filters.isVeg === false}
          onChange={() => setFilters({ ...filters, isVeg: filters.isVeg === false ? null : false })}
        />
        Non-vegetarian
      </label>
    </div>
  );
};

