import { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import PropertyCard from '../components/property/PropertyCard';
import PropertyFilter from '../components/property/PropertyFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SmartSearch from '../components/common/SmartSearch';
import { useProperties } from '../hooks/useProperties';

export default function PropertyList() {
  const [filters, setFilters] = useState({});
  const { data: properties, isLoading, isError, error, refetch } = useProperties();

  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    return properties.filter(property => {
      if (filters.type && property.type !== filters.type) return false;
      
      if (filters.city && !property.city?.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }
      
      if (filters.search && !property.name?.toLowerCase().includes(filters.search.toLowerCase()) &&
          !property.description?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      if (filters.minPrice && property.startingPrice < Number(filters.minPrice)) {
        return false;
      }
      
      if (filters.maxPrice && property.startingPrice > Number(filters.maxPrice)) {
        return false;
      }
      
      return true;
    });
  }, [properties, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  return (
    <Layout>
      <div className="property-list-page">
        <div className="container">
          <div className="page-header">
            <h1>Browse Properties</h1>
            <p>Find the perfect rental for your needs</p>
          </div>

          <SmartSearch 
            onSearch={handleSearch}
            initialValue={filters.search || ''}
          />

          <PropertyFilter onFilterChange={handleFilterChange} />

          {isLoading && <LoadingSpinner message="Loading properties..." />}

          {isError && (
            <ErrorMessage 
              message={error?.response?.data?.message || 'Failed to load properties'} 
              onRetry={refetch}
            />
          )}

          {!isLoading && !isError && (
            <>
              <div className="results-count">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
              </div>

              {filteredProperties.length === 0 ? (
                <div className="no-results">
                  <p>No properties match your filters. Try adjusting your search criteria.</p>
                </div>
              ) : (
                <div className="properties-grid">
                  {filteredProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
