import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils';

const EditProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username
      }));
    }
  }, [user]);

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '30px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    profileCard: {
      width: '100%',
      maxWidth: '600px',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: '30px',
      textAlign: 'center',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      backgroundColor: '#FFFAF0',
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
      boxSizing: 'border-box',
    },
    formInputFocus: {
      borderColor: '#B85C38',
      boxShadow: '0 0 0 3px rgba(184, 92, 56, 0.1)',
      outline: 'none',
    },
    updateButton: {
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
    updateButtonHover: {
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
    cancelButton: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#f5f5f5',
      color: '#666',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px',
    },
    cancelButtonHover: {
      backgroundColor: '#e0e0e0',
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
    successContainer: {
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      color: '#388E3C',
      padding: '10px 15px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '0.95rem',
      borderLeft: '4px solid #388E3C',
    },
    passwordSection: {
      marginTop: '30px',
      padding: '20px',
      backgroundColor: 'rgba(184, 92, 56, 0.05)',
      borderRadius: '8px',
      border: '1px solid rgba(184, 92, 56, 0.2)',
    },
    sectionTitle: {
      fontSize: '1.2rem',
      color: '#5A2828',
      fontWeight: '600',
      marginBottom: '15px',
    },
    note: {
      fontSize: '0.9rem',
      color: '#666',
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
      padding: '10px 15px',
      borderRadius: '8px',
      marginBottom: '20px',
      borderLeft: '4px solid #FFA000',
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (formData.newPassword && formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }
    
    if (formData.newPassword && !formData.currentPassword) {
      setError('Current password is required to change password');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const updateData = {
        username: formData.username,
      };
      
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      await axios.put(`${BASE_URL}/profile`, updateData);
      
      setSuccess('Profile updated successfully!');
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // If password was changed, logout after 2 seconds
      if (formData.newPassword) {
        setTimeout(() => {
          logout();
          navigate('/login', { 
            state: { message: 'Password changed successfully. Please log in again.' }
          });
        }, 2000);
      }
      
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create keyframes for spinner animation
  const spinnerAnimation = document.createElement('style');
  spinnerAnimation.innerHTML = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  if (!document.head.contains(spinnerAnimation)) {
    document.head.appendChild(spinnerAnimation);
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.profileCard}>
        <div style={styles.cardHeader}>
          <h1 style={styles.headerTitle}>Edit Profile</h1>
          <p style={styles.headerSubtitle}>Update your account information</p>
        </div>
        
        <div style={styles.cardBody}>
          {error && (
            <div style={styles.errorContainer}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={styles.successContainer}>
              {success}
            </div>
          )}
          
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
            
            <div style={styles.passwordSection}>
              <h3 style={styles.sectionTitle}>Change Password</h3>
              <div style={styles.note}>
                Leave password fields empty if you don't want to change your password.
              </div>
              
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
            </div>
            
            <button 
              type="submit" 
              style={styles.updateButton}
              disabled={loading}
              onMouseOver={e => {
                if (!loading) {
                  e.target.style.backgroundColor = styles.updateButtonHover.backgroundColor;
                  e.target.style.transform = styles.updateButtonHover.transform;
                  e.target.style.boxShadow = styles.updateButtonHover.boxShadow;
                }
              }}
              onMouseOut={e => {
                if (!loading) {
                  e.target.style.backgroundColor = styles.updateButton.backgroundColor;
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = styles.updateButton.boxShadow;
                }
              }}
            >
              {loading ? (
                <>
                  <div style={styles.buttonLoader}></div>
                  <span>Updating...</span>
                </>
              ) : 'Update Profile'}
            </button>
            
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
