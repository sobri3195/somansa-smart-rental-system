import { useState } from 'react';

export default function ImageGallery({ images = [], title = '' }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!images || images.length === 0) {
    return null;
  }

  const openLightbox = (index) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  };

  const goToNext = () => {
    setSelectedIndex((selectedIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
  };

  return (
    <>
      <div className="image-gallery">
        <div className="gallery-grid">
          {images.map((image, index) => (
            <div
              key={index}
              className="gallery-item"
              onClick={() => openLightbox(index)}
            >
              <img src={image.url || image} alt={image.alt || `${title} - Image ${index + 1}`} />
              <div className="gallery-overlay">
                <span>🔍 View</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <div
          className="lightbox"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            ✕
          </button>

          <button
            className="lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[selectedIndex].url || images[selectedIndex]}
              alt={images[selectedIndex].alt || `${title} - Image ${selectedIndex + 1}`}
            />
            <div className="lightbox-caption">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>

          <button
            className="lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
