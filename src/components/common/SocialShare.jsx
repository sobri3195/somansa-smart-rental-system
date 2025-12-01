import { useState } from 'react';

export default function SocialShare({ property }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = property ? `Check out ${property.name} on Somansa` : 'Somansa - Smart Rental System';
  const shareText = property 
    ? `${property.name} - ${property.type} available for rent at Rp ${property.price?.toLocaleString('id-ID')}/month`
    : 'Find your perfect rental on Somansa';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    trackShare(platform);
  };

  const trackShare = (platform) => {
    const shares = JSON.parse(localStorage.getItem('socialShares') || '{}');
    shares[platform] = (shares[platform] || 0) + 1;
    localStorage.setItem('socialShares', JSON.stringify(shares));
  };

  return (
    <div className="social-share">
      <button 
        className="share-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Share this property"
      >
        <span className="share-icon">📤</span>
        Share
      </button>

      {isOpen && (
        <div className="share-menu">
          <div className="share-header">
            <h4>Share this property</h4>
            <button onClick={() => setIsOpen(false)} className="close-btn">✕</button>
          </div>

          <div className="share-options">
            <button 
              className="share-option facebook"
              onClick={() => handleShare('facebook')}
            >
              <span className="option-icon">📘</span>
              <span>Facebook</span>
            </button>

            <button 
              className="share-option twitter"
              onClick={() => handleShare('twitter')}
            >
              <span className="option-icon">🐦</span>
              <span>Twitter</span>
            </button>

            <button 
              className="share-option whatsapp"
              onClick={() => handleShare('whatsapp')}
            >
              <span className="option-icon">💬</span>
              <span>WhatsApp</span>
            </button>

            <button 
              className="share-option telegram"
              onClick={() => handleShare('telegram')}
            >
              <span className="option-icon">✈️</span>
              <span>Telegram</span>
            </button>

            <button 
              className="share-option linkedin"
              onClick={() => handleShare('linkedin')}
            >
              <span className="option-icon">💼</span>
              <span>LinkedIn</span>
            </button>

            <button 
              className="share-option email"
              onClick={() => handleShare('email')}
            >
              <span className="option-icon">📧</span>
              <span>Email</span>
            </button>
          </div>

          <div className="share-link">
            <input 
              type="text" 
              value={shareUrl} 
              readOnly 
              className="link-input"
            />
            <button 
              onClick={copyToClipboard}
              className={`copy-btn ${copied ? 'copied' : ''}`}
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
