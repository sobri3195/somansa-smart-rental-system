import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatters';

export default function UnitCard({ unit, onSelect, selected }) {
  return (
    <Card 
      onClick={() => onSelect(unit)} 
      className={`unit-card ${selected ? 'unit-card-selected' : ''}`}
    >
      <div className="unit-header">
        <h4>{unit.name || `Unit ${unit.number}`}</h4>
        {unit.isAvailable !== undefined && (
          <span className={`availability-badge ${unit.isAvailable ? 'available' : 'occupied'}`}>
            {unit.isAvailable ? '✓ Available' : '✗ Occupied'}
          </span>
        )}
      </div>
      
      {unit.description && (
        <p className="unit-description">{unit.description}</p>
      )}
      
      <div className="unit-details">
        {unit.capacity && (
          <div className="unit-detail">
            <span className="detail-icon">👥</span>
            <span>Capacity: {unit.capacity}</span>
          </div>
        )}
        
        {unit.size && (
          <div className="unit-detail">
            <span className="detail-icon">📏</span>
            <span>{unit.size} m²</span>
          </div>
        )}
        
        {unit.facilities && unit.facilities.length > 0 && (
          <div className="unit-facilities">
            {unit.facilities.slice(0, 3).map((facility, idx) => (
              <span key={idx} className="facility-tag">{facility}</span>
            ))}
            {unit.facilities.length > 3 && (
              <span className="facility-tag">+{unit.facilities.length - 3} more</span>
            )}
          </div>
        )}
      </div>
      
      <div className="unit-price">
        <span className="price-value">{formatCurrency(unit.price)}</span>
        <span className="price-period">/month</span>
      </div>
    </Card>
  );
}
