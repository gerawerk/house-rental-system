import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import api from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data?.email || !data?.password) {
      message.error('Please fill all fields');
      return;
    }
    api.post('/user/login', data)
      .then((res) => {
        if (res.data.success) {
          message.success(res.data.message);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          const user = JSON.parse(localStorage.getItem('user'));
          switch (user.type) {
            case 'Admin':
              navigate('/adminhome');
              break;
            case 'Renter':
              navigate('/renterhome');
              break;
            case 'Owner':
              if (user.granted === 'ungranted') {
                message.error('Your account is not yet confirmed by the admin');
              } else {
                navigate('/ownerhome');
              }
              break;
            default:
              navigate('/login');
          }
          setTimeout(() => window.location.reload(), 1000);
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          message.error('Invalid credentials');
        } else {
          message.error('Login failed. Please try again.');
        }
      });
  };

  return (
    <>
      {/* Navbar matching dashboard theme */}
      <nav style={styles.nav}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>
            <i className="ti ti-building-estate" style={{ color: 'var(--text-main)', fontSize: 18 }} />
          </div>
          <span style={styles.brandName}>EasyRent</span>
        </div>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/login" style={styles.navLink}>Login</Link>
          <Link to="/register" style={styles.navLink}>Register</Link>
        </div>
      </nav>

      {/* Login card */}
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.iconWrapper}>
            <i className="ti ti-lock" style={{ fontSize: 40, color: 'var(--accent-color)' }} />
          </div>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your account</p>
          <form onSubmit={handleSubmit} style={styles.form}>
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
            <button type="submit" style={styles.button}>
              Sign In
            </button>
          </form>
          <div style={styles.footer}>
            <Link to="/forgotpassword" style={styles.link}>Forgot password?</Link>
            <span style={{ color: '#7a7568' }}> • </span>
            <Link to="/register" style={styles.link}>Create account</Link>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
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
    width: 32,
    height: 32,
    background: 'var(--accent-color)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22,
    color: 'var(--text-main)',
    letterSpacing: 0.5,
    fontWeight: 600,
  },
  navLinks: { display: 'flex', gap: '1.5rem' },
  navLink: {
    color: 'var(--text-muted)',
    textDecoration: 'none',
    fontSize: 15,
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  container: {
    minHeight: 'calc(100vh - 64px)',
    background: 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 20,
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
    padding: '2rem 2rem 2.5rem',
    width: '100%',
    maxWidth: 480,
    textAlign: 'center',
    border: '1px solid #e8e4dc',
  },
  iconWrapper: {
    width: 70,
    height: 70,
    background: 'var(--bg-primary)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.25rem',
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    color: 'var(--text-main)',
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
    color: 'var(--text-muted)',
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
  button: {
    width: '100%',
    background: 'var(--text-main)',
    color: 'var(--bg-secondary)',
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
    color: 'var(--accent-color)',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
  },
};

// Add hover and focus styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  input:focus {
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

export default Login;