import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatCurrency, formatPropertyType } from '../../utils/formatters';

export default function PropertyCard({ property }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/properties/${property.id}`);
  };

  return (
    <Card onClick={handleClick} className="property-card">
      <div className="property-image">
        {property.image ? (
          <img src={property.image} alt={property.name} />
        ) : (
          <div className="property-image-placeholder">
            {property.type === 'house' && '🏠'}
            {property.type === 'kos' && '🏢'}
            {property.type === 'car' && '🚗'}
          </div>
        )}
      </div>
      
      <div className="property-content">
        <div className="property-header">
          <h3>{property.name}</h3>
          <Badge variant={property.type}>{formatPropertyType(property.type)}</Badge>
        </div>
        
        {property.city && (
          <p className="property-location">📍 {property.city}</p>
        )}
        
        <p className="property-description">{property.description}</p>
        
        <div className="property-footer">
          <div className="property-price">
            <span className="price-label">Starting from</span>
            <span className="price-value">{formatCurrency(property.startingPrice)}</span>
            <span className="price-period">
              {property.type === 'car' ? '/day' : '/month'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
