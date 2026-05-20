import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import api from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    type: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data?.name || !data?.email || !data?.password || !data?.type) {
      message.error('Please fill all fields');
      return;
    }
    api.post('/user/register', data)
      .then((response) => {
        if (response.data.success) {
          message.success(response.data.message);
          navigate('/login');
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log('Error', error);
        message.error('Registration failed. Please try again.');
      });
  };

  return (
    <>
      {/* Navbar same as dashboard and login */}
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

      {/* Registration card */}
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.iconWrapper}>
            <i className="ti ti-user-plus" style={{ fontSize: 40, color: '#c9a84c' }} />
          </div>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join EasyRent today</p>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Teddy afro"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>I am a</label>
              <select
                name="type"
                value={data.type}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="" disabled>Select user type</option>
                <option value="Renter">Renter (looking for a property)</option>
                <option value="Owner">Owner (I have property to list)</option>
              </select>
            </div>
            <button type="submit" style={styles.button}>
              Sign Up
            </button>
          </form>
          <div style={styles.footer}>
            <span style={{ color: '#7a7568' }}>Already have an account?</span>
            <Link to="/login" style={styles.link}>Sign In</Link>
          </div>
        </div>
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
  container: {
    minHeight: 'calc(100vh - 64px)',
    background: '#f8f7f4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
    padding: '2rem 2rem 2.5rem',
    width: '100%',
    maxWidth: 500,
    textAlign: 'center',
    border: '1px solid #e8e4dc',
  },
  iconWrapper: {
    width: 70,
    height: 70,
    background: '#f0ede8',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.25rem',
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    color: '#1a1a2e',
    marginBottom: 8,
    fontFamily: "'DM Sans', sans-serif",
  },
  subtitle: {
    fontSize: 14,
    color: '#7a7568',
    marginBottom: 32,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: '#4a4a5a',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: 15,
    border: '1px solid #e8e4dc',
    borderRadius: 12,
    outline: 'none',
    transition: 'border 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    fontSize: 15,
    border: '1px solid #e8e4dc',
    borderRadius: 12,
    outline: 'none',
    background: '#fff',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  button: {
    width: '100%',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    padding: '12px',
    fontSize: 16,
    fontWeight: 600,
    borderRadius: 40,
    cursor: 'pointer',
    marginTop: 8,
    transition: 'background 0.2s',
  },
  footer: {
    marginTop: 28,
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
  },
  link: {
    color: '#c9a84c',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
  },
};

// Inject global styles for hover/focus (same as Login)
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  input:focus, select:focus {
    border-color: #c9a84c !important;
    box-shadow: 0 0 0 2px rgba(201,168,76,0.2);
  }
  button:hover {
    background: #2d2d5e !important;
  }
  a:hover {
    text-decoration: underline !important;
  }
`;
document.head.appendChild(styleSheet);

export default Register;