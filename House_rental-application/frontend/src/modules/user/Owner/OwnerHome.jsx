import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../App';
import AddProperty from './AddProperty';
import AllProperties from './AllProperties';
import AllBookings from './AllBookings';

const tabs = [
  { label: 'Add Property',   icon: 'ti-plus' },
  { label: 'All Properties', icon: 'ti-building' },
  { label: 'All Bookings',   icon: 'ti-calendar-check' },
];

const OwnerHome = () => {
  const user = useContext(UserContext);
  const [active, setActive] = useState(0);

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
      {/* ── NAVBAR ── */}
      <nav style={styles.nav}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>
            <i className="ti ti-building-estate" style={{ color: '#1a1a2e', fontSize: 18 }} />
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

      {/* ── TABS ── */}
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

      {/* ── PANELS ── */}
      <div style={styles.content}>
        {active === 0 && <AddProperty />}
        {active === 1 && <AllProperties />}
        {active === 2 && <AllBookings />}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f8f7f4', fontFamily: "'DM Sans', sans-serif" },
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
    width: 32, height: 32,
    background: '#c9a84c',
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  brandName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22, color: '#fff', letterSpacing: 0.5,
  },
  navRight: { display: 'flex', alignItems: 'center', gap: '1.25rem' },
  avatar: {
    width: 34, height: 34, borderRadius: '50%',
    background: '#c9a84c',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 600, fontSize: 13, color: '#1a1a2e',
  },
  greeting: { color: '#e8e4dc', fontSize: 14, fontWeight: 500 },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    color: '#c9a84c', fontSize: 13, fontWeight: 500,
    textDecoration: 'none',
    padding: '6px 14px',
    border: '1px solid #c9a84c',
    borderRadius: 8,
  },
  tabBar: {
    background: '#fff',
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
  tabActive: { borderBottomColor: '#c9a84c', color: '#1a1a2e' },
  content: { padding: '2rem' },
};

export default OwnerHome;
