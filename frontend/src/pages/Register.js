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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const success = await register(formData.email, formData.username, formData.password);
      if (success) {
        navigate('/login', { 
          state: { message: 'Registration successful! Please log in.' }
        });
      }
    } catch (err) {
      console.error('Registration failed:', err);
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
            <path d="M12 4C10.3431 4 9 5.34315 9 7C9 8.65685 10.3431 10 12 10C13.6569 10 15 8.65685 15 7C15 5.34315 13.6569 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 12C15 10.3431 16.3431 9 18 9C19.6569 9 21 10.3431 21 12C21 13.6569 19.6569 15 18 15C16.3431 15 15 13.6569 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 15C6 16.6569 8.68629 18 12 18C15.3137 18 18 16.6569 18 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 15V18C6 19.6569 8.68629 21 12 21C15.3137 21 18 19.6569 18 18V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 style={styles.headerTitle}>Join Sweet Bakery</h1>
          <p style={styles.headerSubtitle}>Create your account to start ordering</p>
          <div style={styles.decorativeElement}></div>
        </div>
        
        <div style={styles.cardBody}>
          <div style={styles.formNote}>
            <svg style={styles.noteIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M12 7L17 12H14V19H10V12H7L12 7Z" fill="currentColor"/>
            </svg>
            Join our bakery family and enjoy fresh baked goods delivered to your door!
          </div>
          
          {error && (
            <div style={styles.errorContainer}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="username">Full Name</label>
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
            </div>
            
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
              <div style={styles.passwordTips}>
                Password should be at least 6 characters long
              </div>
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
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
