import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils';

const ProfileEdit = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [passwordChangeMode, setPasswordChangeMode] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || ''
      }));
    }
  }, [user]);

  const styles = {
    pageContainer: {
      maxWidth: '700px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
      position: 'relative',
      paddingBottom: '15px',
    },
    headerTitle: {
      fontSize: '2.5rem',
      color: '#5A2828',
      marginBottom: '10px',
      fontWeight: '700',
    },
    headerSubtitle: {
      color: '#B85C38',
      fontSize: '1.1rem',
      opacity: '0.8',
    },
    decorativeLine: {
      width: '80px',
      height: '3px',
      backgroundColor: '#B85C38',
      margin: '15px auto 0',
    },
    formCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
    },
    formSection: {
      marginBottom: '30px',
    },
    sectionTitle: {
      fontSize: '1.3rem',
      color: '#5A2828',
      marginBottom: '20px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
    },
    sectionIcon: {
      marginRight: '10px',
      color: '#B85C38',
    },
    formGroup: {
      marginBottom: '20px',
    },
    formLabel: {
      display: 'block',
      marginBottom: '8px',
      color: '#5A2828',
      fontWeight: '500',
      fontSize: '0.95rem',
    },
    formInput: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid #E0E0E0',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'border-color 0.2s ease',
    },
    formInputFocus: {
      borderColor: '#B85C38',
      boxShadow: '0 0 0 3px rgba(184, 92, 56, 0.1)',
      outline: 'none',
    },
    errorContainer: {
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      color: '#D32F2F',
      padding: '15px 20px',
      borderRadius: '10px',
      margin: '0 0 20px 0',
      fontSize: '0.95rem',
      borderLeft: '4px solid #D32F2F',
    },
    successContainer: {
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      color: '#388E3C',
      padding: '15px 20px',
      borderRadius: '10px',
      margin: '0 0 20px 0',
      fontSize: '0.95rem',
      borderLeft: '4px solid #388E3C',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginTop: '30px',
    },
    submitButton: {
      padding: '12px 25px',
      backgroundColor: '#B85C38',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    submitButtonHover: {
      backgroundColor: '#5A2828',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(184, 92, 56, 0.3)',
    },
    cancelButton: {
      padding: '12px 25px',
      backgroundColor: '#f5f5f5',
      color: '#666',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
    cancelButtonHover: {
      backgroundColor: '#e0e0e0',
    },
    passwordToggle: {
      backgroundColor: '#F9F9F9',
      border: '1px solid #E0E0E0',
      borderRadius: '8px',
      padding: '12px 15px',
      width: '100%',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      marginBottom: '20px',
      transition: 'all 0.2s ease',
    },
    passwordToggleHover: {
      backgroundColor: '#F0F0F0',
      borderColor: '#D0D0D0',
    },
    passwordToggleText: {
      color: '#5A2828',
      fontWeight: '500',
      fontSize: '0.95rem',
    },
    passwordToggleIcon: {
      fontSize: '1.2rem',
      color: '#B85C38',
      transition: 'transform 0.2s ease',
    },
    passwordToggleIconActive: {
      transform: 'rotate(180deg)',
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handlePasswordToggle = () => {
    setPasswordChangeMode(!passwordChangeMode);
    // Reset password fields when toggling
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation for password change
      if (passwordChangeMode) {
        if (!formData.currentPassword) {
          throw new Error('Current password is required');
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        
        if (formData.newPassword && formData.newPassword.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
      }

      // Prepare request body based on which mode we're in
      const requestBody = {
        username: formData.username,
      };

      if (passwordChangeMode) {
        requestBody.currentPassword = formData.currentPassword;
        requestBody.newPassword = formData.newPassword;
      }

      // Send update request
      const response = await updateProfile(requestBody);
      
      setSuccessMessage('Profile updated successfully');
      
      // Jika ada perubahan password, tunggu 2 detik lalu arahkan ke halaman login
      // Jika hanya perubahan username, tidak perlu logout
      if (passwordChangeMode) {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to update profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Edit Profile</h1>
        <p style={styles.headerSubtitle}>Update your account information</p>
        <div style={styles.decorativeLine}></div>
      </div>

      <div style={styles.formCard}>
        {error && <div style={styles.errorContainer}>{error}</div>}
        {successMessage && <div style={styles.successContainer}>{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formSection}>
            <h2 style={styles.sectionTitle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={styles.sectionIcon}>
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 21C20 18.8783 19.1571 16.8434 17.6569 15.3431C16.1566 13.8429 14.1217 13 12 13C9.87827 13 7.84344 13.8429 6.34315 15.3431C4.84285 16.8434 4 18.8783 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Basic Information
            </h2>
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
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Email Address</label>
              <input
                type="text"
                value={user?.email}
                disabled
                style={{...styles.formInput, backgroundColor: '#F9F9F9'}}
              />
              <div style={{fontSize: '0.9rem', color: '#777', marginTop: '6px'}}>
                Email address cannot be changed
              </div>
            </div>
          </div>

          <div style={styles.formSection}>
            <button
              type="button"
              style={styles.passwordToggle}
              onClick={handlePasswordToggle}
              onMouseOver={e => {
                e.target.style.backgroundColor = styles.passwordToggleHover.backgroundColor;
                e.target.style.borderColor = styles.passwordToggleHover.borderColor;
              }}
              onMouseOut={e => {
                e.target.style.backgroundColor = styles.passwordToggle.backgroundColor;
                e.target.style.borderColor = styles.passwordToggle.borderColor;
              }}
            >
              <span style={styles.passwordToggleText}>Change Password</span>
              <span style={{
                ...styles.passwordToggleIcon, 
                ...(passwordChangeMode ? styles.passwordToggleIconActive : {})
              }}>▼</span>
            </button>

            {passwordChangeMode && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    style={styles.formInput}
                    onFocus={e => e.target.style.boxShadow = styles.formInputFocus.boxShadow}
                    onBlur={e => e.target.style.boxShadow = 'none'}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    style={styles.formInput}
                    onFocus={e => e.target.style.boxShadow = styles.formInputFocus.boxShadow}
                    onBlur={e => e.target.style.boxShadow = 'none'}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={styles.formInput}
                    onFocus={e => e.target.style.boxShadow = styles.formInputFocus.boxShadow}
                    onBlur={e => e.target.style.boxShadow = 'none'}
                  />
                </div>
              </>
            )}
          </div>

          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.cancelButton}
              onMouseOver={e => {
                e.target.style.backgroundColor = styles.cancelButtonHover.backgroundColor;
              }}
              onMouseOut={e => {
                e.target.style.backgroundColor = styles.cancelButton.backgroundColor;
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
              onMouseOver={e => {
                if (!loading) {
                  e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor;
                  e.target.style.transform = styles.submitButtonHover.transform;
                  e.target.style.boxShadow = styles.submitButtonHover.boxShadow;
                }
              }}
              onMouseOut={e => {
                if (!loading) {
                  e.target.style.backgroundColor = styles.submitButton.backgroundColor;
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
