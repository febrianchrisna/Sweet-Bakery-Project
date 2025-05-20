import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Modern bakery design styles
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '30px 20px',
      position: 'relative',
      overflow: 'hidden',
    },
    backgroundDecoration: {
      position: 'absolute',
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(184, 92, 56, 0.05) 0%, rgba(184, 92, 56, 0) 70%)',
      zIndex: 0,
    },
    topRightDecoration: {
      top: '-200px',
      right: '-200px',
    },
    bottomLeftDecoration: {
      bottom: '-200px',
      left: '-200px',
    },
    registerCard: {
      width: '100%',
      maxWidth: '500px',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 1,
    },
    cardHeader: {
      padding: '30px',
      textAlign: 'center',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      position: 'relative',
    },
    bakeryIcon: {
      width: '60px',
      height: '60px',
      margin: '0 auto 15px',
      display: 'block',
      color: '#B85C38',
    },
    headerTitle: {
      fontSize: '2rem',
      color: '#5A2828',
      fontWeight: '700',
      margin: '0 0 10px 0',
    },
    headerSubtitle: {
      color: '#B85C38',
      fontSize: '1rem',
      opacity: '0.9',
      margin: '0',
    },
    decorativeElement: {
      position: 'absolute',
      width: '150px',
      height: '10px',
      background: 'linear-gradient(90deg, rgba(184, 92, 56, 0) 0%, rgba(184, 92, 56, 0.3) 50%, rgba(184, 92, 56, 0) 100%)',
      borderRadius: '10px',
      bottom: '15px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    cardBody: {
      padding: '30px',
    },
    formGroup: {
      marginBottom: '25px',
    },
    formLabel: {
      display: 'block',
      marginBottom: '8px',
      color: '#5A2828',
      fontWeight: '600',
      fontSize: '0.95rem',
    },
    formInput: {
      width: '100%',
      padding: '14px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
    },
    formInputFocus: {
      borderColor: '#B85C38',
      boxShadow: '0 0 0 3px rgba(184, 92, 56, 0.1)',
      outline: 'none',
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    registerButton: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#B85C38',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 4px 10px rgba(184, 92, 56, 0.2)',
    },
    registerButtonHover: {
      backgroundColor: '#5A2828',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(184, 92, 56, 0.3)',
    },
    buttonLoader: {
      width: '20px',
      height: '20px',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
      borderTopColor: 'white',
      animation: 'spin 1s linear infinite',
      marginRight: '10px',
    },
    loginLink: {
      marginTop: '20px',
      textAlign: 'center',
      color: '#666',
      fontSize: '0.95rem',
    },
    linkHighlight: {
      color: '#B85C38',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'color 0.2s',
    },
    linkHighlightHover: {
      color: '#5A2828',
      textDecoration: 'underline',
    },
    errorContainer: {
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      color: '#D32F2F',
      padding: '10px 15px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '0.95rem',
      borderLeft: '4px solid #D32F2F',
    },
    passwordTips: {
      fontSize: '0.85rem',
      color: '#777',
      marginTop: '5px',
      fontStyle: 'italic',
    },
    formNote: {
      fontSize: '0.9rem',
      color: '#666',
      backgroundColor: 'rgba(184, 92, 56, 0.05)',
      padding: '10px 15px',
      borderRadius: '8px',
      marginBottom: '20px',
      position: 'relative',
      paddingLeft: '30px',
    },
    noteIcon: {
      position: 'absolute',
      left: '10px',
      top: '10px',
      color: '#B85C38',
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Dynamically create keyframes for spinner animation
  const spinnerAnimation = document.createElement('style');
  spinnerAnimation.innerHTML = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(spinnerAnimation);

  return (
    <div style={styles.pageContainer}>
      {/* Background decorations */}
      <div style={{...styles.backgroundDecoration, ...styles.topRightDecoration}}></div>
      <div style={{...styles.backgroundDecoration, ...styles.bottomLeftDecoration}}></div>
      
      <div style={styles.registerCard}>
        <div style={styles.cardHeader}>
          <svg style={styles.bakeryIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 style={styles.headerTitle}>Create Account</h1>
          <p style={styles.headerSubtitle}>Join our bakery community</p>
          <div style={styles.decorativeElement}></div>
        </div>
        
        <div style={styles.cardBody}>
          {error && (
            <div style={styles.errorContainer}>
              {error}
            </div>
          )}
          
          <div style={styles.formNote}>
            <svg style={styles.noteIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Create an account to place orders, save your favorite items, and check your order history.
          </div>
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel} htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={styles.formInput}
                onFocus={e => e.target.style.boxShadow = styles.formInputFocus.boxShadow}
                onBlur={e => e.target.style.boxShadow = 'none'}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel} htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.formInput}
                onFocus={e => e.target.style.boxShadow = styles.formInputFocus.boxShadow}
                onBlur={e => e.target.style.boxShadow = 'none'}
                required
              />
            </div>
            
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.formInput}
                  onFocus={e => e.target.style.boxShadow = styles.formInputFocus.boxShadow}
                  onBlur={e => e.target.style.boxShadow = 'none'}
                  required
                />
                <p style={styles.passwordTips}>At least 8 characters</p>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={styles.formInput}
                  onFocus={e => e.target.style.boxShadow = styles.formInputFocus.boxShadow}
                  onBlur={e => e.target.style.boxShadow = 'none'}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              style={styles.registerButton}
              disabled={loading}
              onMouseOver={e => {
                if (!loading) {
                  e.target.style.backgroundColor = styles.registerButtonHover.backgroundColor;
                  e.target.style.transform = styles.registerButtonHover.transform;
                  e.target.style.boxShadow = styles.registerButtonHover.boxShadow;
                }
              }}
              onMouseOut={e => {
                if (!loading) {
                  e.target.style.backgroundColor = styles.registerButton.backgroundColor;
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = styles.registerButton.boxShadow;
                }
              }}
            >
              {loading ? (
                <>
                  <div style={styles.buttonLoader}></div>
                  <span>Creating Account...</span>
                </>
              ) : 'Create Account'}
            </button>
          </form>
          
          <div style={styles.loginLink}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={styles.linkHighlight}
              onMouseOver={e => {
                e.target.style.color = styles.linkHighlightHover.color;
                e.target.style.textDecoration = styles.linkHighlightHover.textDecoration;
              }}
              onMouseOut={e => {
                e.target.style.color = styles.linkHighlight.color;
                e.target.style.textDecoration = 'none';
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
