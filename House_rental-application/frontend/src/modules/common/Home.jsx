import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import p1 from '../../images/p1.jpg';
import p2 from '../../images/p2.jpg';
import p3 from '../../images/p3.jpg';
import p4 from '../../images/p4.jpg';
import AllPropertiesCards from '../user/AllPropertiesCards';

const Home = () => {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => setIndex(selectedIndex);

  return (
    <>
      {/* ── NAVBAR (same style as dashboard) ── */}
      <nav style={styles.nav}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>
            <i className="ti ti-building-estate" style={{ color: '#1a1a2e', fontSize: 18 }} />
          </div>
          <span style={styles.brandName}>EasyRent</span>
        </div>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/login" style={styles.navLink}>Login</Link>
          <Link to="/register" style={styles.navLink}>Register</Link>
        </div>
      </nav>

      {/* ── HERO CAROUSEL with overlay CTA ── */}
      <div style={styles.carouselWrapper}>
        <Carousel activeIndex={index} onSelect={handleSelect} interval={4000} pause={false}>
          <Carousel.Item>
            <img src={p1} alt="Modern apartment" style={styles.carouselImg} />
            <Carousel.Caption style={styles.caption}>
              <h1>Find Your Dream Home</h1>
              <p>Explore thousands of rental properties across the country</p>
              <Link to="/register">
                <Button variant="outline-light" size="lg" style={styles.ctaBtn}>Get Started</Button>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src={p2} alt="Cozy house" style={styles.carouselImg} />
            <Carousel.Caption style={styles.caption}>
              <h1>Rent with Confidence</h1>
              <p>Verified listings and direct owner communication</p>
              <Link to="/register">
                <Button variant="outline-light" size="lg" style={styles.ctaBtn}>Join Now</Button>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src={p3} alt="Luxury villa" style={styles.carouselImg} />
            <Carousel.Caption style={styles.caption}>
              <h1>List Your Property</h1>
              <p>Reach thousands of potential tenants – it's free to start</p>
              <Link to="/register">
                <Button variant="outline-light" size="lg" style={styles.ctaBtn}>Become an Owner</Button>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src={p4} alt="City skyline" style={styles.carouselImg} />
            <Carousel.Caption style={styles.caption}>
              <h1>EasyRent – Your Home Awaits</h1>
              <p>Simple, secure, and transparent rental management</p>
              <Link to="/register">
                <Button variant="outline-light" size="lg" style={styles.ctaBtn}>Sign Up Free</Button>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        {/* Overlay gradient for readability */}
        <div style={styles.overlay} />
      </div>

      {/* ── PROPERTIES SECTION ── */}
      <div style={styles.propertySection}>
        <Container>
          <div style={styles.sectionHeader}>
            <h2>Properties You Might Like</h2>
            <p>Discover your next home from our curated listings</p>
            <div style={styles.ctaButtons}>
              <Link to="/register">
                <Button variant="outline-primary" style={styles.secondaryBtn}>List Your Property</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" style={styles.primaryBtn}>Start Renting</Button>
              </Link>
            </div>
          </div>
          <AllPropertiesCards />
        </Container>
      </div>
    </>
  );
};

const styles = {
  nav: {
    background: '#1a1a2e',
    borderBottom: '2px solid #c9a84c',
    padding: '0 2rem',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  brandIcon: {
    width: 32,
    height: 32,
    background: '#c9a84c',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22,
    color: '#fff',
    letterSpacing: 0.5,
  },
  navLinks: { display: 'flex', gap: '1.5rem' },
  navLink: {
    color: '#e8e4dc',
    textDecoration: 'none',
    fontSize: 15,
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  carouselWrapper: { position: 'relative' },
  carouselImg: {
    width: '100%',
    height: '70vh',
    objectFit: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  caption: {
    zIndex: 2,
    bottom: '25%',
    textAlign: 'center',
    color: '#fff',
    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  ctaBtn: {
    marginTop: 16,
    borderWidth: 2,
    fontWeight: 600,
    padding: '8px 28px',
    borderRadius: 40,
  },
  propertySection: {
    padding: '60px 0',
    background: '#f8f7f4',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: 40,
  },
  ctaButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  primaryBtn: {
    background: '#c9a84c',
    borderColor: '#c9a84c',
    color: '#1a1a2e',
    fontWeight: 600,
    padding: '8px 24px',
    borderRadius: 40,
  },
  secondaryBtn: {
    borderColor: '#c9a84c',
    color: '#c9a84c',
    fontWeight: 600,
    padding: '8px 24px',
    borderRadius: 40,
  },
};

// Add hover effects with a small style override (inline doesn't support :hover)
// We add a <style> tag in the component or you can add a CSS file.
// For simplicity, we'll add a style tag in the JSX (optional)
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .ti {
    line-height: 1;
  }
  a:hover {
    color: #c9a84c !important;
  }
  .btn-outline-primary:hover {
    background: #c9a84c !important;
    border-color: #c9a84c !important;
    color: #1a1a2e !important;
  }
  .btn-primary:hover {
    background: #b38f3a !important;
    border-color: #b38f3a !important;
  }
`;
document.head.appendChild(styleSheet);

export default Home;