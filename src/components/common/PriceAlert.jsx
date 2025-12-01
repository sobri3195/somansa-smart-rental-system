import { useState } from 'react';

export default function PriceAlert({ propertyId, propertyName, currentPrice }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState(currentPrice * 0.9);
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('priceAlerts');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newAlert = {
      id: Date.now(),
      propertyId,
      propertyName,
      email,
      targetPrice,
      currentPrice,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    const updatedAlerts = [...alerts, newAlert];
    setAlerts(updatedAlerts);
    localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));

    alert(`Price alert set! We'll notify you at ${email} when the price drops to Rp ${targetPrice.toLocaleString('id-ID')} or lower.`);
    setIsOpen(false);
    setEmail('');
  };

  const removeAlert = (id) => {
    const updatedAlerts = alerts.filter(a => a.id !== id);
    setAlerts(updatedAlerts);
    localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
  };

  const activeAlertsForProperty = alerts.filter(a => a.propertyId === propertyId && a.isActive);

  return (
    <div className="price-alert">
      <button 
        className="price-alert-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Set price alert"
      >
        🔔 Price Alert
      </button>

      {isOpen && (
        <div className="price-alert-modal">
          <div className="modal-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>🔔 Set Price Alert</h3>
              <button onClick={() => setIsOpen(false)} className="close-btn">✕</button>
            </div>

            <div className="modal-body">
              <div className="alert-info">
                <p className="property-name">{propertyName}</p>
                <p className="current-price">
                  Current Price: <strong>Rp {currentPrice.toLocaleString('id-ID')}</strong>
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Target Price (Notify when price drops to or below)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    min="0"
                    max={currentPrice}
                    step="100000"
                    required
                  />
                  <div className="price-slider-wrapper">
                    <input
                      type="range"
                      min={currentPrice * 0.5}
                      max={currentPrice}
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(Number(e.target.value))}
                      className="slider"
                    />
                    <div className="price-labels">
                      <span>{Math.round((targetPrice / currentPrice) * 100)}% of current</span>
                      <span>Save: Rp {(currentPrice - targetPrice).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Set Alert
                </button>
              </form>

              {activeAlertsForProperty.length > 0 && (
                <div className="active-alerts">
                  <h4>Active Alerts for this Property:</h4>
                  {activeAlertsForProperty.map(alert => (
                    <div key={alert.id} className="alert-item">
                      <div className="alert-details">
                        <span>📧 {alert.email}</span>
                        <span>💰 Target: Rp {alert.targetPrice.toLocaleString('id-ID')}</span>
                      </div>
                      <button 
                        onClick={() => removeAlert(alert.id)}
                        className="remove-alert-btn"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
