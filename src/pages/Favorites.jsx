import { useFavorites } from '../hooks/useFavorites';
import { useProperties } from '../hooks/useProperties';
import Layout from '../components/layout/Layout';
import PropertyCard from '../components/property/PropertyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function Favorites() {
  const { favorites } = useFavorites();
  const { data: properties, isLoading, error } = useProperties();

  if (isLoading) return <Layout><LoadingSpinner /></Layout>;
  if (error) return <Layout><ErrorMessage message="Failed to load properties" /></Layout>;

  const favoriteProperties = properties?.filter(prop => favorites.includes(prop.id)) || [];

  return (
    <Layout>
      <div className="page-header">
        <h1>My Favorites ❤️</h1>
        <p>Properties you&apos;ve saved for later</p>
      </div>

      {favoriteProperties.length === 0 ? (
        <div className="no-data">
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤍</p>
          <h3>No Favorites Yet</h3>
          <p>Start adding properties to your favorites!</p>
        </div>
      ) : (
        <>
          <div className="results-count">
            {favoriteProperties.length} {favoriteProperties.length === 1 ? 'property' : 'properties'} saved
          </div>
          <div className="properties-grid">
            {favoriteProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
