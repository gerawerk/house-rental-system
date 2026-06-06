import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import api from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    type: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Validation functions
  const validateName = (name) => {
    if (!name || name.trim() === '') {
      return 'Full Name is required.';
    }
    if (name.trim().length < 3) {
      return 'Full Name must contain at least 3 letters.';
    }
    // Only letters and spaces allowed
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name.trim())) {
      return 'Full Name can only contain letters and spaces.';
    }
    return null;
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === '') {
      return 'Email is required.';
    }
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required.';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number.';
    }
    return null;
  };

  const validateUserType = (type) => {
    if (!type) {
      return 'Please select a user type.';
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Run all validations
    const nameError = validateName(data.name);
    if (nameError) {
      message.error(nameError);
      return;
    }

    const emailError = validateEmail(data.email);
    if (emailError) {
      message.error(emailError);
      return;
    }

    const passwordError = validatePassword(data.password);
    if (passwordError) {
      message.error(passwordError);
      return;
    }

    const typeError = validateUserType(data.type);
    if (typeError) {
      message.error(typeError);
      return;
    }

    // API call
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

      {/* Registration card */}
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.iconWrapper}>
            <i className="ti ti-user-plus" style={{ fontSize: 40, color: 'var(--accent-color)' }} />
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
              <div style={styles.passwordWrapper}>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={styles.passwordInput}
                />
                <span onClick={togglePasswordVisibility} style={styles.passwordToggle}>
                  {passwordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              </div>
              <div style={styles.helperText}>
                Must contain 8+ characters, uppercase, lowercase and a number
              </div>
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
    maxWidth: 500,
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
  passwordWrapper: {
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    width: '100%',
    padding: '12px 40px 12px 16px', // Extra right padding for icon
    fontSize: 15,
    border: '1px solid #e8e4dc',
    borderRadius: 12,
    outline: 'none',
    transition: 'border 0.2s',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
  },
  passwordToggle: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#7a7568',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
  },
  helperText: {
    fontSize: '12px',
    color: '#7a7568',
    marginTop: '6px',
    marginLeft: '4px',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    fontSize: 15,
    border: '1px solid #e8e4dc',
    borderRadius: 12,
    outline: 'none',
    background: 'var(--bg-secondary)',
    cursor: 'pointer',
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