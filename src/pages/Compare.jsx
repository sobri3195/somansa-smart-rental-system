import { Link } from 'react-router-dom';
import { useCompare } from '../hooks/useCompare';
import { useProperties } from '../hooks/useProperties';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { data: properties, isLoading, error } = useProperties();

  if (isLoading) return <Layout><LoadingSpinner /></Layout>;
  if (error) return <Layout><ErrorMessage message="Failed to load properties" /></Layout>;

  const compareProperties = properties?.filter(prop => compareList.includes(prop.id)) || [];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (compareProperties.length === 0) {
    return (
      <Layout>
        <div className="page-header">
          <h1>Compare Properties</h1>
          <p>Compare up to 3 properties side by side</p>
        </div>
        <div className="no-data">
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</p>
          <h3>No Properties to Compare</h3>
          <p>Add properties from the listings to compare them</p>
          <Link to="/properties" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Browse Properties
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Compare Properties</h1>
        <p>Comparing {compareProperties.length} {compareProperties.length === 1 ? 'property' : 'properties'}</p>
      </div>

      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <button onClick={clearCompare} className="btn btn-secondary">
          Clear All
        </button>
      </div>

      <div className="compare-table-container">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Feature</th>
              {compareProperties.map(property => (
                <th key={property.id}>
                  <div className="compare-property-header">
                    <h3>{property.name}</h3>
                    <button
                      onClick={() => removeFromCompare(property.id)}
                      className="btn btn-sm btn-secondary"
                      style={{ marginTop: '0.5rem' }}
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="compare-label">Type</td>
              {compareProperties.map(property => (
                <td key={property.id}>
                  <span className={`badge badge-${property.type}`}>
                    {property.type}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="compare-label">Location</td>
              {compareProperties.map(property => (
                <td key={property.id}>{property.location}</td>
              ))}
            </tr>
            <tr>
              <td className="compare-label">Price Range</td>
              {compareProperties.map(property => (
                <td key={property.id}>{formatPrice(property.priceRange?.min || 0)}</td>
              ))}
            </tr>
            <tr>
              <td className="compare-label">Total Units</td>
              {compareProperties.map(property => (
                <td key={property.id}>{property.totalUnits || 'N/A'}</td>
              ))}
            </tr>
            <tr>
              <td className="compare-label">Description</td>
              {compareProperties.map(property => (
                <td key={property.id} style={{ fontSize: '0.875rem' }}>
                  {property.description}
                </td>
              ))}
            </tr>
            <tr>
              <td className="compare-label">Action</td>
              {compareProperties.map(property => (
                <td key={property.id}>
                  <Link to={`/properties/${property.id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
