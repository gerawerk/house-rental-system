import React, { useState, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { UserContext } from '../../../App';
import AllPropertiesCards from '../AllPropertiesCards';
import AllProperty from './AllProperties';

const tabs = [
  { label: 'All Properties', icon: 'ti-home' },
  { label: 'Booking History', icon: 'ti-calendar-check' },
];

const RenterHome = () => {
  const user = useContext(UserContext);
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'bookings' ? 1 : 0;
  const [active, setActive] = useState(initialTab);

  if (!user) return null;

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const initials = user.userData.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>
            <i className="ti ti-building-estate" style={{ color: 'var(--bg-secondary)', fontSize: 18 }} />
          </div>
          <span style={styles.brandName}>EasyRent</span>
        </div>

        <div style={styles.navRight}>
          <div style={styles.avatar}>{initials}</div>
          <span style={styles.greeting}>Hi, {user.userData.name}</span>
          <Link to="/" onClick={handleLogOut} style={styles.logoutBtn}>
            <i className="ti ti-logout" style={{ fontSize: 14 }} /> Log Out
          </Link>
        </div>
      </nav>

      {/* TABS */}
      <div style={styles.tabBar}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{ ...styles.tab, ...(active === i ? styles.tabActive : {}) }}
          >
            <i className={`ti ${tab.icon}`} style={{ fontSize: 15 }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* PANELS */}
      <div style={styles.content}>
        {active === 0 && <AllPropertiesCards loggedIn={user.userLoggedIn} />}
        {active === 1 && <AllProperty />}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: "'DM Sans', sans-serif" },
  nav: {
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid #eaeaea',
    padding: '0 2rem',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  brandIcon: {
    width: 32, height: 32,
    background: 'var(--accent-color)',
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  brandName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22, color: 'var(--text-main)', letterSpacing: 0.5, fontWeight: 600,
  },
  navRight: { display: 'flex', alignItems: 'center', gap: '1.25rem' },
  avatar: {
    width: 34, height: 34, borderRadius: '50%',
    background: 'var(--accent-color)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 600, fontSize: 13, color: 'var(--bg-secondary)',
  },
  greeting: { color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    color: 'var(--accent-color)', fontSize: 13, fontWeight: 500,
    textDecoration: 'none',
    padding: '6px 14px',
    border: '1px solid #c9a84c',
    borderRadius: 8,
  },
  tabBar: {
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid #e8e4dc',
    padding: '0 2rem',
    display: 'flex',
  },
  tab: {
    padding: '16px 22px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14, fontWeight: 500,
    background: 'none', border: 'none',
    borderBottom: '2px solid transparent',
    color: '#7a7568',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 7,
    transition: 'color 0.2s, border-color 0.2s',
  },
  tabActive: { borderBottomColor: 'var(--accent-color)', color: 'var(--text-main)' },
  content: { padding: '2rem' },
};

export default RenterHome;