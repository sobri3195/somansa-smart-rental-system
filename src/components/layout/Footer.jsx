export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Somansa</h3>
            <p>Smart Rental System for houses, boarding, and car rentals.</p>
            <p style={{ marginTop: '1rem' }}>
              <strong>Developer:</strong><br />
              Lettu Kes dr. Muhammad Sobri Maulana<br />
              S.Kom, CEH, OSCP, OSCE
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/properties">Browse Properties</a></li>
              <li><a href="/favorites">My Favorites</a></li>
              <li><a href="/compare">Compare Properties</a></li>
              <li><a href="/booking-lookup">Check Booking</a></li>
              <li><a href="/overview">Overview</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact & Support</h4>
            <ul>
              <li><a href="mailto:muhammadsobrimaulana31@gmail.com">📧 Email</a></li>
              <li><a href="https://t.me/winlin_exploit" target="_blank" rel="noopener noreferrer">💬 Telegram</a></li>
              <li><a href="https://chat.whatsapp.com/B8nwRZOBMo64GjTwdXV8Bl" target="_blank" rel="noopener noreferrer">📱 WhatsApp Group</a></li>
              <li><a href="https://muhammadsobrimaulana.netlify.app" target="_blank" rel="noopener noreferrer">🌐 Website</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support the Developer</h4>
            <ul>
              <li><a href="https://lynk.id/muhsobrimaulana" target="_blank" rel="noopener noreferrer">💰 Lynk.id</a></li>
              <li><a href="https://trakteer.id/g9mkave5gauns962u07t" target="_blank" rel="noopener noreferrer">☕ Trakteer</a></li>
              <li><a href="https://karyakarsa.com/muhammadsobrimaulana" target="_blank" rel="noopener noreferrer">🎨 KaryaKarsa</a></li>
              <li><a href="https://nyawer.co/MuhammadSobriMaulana" target="_blank" rel="noopener noreferrer">💸 Nyawer</a></li>
              <li><a href="https://maulanasobri.gumroad.com/" target="_blank" rel="noopener noreferrer">🛒 Gumroad</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Social Media</h4>
            <ul>
              <li><a href="https://github.com/sobri3195" target="_blank" rel="noopener noreferrer">💻 GitHub</a></li>
              <li><a href="https://www.youtube.com/@muhammadsobrimaulana6013" target="_blank" rel="noopener noreferrer">📹 YouTube</a></li>
              <li><a href="https://www.tiktok.com/@dr.sobri" target="_blank" rel="noopener noreferrer">🎵 TikTok</a></li>
              <li><a href="https://muhammad-sobri-maulana-kvr6a.sevalla.page/" target="_blank" rel="noopener noreferrer">🔧 Sevalla</a></li>
              <li><a href="https://pegasus-shop.netlify.app" target="_blank" rel="noopener noreferrer">🛍️ Pegasus Shop</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Somansa Smart Rental System. All rights reserved.</p>
          <p>Developed with ❤️ by <a href="https://github.com/sobri3195" target="_blank" rel="noopener noreferrer" style={{ color: '#fbbf24' }}>Lettu Kes dr. Muhammad Sobri Maulana</a></p>
        </div>
      </div>
    </footer>
  );
}
