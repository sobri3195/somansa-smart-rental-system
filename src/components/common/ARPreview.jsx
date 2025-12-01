import { useState } from 'react';

export default function ARPreview({ property }) {
  const [isActive, setIsActive] = useState(false);
  const [placement, setPlacement] = useState({ x: 50, y: 50 });
  const [scale, setScale] = useState(1);

  const startAR = () => {
    setIsActive(true);
  };

  const stopAR = () => {
    setIsActive(false);
    setPlacement({ x: 50, y: 50 });
    setScale(1);
  };

  const handleMove = (direction) => {
    setPlacement(prev => {
      const step = 5;
      switch(direction) {
        case 'up': return { ...prev, y: Math.max(0, prev.y - step) };
        case 'down': return { ...prev, y: Math.min(100, prev.y + step) };
        case 'left': return { ...prev, x: Math.max(0, prev.x - step) };
        case 'right': return { ...prev, x: Math.min(100, prev.x + step) };
        default: return prev;
      }
    });
  };

  return (
    <div className="ar-preview">
      {!isActive ? (
        <button className="ar-preview-btn" onClick={startAR}>
          <span className="ar-icon">📱</span>
          <span>AR Preview</span>
          <span className="ar-badge">Beta</span>
        </button>
      ) : (
        <div className="ar-viewer">
          <div className="ar-header">
            <h3>🌐 AR Preview Mode</h3>
            <button onClick={stopAR} className="close-btn">✕</button>
          </div>

          <div className="ar-canvas">
            <div className="ar-grid">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="grid-cell"></div>
              ))}
            </div>

            <div 
              className="ar-object"
              style={{
                left: `${placement.x}%`,
                top: `${placement.y}%`,
                transform: `translate(-50%, -50%) scale(${scale})`
              }}
            >
              <div className="ar-model">
                <div className="model-icon">🏠</div>
                <div className="model-shadow"></div>
              </div>
              <div className="ar-info">
                <div className="info-tag">{property?.name || 'Property'}</div>
                <div className="info-tag">{property?.type || 'Type'}</div>
              </div>
            </div>

            <div className="ar-overlay-info">
              <div className="overlay-item">
                <span className="overlay-icon">📏</span>
                <span>Scale: {scale.toFixed(1)}x</span>
              </div>
              <div className="overlay-item">
                <span className="overlay-icon">📍</span>
                <span>Position: ({placement.x}, {placement.y})</span>
              </div>
            </div>
          </div>

          <div className="ar-controls">
            <div className="control-section">
              <div className="control-label">Position</div>
              <div className="position-controls">
                <button onClick={() => handleMove('up')}>↑</button>
                <div className="horizontal-controls">
                  <button onClick={() => handleMove('left')}>←</button>
                  <button onClick={() => setPlacement({ x: 50, y: 50 })}>⌖</button>
                  <button onClick={() => handleMove('right')}>→</button>
                </div>
                <button onClick={() => handleMove('down')}>↓</button>
              </div>
            </div>

            <div className="control-section">
              <div className="control-label">Scale</div>
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="scale-slider"
              />
            </div>

            <button className="btn btn-primary" onClick={() => alert('AR placement saved!')}>
              Save Placement
            </button>
          </div>

          <div className="ar-hint">
            💡 Use controls to position and scale the property model in your space
          </div>
        </div>
      )}
    </div>
  );
}
