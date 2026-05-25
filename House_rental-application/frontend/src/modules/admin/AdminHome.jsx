import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import AllUsers from './AllUsers';
import AllProperty from './AllProperty';
import AllBookings from './AllBookings';

const tabs = [
  { label: 'All Users', icon: '👥' },
  { label: 'All Properties', icon: '🏠' },
  { label: 'All Bookings', icon: '📋' },
];

const AdminHome = () => {
  const user = useContext(UserContext);
  const [value, setValue] = useState(0);

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (!user) return null;

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
            <span style={{ fontSize: 18 }}>🏢</span>
          </div>
          <span style={styles.brandName}>EasyRent</span>
          <span style={styles.adminBadge}>Admin</span>
        </div>

        <div style={styles.navRight}>
          <div style={styles.avatar}>{initials}</div>
          <span style={styles.greeting}>Hi, {user.userData.name}</span>
          <Link to="/" onClick={handleLogOut} style={styles.logoutBtn}>
            🚪 Log Out
          </Link>
        </div>
      </nav>

      {/* ── DASHBOARD HEADER ── */}
      <div style={styles.dashboardHeader}>
        <div>
          <h1 style={styles.dashTitle}>Admin Dashboard</h1>
          <p style={styles.dashSub}>Manage users, properties, and bookings from one place</p>
        </div>
        <div style={styles.headerDecor}>
          <div style={styles.decorCircle1}></div>
          <div style={styles.decorCircle2}></div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={styles.tabBar}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setValue(i)}
            style={{
              ...styles.tab,
              ...(value === i ? styles.tabActive : {}),
            }}
          >
            <span style={{ fontSize: 16 }}>{tab.icon}</span>
            {tab.label}
            {value === i && <div style={styles.tabIndicator}></div>}
          </button>
        ))}
      </div>

      {/* ── PANELS ── */}
      <div style={styles.content}>
        {value === 0 && <AllUsers />}
        {value === 1 && <AllProperty />}
        {value === 2 && <AllBookings />}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  nav: {
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid #eaeaea',
    padding: '0 2rem',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  brandIcon: {
    width: 36, height: 36,
    background: 'linear-gradient(135deg, #c9a84c, #e8c84c)',
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(201,168,76,0.3)',
  },
  brandName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22, color: 'var(--text-main)', letterSpacing: 0.5,
  },
  adminBadge: {
    background: 'linear-gradient(135deg, #c9a84c, #e8c84c)',
    color: 'var(--text-main)',
    fontSize: 10,
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  navRight: { display: 'flex', alignItems: 'center', gap: '1.25rem' },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, #c9a84c, #e8c84c)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 13, color: 'var(--text-main)',
    boxShadow: '0 2px 8px rgba(201,168,76,0.3)',
  },
  greeting: { color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    color: 'var(--accent-color)', fontSize: 13, fontWeight: 500,
    textDecoration: 'none',
    padding: '6px 16px',
    border: '1px solid #c9a84c',
    borderRadius: 10,
    transition: 'all 0.2s',
  },
  dashboardHeader: {
    background: 'var(--text-main)',
    padding: '2.5rem 2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  dashTitle: {
    fontFamily: "'Playfair Display', serif",
    color: 'var(--bg-secondary)',
    fontSize: 32,
    fontWeight: 600,
    marginBottom: 8,
  },
  dashSub: { color: '#a0a0c0', fontSize: 15, margin: 0 },
  headerDecor: { position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)' },
  decorCircle1: {
    width: 120, height: 120, borderRadius: '50%',
    background: 'rgba(201,168,76,0.08)',
    position: 'absolute', right: 0, top: -30,
  },
  decorCircle2: {
    width: 80, height: 80, borderRadius: '50%',
    background: 'rgba(201,168,76,0.05)',
    position: 'absolute', right: 60, top: 20,
  },
  tabBar: {
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid #eaeaea',
    padding: '0 2rem',
    display: 'flex',
    gap: 4,
  },
  tab: {
    padding: '16px 24px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14, fontWeight: 500,
    background: 'none', border: 'none',
    color: 'var(--text-light)',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 8,
    transition: 'all 0.2s',
    position: 'relative',
    borderBottom: '2px solid transparent',
  },
  tabActive: {
    color: 'var(--text-main)',
    borderBottomColor: 'var(--accent-color)',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    background: 'var(--accent-color)',
    borderRadius: 2,
  },
  content: { padding: '2rem' },
};

export default AdminHome;
