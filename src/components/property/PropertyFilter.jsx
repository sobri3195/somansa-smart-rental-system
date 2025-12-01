import { useState } from 'react';

export default function PropertyFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    minPrice: '',
    maxPrice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      type: '',
      city: '',
      minPrice: '',
      maxPrice: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="property-filter">
      <div className="filter-group">
        <label htmlFor="type">Type</label>
        <select
          id="type"
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="filter-input"
        >
          <option value="">All Types</option>
          <option value="house">House</option>
          <option value="kos">Boarding (Kos)</option>
          <option value="car">Car Rental</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={filters.city}
          onChange={handleChange}
          placeholder="Search by city..."
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="minPrice">Min Price</label>
        <input
          type="number"
          id="minPrice"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="Min"
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="maxPrice">Max Price</label>
        <input
          type="number"
          id="maxPrice"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Max"
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <button onClick={handleReset} className="btn btn-secondary">
          Reset
        </button>
      </div>
    </div>
  );
}
