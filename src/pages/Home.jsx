import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="home-page">
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Welcome to <span className="brand-name">Somansa</span>
              </h1>
              <h2 className="hero-subtitle">Smart Rental System</h2>
              <p className="hero-description">
                Find your perfect rental solution - whether you&apos;re looking for a house, 
                boarding accommodation (kos), or car rental, we&apos;ve got you covered.
              </p>
              <Link to="/properties" className="btn btn-primary btn-large">
                Browse Rentals
              </Link>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2 className="section-title">What We Offer</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🏠</div>
                <h3>Houses</h3>
                <p>Comfortable homes for families and individuals looking for long-term rentals.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🏢</div>
                <h3>Boarding (Kos)</h3>
                <p>Affordable boarding houses perfect for students and young professionals.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🚗</div>
                <h3>Car Rentals</h3>
                <p>Flexible car rental options for your daily commute or weekend getaway.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <div className="container">
            <h2 className="section-title">How It Works</h2>
            <div className="steps-grid">
              <div className="step">
                <div className="step-number">1</div>
                <h4>Browse</h4>
                <p>Search and filter properties based on your preferences</p>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <h4>Select</h4>
                <p>Choose your preferred property and check availability</p>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <h4>Book</h4>
                <p>Fill in your details and submit your booking request</p>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <h4>Confirm</h4>
                <p>Receive your booking confirmation and reference code</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <h2>Ready to Find Your Perfect Rental?</h2>
            <p>Start browsing our extensive collection of properties today</p>
            <Link to="/properties" className="btn btn-primary btn-large">
              Get Started
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
