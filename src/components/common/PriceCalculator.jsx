import { useState, useMemo } from 'react';

export default function PriceCalculator({ basePrice, type = 'monthly' }) {
  const [duration, setDuration] = useState(1);
  const [includeUtilities, setIncludeUtilities] = useState(false);
  const [includeInsurance, setIncludeInsurance] = useState(false);

  const calculations = useMemo(() => {
    let total = basePrice * duration;
    let breakdown = { base: basePrice * duration };

    if (includeUtilities) {
      const utilities = basePrice * 0.15 * duration;
      breakdown.utilities = utilities;
      total += utilities;
    }

    if (includeInsurance) {
      const insurance = basePrice * 0.05 * duration;
      breakdown.insurance = insurance;
      total += insurance;
    }

    breakdown.tax = total * 0.1;
    total += breakdown.tax;

    return { ...breakdown, total };
  }, [basePrice, duration, includeUtilities, includeInsurance]);

  return (
    <div className="price-calculator">
      <h3>💰 Price Calculator</h3>
      
      <div className="calculator-controls">
        <div className="form-group">
          <label>Duration ({type === 'monthly' ? 'months' : 'days'})</label>
          <input 
            type="range" 
            min="1" 
            max={type === 'monthly' ? 12 : 30}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="slider"
          />
          <span className="duration-value">{duration} {type === 'monthly' ? 'month(s)' : 'day(s)'}</span>
        </div>

        <div className="checkbox-group">
          <label>
            <input 
              type="checkbox" 
              checked={includeUtilities}
              onChange={(e) => setIncludeUtilities(e.target.checked)}
            />
            Include Utilities (+15%)
          </label>
        </div>

        <div className="checkbox-group">
          <label>
            <input 
              type="checkbox" 
              checked={includeInsurance}
              onChange={(e) => setIncludeInsurance(e.target.checked)}
            />
            Include Insurance (+5%)
          </label>
        </div>
      </div>

      <div className="calculator-breakdown">
        <div className="breakdown-item">
          <span>Base Price:</span>
          <span>Rp {calculations.base.toLocaleString('id-ID')}</span>
        </div>
        {includeUtilities && (
          <div className="breakdown-item">
            <span>Utilities:</span>
            <span>Rp {calculations.utilities.toLocaleString('id-ID')}</span>
          </div>
        )}
        {includeInsurance && (
          <div className="breakdown-item">
            <span>Insurance:</span>
            <span>Rp {calculations.insurance.toLocaleString('id-ID')}</span>
          </div>
        )}
        <div className="breakdown-item">
          <span>Tax (10%):</span>
          <span>Rp {calculations.tax.toLocaleString('id-ID')}</span>
        </div>
        <div className="breakdown-item total">
          <span>Total:</span>
          <span>Rp {calculations.total.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div className="price-chart">
        <div 
          className="price-bar base-bar" 
          style={{ width: `${(calculations.base / calculations.total) * 100}%` }}
          title={`Base: ${((calculations.base / calculations.total) * 100).toFixed(1)}%`}
        ></div>
        {includeUtilities && (
          <div 
            className="price-bar utilities-bar" 
            style={{ width: `${(calculations.utilities / calculations.total) * 100}%` }}
            title={`Utilities: ${((calculations.utilities / calculations.total) * 100).toFixed(1)}%`}
          ></div>
        )}
        {includeInsurance && (
          <div 
            className="price-bar insurance-bar" 
            style={{ width: `${(calculations.insurance / calculations.total) * 100}%` }}
            title={`Insurance: ${((calculations.insurance / calculations.total) * 100).toFixed(1)}%`}
          ></div>
        )}
        <div 
          className="price-bar tax-bar" 
          style={{ width: `${(calculations.tax / calculations.total) * 100}%` }}
          title={`Tax: ${((calculations.tax / calculations.total) * 100).toFixed(1)}%`}
        ></div>
      </div>
    </div>
  );
}
