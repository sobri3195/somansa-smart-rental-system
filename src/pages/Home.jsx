import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import WaveDivider from '../components/common/WaveDivider';
import { 
  dummyProperties, 
  dummyTestimonials, 
  dummyStats, 
  dummyPartners,
  dummyFAQs,
  dummyPromotions,
  dummyRecentActivities,
  dummyFeatures
} from '../data/dummyData';

export default function Home() {
  const [activePromo, setActivePromo] = useState(0);
  const [counters, setCounters] = useState({
    properties: 0,
    bookings: 0,
    customers: 0,
    cities: 0
  });
  const [activeFAQ, setActiveFAQ] = useState(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromo((prev) => (prev + 1) % dummyPromotions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      properties: dummyStats.total_properties,
      bookings: dummyStats.total_bookings,
      customers: dummyStats.happy_customers,
      cities: dummyStats.cities_covered
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        properties: Math.floor(targets.properties * progress),
        bookings: Math.floor(targets.bookings * progress),
        customers: Math.floor(targets.customers * progress),
        cities: Math.floor(targets.cities * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const featuredProperties = dummyProperties.filter(p => p.featured);

  return (
    <Layout>
      <div className="home-page">
        <section className="promo-banner gradient-animate" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '1rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="container">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <strong>🎉 {dummyPromotions[activePromo].title}</strong> - Use code: <code style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}>{dummyPromotions[activePromo].code}</code>
            </div>
          </div>
        </section>

        <section className="hero" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '5rem 0 8rem 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="container">
            <div className="hero-content fade-in-up">
              <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                Welcome to <span className="brand-name shine" style={{
                  background: 'linear-gradient(90deg, #fff, #ffd700, #fff)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Somansa</span>
              </h1>
              <h2 className="hero-subtitle fade-in-up delay-1" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                Smart Rental System
              </h2>
              <p className="hero-description fade-in-up delay-2" style={{ fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                Find your perfect rental solution - whether you&apos;re looking for a house, 
                boarding accommodation (kos), or car rental, we&apos;ve got you covered.
              </p>
              <Link to="/properties" className="btn btn-primary btn-large glow-pulse ripple fade-in-up delay-3" style={{
                display: 'inline-block',
                padding: '1rem 2.5rem',
                background: 'white',
                color: '#667eea',
                borderRadius: '50px',
                fontWeight: 'bold',
                textDecoration: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}>
                Browse Rentals 🚀
              </Link>
            </div>
          </div>
          <div className="floating" style={{
            position: 'absolute',
            bottom: '5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '2rem',
            opacity: 0.5
          }}>⬇️</div>
          <WaveDivider position="bottom" color="white" type={1} animated={true} />
        </section>

        <section className="stats-section reveal" style={{
          padding: '4rem 0',
          background: 'white',
          marginTop: '-3rem',
          position: 'relative',
          zIndex: 10
        }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              textAlign: 'center'
            }}>
              <div className="counter zoom-in hover-scale">
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#667eea' }}>
                  {counters.properties.toLocaleString()}+
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem' }}>Properties</div>
              </div>
              <div className="counter zoom-in hover-scale" style={{ animationDelay: '0.1s' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#667eea' }}>
                  {counters.bookings.toLocaleString()}+
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem' }}>Bookings</div>
              </div>
              <div className="counter zoom-in hover-scale" style={{ animationDelay: '0.2s' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#667eea' }}>
                  {counters.customers.toLocaleString()}+
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem' }}>Happy Customers</div>
              </div>
              <div className="counter zoom-in hover-scale" style={{ animationDelay: '0.3s' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#667eea' }}>
                  {counters.cities}+
                </div>
                <div style={{ color: '#666', fontSize: '1.1rem' }}>Cities</div>
              </div>
            </div>
          </div>
        </section>

        <section className="recent-activity" style={{
          padding: '1rem 0',
          background: '#f8f9fa',
          borderTop: '1px solid #e0e0e0',
          borderBottom: '1px solid #e0e0e0',
          overflow: 'hidden'
        }}>
          <div className="ticker" style={{
            display: 'flex',
            gap: '3rem',
            whiteSpace: 'nowrap'
          }}>
            {[...dummyRecentActivities, ...dummyRecentActivities].map((activity, index) => (
              <span key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                🔔 <strong>{activity.user}</strong> {activity.action} {activity.property} - {activity.time}
              </span>
            ))}
          </div>
        </section>

        <section className="featured-properties reveal" style={{ padding: '4rem 0 8rem 0', background: '#f8f9fa', position: 'relative', overflow: 'hidden' }}>
          <div className="container">
            <h2 className="section-title" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>
              Featured Properties ⭐
            </h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem' }}>
              Handpicked properties just for you
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {featuredProperties.map((property) => (
                <div key={property.id} className="stagger-item hover-scale hover-shadow" style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    height: '200px',
                    background: `url(${property.images[0]}) center/cover`,
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: '#667eea',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      {property.category}
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{property.name}</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      📍 {property.city}, {property.province}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                          Rp {property.price.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#999' }}>per month</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#ffa500', fontSize: '1.1rem' }}>
                          ⭐ {property.rating}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#999' }}>
                          ({property.reviews_count} reviews)
                        </div>
                      </div>
                    </div>
                    <Link to={`/properties/${property.id}`} style={{
                      display: 'block',
                      marginTop: '1rem',
                      padding: '0.75rem',
                      background: '#667eea',
                      color: 'white',
                      textAlign: 'center',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease'
                    }}>
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <WaveDivider position="bottom" color="white" type={2} />
        </section>

        <section className="features reveal" style={{ padding: '8rem 0', background: 'white', position: 'relative', overflow: 'hidden' }}>
          <WaveDivider position="top" color="#f8f9fa" type={2} />
          <div className="container">
            <h2 className="section-title" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>
              Why Choose Us? 🎯
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem'
            }}>
              {dummyFeatures.map((feature, index) => (
                <div key={index} className="feature-card stagger-item hover-lift" style={{
                  textAlign: 'center',
                  padding: '2rem',
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}>
                  <div className="bounce" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{feature.title}</h3>
                  <p style={{ color: '#666' }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          <WaveDivider position="bottom" color="#667eea" type={3} />
        </section>

        <section className="testimonials reveal" style={{
          padding: '8rem 0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <WaveDivider position="top" color="white" type={3} />
          <div className="container">
            <h2 className="section-title" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>
              What Our Customers Say 💬
            </h2>
            <p style={{ textAlign: 'center', marginBottom: '3rem', opacity: 0.9 }}>
              Real reviews from real customers
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {dummyTestimonials.slice(0, 3).map((testimonial) => (
                <div key={testimonial.id} className="stagger-item hover-scale" style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <img src={testimonial.avatar} alt={testimonial.name} style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      border: '2px solid white'
                    }} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{testimonial.name}</div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                        {'⭐'.repeat(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                  <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
                    &ldquo;{testimonial.comment}&rdquo;
                  </p>
                  <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                    📌 {testimonial.property}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <WaveDivider position="bottom" color="white" type={4} />
        </section>

        <section className="how-it-works reveal" style={{ padding: '8rem 0', background: 'white', position: 'relative', overflow: 'hidden' }}>
          <WaveDivider position="top" color="#667eea" type={4} />
          <div className="container">
            <h2 className="section-title" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>
              How It Works 🚀
            </h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem' }}>
              Simple and easy booking process
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem'
            }}>
              {[
                { num: 1, title: 'Browse', desc: 'Search and filter properties based on your preferences', icon: '🔍' },
                { num: 2, title: 'Select', desc: 'Choose your preferred property and check availability', icon: '✅' },
                { num: 3, title: 'Book', desc: 'Fill in your details and submit your booking request', icon: '📝' },
                { num: 4, title: 'Confirm', desc: 'Receive your booking confirmation and reference code', icon: '🎉' }
              ].map((step) => (
                <div key={step.num} className="step stagger-item hover-scale" style={{
                  textAlign: 'center',
                  position: 'relative',
                  padding: '2rem 1rem'
                }}>
                  <div className="rotate-in" style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                  }}>
                    {step.icon}
                  </div>
                  <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{step.title}</h4>
                  <p style={{ color: '#666' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <WaveDivider position="bottom" color="#f8f9fa" type={1} />
        </section>

        <section className="partners reveal" style={{ padding: '5rem 0', background: '#f8f9fa', position: 'relative', overflow: 'hidden' }}>
          <WaveDivider position="top" color="white" type={1} />
          <div className="container">
            <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
              Trusted Payment Partners
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '3rem',
              flexWrap: 'wrap'
            }}>
              {dummyPartners.map((partner) => (
                <div key={partner.id} className="hover-scale stagger-item" style={{
                  fontSize: '3rem',
                  opacity: 0.7,
                  transition: 'all 0.3s ease'
                }}>
                  {partner.logo}
                </div>
              ))}
            </div>
          </div>
          <WaveDivider position="bottom" color="white" type={2} />
        </section>

        <section className="faq reveal" style={{ padding: '8rem 0', background: 'white', position: 'relative', overflow: 'hidden' }}>
          <WaveDivider position="top" color="#f8f9fa" type={2} />
          <div className="container" style={{ maxWidth: '800px' }}>
            <h2 className="section-title" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>
              Frequently Asked Questions ❓
            </h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem' }}>
              Find answers to common questions
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {dummyFAQs.map((faq) => (
                <div key={faq.id} className="stagger-item" style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease'
                }}>
                  <button
                    onClick={() => setActiveFAQ(activeFAQ === faq.id ? null : faq.id)}
                    style={{
                      width: '100%',
                      padding: '1.5rem',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{faq.question}</span>
                    <span style={{
                      transform: activeFAQ === faq.id ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.3s ease'
                    }}>▼</span>
                  </button>
                  {activeFAQ === faq.id && (
                    <div className="slide-up" style={{
                      padding: '0 1.5rem 1.5rem',
                      color: '#666'
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <WaveDivider position="bottom" color="#667eea" type={3} />
        </section>

        <section className="newsletter reveal" style={{
          padding: '8rem 0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <WaveDivider position="top" color="white" type={3} />
          <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <div className="heartbeat" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              📧
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Subscribe to Our Newsletter
            </h2>
            <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
              Get the latest updates, exclusive deals, and special offers delivered to your inbox
            </p>
            <form onSubmit={(e) => e.preventDefault()} style={{
              display: 'flex',
              gap: '1rem',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '50px',
                  border: 'none',
                  fontSize: '1rem'
                }}
              />
              <button type="submit" className="ripple" style={{
                padding: '1rem 2rem',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '50px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}>
                Subscribe
              </button>
            </form>
          </div>
          <WaveDivider position="bottom" color="white" type={4} />
        </section>

        <section className="cta-section reveal" style={{
          padding: '8rem 0',
          background: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <WaveDivider position="top" color="#667eea" type={4} />
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              Ready to Find Your Perfect Rental? 🏡
            </h2>
            <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '2rem' }}>
              Start browsing our extensive collection of properties today
            </p>
            <Link to="/properties" className="btn btn-primary btn-large glow-pulse ripple" style={{
              display: 'inline-block',
              padding: '1.2rem 3rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              borderRadius: '50px',
              fontWeight: 'bold',
              textDecoration: 'none',
              fontSize: '1.2rem',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              Get Started Now →
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
