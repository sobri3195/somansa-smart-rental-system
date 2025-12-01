import { useState } from 'react';

export default function VirtualTour({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleRotate = (direction) => {
    setRotation(prev => prev + (direction === 'left' ? -30 : 30));
  };

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(1, Math.min(3, prev + delta)));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setRotation(0);
    setZoom(1);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setRotation(0);
    setZoom(1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (images.length === 0) {
    return (
      <div className="virtual-tour-placeholder">
        <div className="placeholder-icon">🏠</div>
        <p>Virtual tour not available</p>
      </div>
    );
  }

  return (
    <div className={`virtual-tour ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="tour-header">
        <h3>🎨 Virtual Tour 360°</h3>
        <button onClick={toggleFullscreen} className="fullscreen-btn">
          {isFullscreen ? '✕' : '⛶'}
        </button>
      </div>

      <div className="tour-viewer">
        <img 
          src={images[currentIndex]} 
          alt={`View ${currentIndex + 1}`}
          style={{ 
            transform: `rotate(${rotation}deg) scale(${zoom})`,
            transition: 'transform 0.3s ease'
          }}
          className="tour-image"
        />
        
        <div className="tour-overlay">
          <div className="tour-info">
            <span className="tour-counter">{currentIndex + 1} / {images.length}</span>
          </div>
        </div>
      </div>

      <div className="tour-controls">
        <div className="navigation-controls">
          <button onClick={prevImage} className="control-btn">
            ← Previous
          </button>
          <button onClick={nextImage} className="control-btn">
            Next →
          </button>
        </div>

        <div className="view-controls">
          <button onClick={() => handleRotate('left')} className="control-btn icon-btn" title="Rotate left">
            ↺
          </button>
          <button onClick={() => handleRotate('right')} className="control-btn icon-btn" title="Rotate right">
            ↻
          </button>
          <button onClick={() => handleZoom(0.2)} className="control-btn icon-btn" title="Zoom in">
            +
          </button>
          <button onClick={() => handleZoom(-0.2)} className="control-btn icon-btn" title="Zoom out">
            −
          </button>
          <button onClick={() => { setRotation(0); setZoom(1); }} className="control-btn icon-btn" title="Reset">
            ⟲
          </button>
        </div>
      </div>

      <div className="tour-thumbnails">
        {images.map((img, idx) => (
          <img 
            key={idx}
            src={img}
            alt={`Thumbnail ${idx + 1}`}
            className={`thumbnail ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => { setCurrentIndex(idx); setRotation(0); setZoom(1); }}
          />
        ))}
      </div>
    </div>
  );
}
