import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import UnitCard from '../components/property/UnitCard';
import BookingForm from '../components/booking/BookingForm';
import BookingSuccess from '../components/booking/BookingSuccess';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Badge from '../components/common/Badge';
import ReviewsSection from '../components/common/ReviewsSection';
import ImageGallery from '../components/common/ImageGallery';
import FavoriteButton from '../components/common/FavoriteButton';
import CompareButton from '../components/common/CompareButton';
import VirtualTour from '../components/common/VirtualTour';
import PriceCalculator from '../components/common/PriceCalculator';
import ARPreview from '../components/common/ARPreview';
import PriceAlert from '../components/common/PriceAlert';
import SocialShare from '../components/common/SocialShare';
import { useProperty, usePropertyUnits } from '../hooks/useProperties';
import { formatPropertyType } from '../utils/formatters';

export default function PropertyDetail() {
  const { id } = useParams();
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const { data: property, isLoading: propertyLoading, isError: propertyError, error: propertyErrorData } = useProperty(id);
  const { data: units, isLoading: unitsLoading, isError: unitsError } = usePropertyUnits(id);

  const isLoading = propertyLoading || unitsLoading;
  const isError = propertyError || unitsError;

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookingSuccess = (booking) => {
    setBookingSuccess(booking);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container">
          <LoadingSpinner message="Loading property details..." />
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="container">
          <ErrorMessage message={propertyErrorData?.response?.data?.message || 'Failed to load property'} />
        </div>
      </Layout>
    );
  }

  if (bookingSuccess) {
    return (
      <Layout>
        <div className="container">
          <BookingSuccess booking={bookingSuccess} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="property-detail-page">
        <div className="container">
          <div className="property-detail-header">
            <div>
              <h1>{property.name}</h1>
              {property.city && <p className="property-location">📍 {property.city}</p>}
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <FavoriteButton propertyId={property.id} />
              <CompareButton propertyId={property.id} />
              <SocialShare property={property} />
              <PriceAlert 
                propertyId={property.id} 
                propertyName={property.name}
                currentPrice={property.price || 0}
              />
              <Badge variant={property.type}>{formatPropertyType(property.type)}</Badge>
            </div>
          </div>

          {property.images && property.images.length > 0 && (
            <ImageGallery images={property.images} title={property.name} />
          )}

          <VirtualTour images={property.images || []} />
          
          <ARPreview property={property} />

          {property.price && (
            <PriceCalculator 
              basePrice={property.price} 
              type={property.type === 'car' ? 'daily' : 'monthly'} 
            />
          )}

          <div className="property-info">
            <section className="info-section">
              <h2>Description</h2>
              <p>{property.description || 'No description available.'}</p>
            </section>

            {property.facilities && property.facilities.length > 0 && (
              <section className="info-section">
                <h2>Facilities</h2>
                <div className="facilities-list">
                  {property.facilities.map((facility, idx) => (
                    <div key={idx} className="facility-item">
                      <span className="facility-icon">✓</span>
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {property.address && (
              <section className="info-section">
                <h2>Location</h2>
                <p>{property.address}</p>
              </section>
            )}
          </div>

          <section className="units-section">
            <h2>Available Units</h2>
            {unitsLoading && <LoadingSpinner message="Loading units..." />}
            {unitsError && <p>Failed to load units</p>}
            {units && units.length === 0 && <p>No units available</p>}
            {units && units.length > 0 && (
              <div className="units-grid">
                {units.map(unit => (
                  <UnitCard 
                    key={unit.id} 
                    unit={unit} 
                    onSelect={handleUnitSelect}
                    selected={selectedUnit?.id === unit.id}
                  />
                ))}
              </div>
            )}
          </section>

          <section id="booking-section" className="booking-section">
            <BookingForm 
              propertyId={id}
              unitId={selectedUnit?.id}
              propertyType={property.type}
              onSuccess={handleBookingSuccess}
            />
          </section>

          <ReviewsSection propertyId={id} />
        </div>
      </div>
    </Layout>
  );
}
