import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.section}>
            <h3 style={styles.logo}>EasyRent</h3>
            <p style={styles.description}>
              Find your perfect home with ease. Connect directly with property owners and tenants.
            </p>
          </div>
          <div style={styles.section}>
            <h4 style={styles.heading}>Quick Links</h4>
            <ul style={styles.links}>
              <li><a href="/" style={styles.link}>About Us</a></li>
              <li><a href="/" style={styles.link}>Contact</a></li>
              <li><a href="/" style={styles.link}>Terms & Conditions</a></li>
              <li><a href="/" style={styles.link}>Privacy Policy</a></li>
            </ul>
          </div>
          <div style={styles.section}>
            <h4 style={styles.heading}>Support</h4>
            <ul style={styles.links}>
              <li><a href="/" style={styles.link}>FAQs</a></li>
              <li><a href="/" style={styles.link}>Help Center</a></li>
              <li><a href="/" style={styles.link}>Payment Support</a></li>
            </ul>
          </div>
          <div style={styles.section}>
            <h4 style={styles.heading}>Follow Us</h4>
            <div style={styles.socialIcons}>
              <a href="/" style={styles.socialIcon}>
                <i className="ti ti-brand-facebook" style={{ fontSize: 20 }} />
              </a>
              <a href="/" style={styles.socialIcon}>
                <i className="ti ti-brand-twitter" style={{ fontSize: 20 }} />
              </a>
              <a href="/" style={styles.socialIcon}>
                <i className="ti ti-brand-instagram" style={{ fontSize: 20 }} />
              </a>
              <a href="/" style={styles.socialIcon}>
                <i className="ti ti-brand-linkedin" style={{ fontSize: 20 }} />
              </a>
            </div>
            <p style={styles.copyright}>
              © {new Date().getFullYear()} EasyRent. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: '#1a1a2e',
    color: '#e8e4dc',
    padding: '40px 0 20px',
    borderTop: '2px solid #c9a84c',
    fontFamily: "'DM Sans', sans-serif",
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    marginBottom: '30px',
  },
  section: {
    textAlign: 'left',
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px',
    color: '#fff',
    marginBottom: '12px',
  },
  description: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#a0a0c0',
    marginTop: '8px',
  },
  heading: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '15px',
    color: '#c9a84c',
  },
  links: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  link: {
    color: '#a0a0c0',
    textDecoration: 'none',
    fontSize: '14px',
    lineHeight: '2',
    transition: 'color 0.2s',
  },
  socialIcons: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
  },
  socialIcon: {
    color: '#a0a0c0',
    textDecoration: 'none',
    transition: 'color 0.2s',
    fontSize: '20px',
  },
  copyright: {
    fontSize: '12px',
    color: '#7a7568',
    marginTop: '10px',
  },
};

export default Footer;