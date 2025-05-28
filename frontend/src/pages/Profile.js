import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext); // Use updateUser from context
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
  
  // Initialize form data with user's current username
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username
      }));
    }
  }, [user]);
  
  // Modern bakery design styles
  const styles = {
    pageContainer: {
      maxWidth: '900px',
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
    decorativeLine: {
      width: '80px',
      height: '3px',
      backgroundColor: '#B85C38',
      margin: '0 auto',
    },
    formContainer: {
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
    },
    formHeader: {
      backgroundColor: '#FFFAF0',
      padding: '25px 30px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    },
    formHeaderTitle: {
      color: '#5A2828',
      fontWeight: '600',
      fontSize: '1.4rem',
      margin: '0',
    },
    formContent: {
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
      fontSize: '1rem',
    },
    formInput: {
      width: '100%',
      padding: '12px 15px',
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
    divider: {
      height: '1px',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      margin: '30px 0',
    },
    sectionTitle: {
      fontSize: '1.2rem',
      color: '#5A2828',
      fontWeight: '600',
      marginBottom: '20px',
    },
    infoText: {
      fontSize: '0.9rem',
      color: '#777',
      marginBottom: '20px',
    },
    formActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '15px',
      marginTop: '30px',
    },
    cancelButton: {
      padding: '12px 20px',
      backgroundColor: '#f5f5f5',
      color: '#666',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    cancelButtonHover: {
      backgroundColor: '#e0e0e0',
    },
    saveButton: {
      padding: '12px 25px',
      backgroundColor: '#B85C38',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButtonHover: {
      backgroundColor: '#5A2828',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(184, 92, 56, 0.3)',
    },
    errorMessage: {
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      color: '#D32F2F',
      padding: '15px 20px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '0.95rem',
      borderLeft: '4px solid #D32F2F',
    },
    successMessage: {
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      color: '#388E3C',
      padding: '15px 20px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '0.95rem',
      borderLeft: '4px solid #388E3C',
    },
    userInfo: {
      marginBottom: '30px',
    },
    userInfoItem: {
      display: 'flex',
      marginBottom: '15px',
    },
    userInfoLabel: {
      width: '120px',
      color: '#777',
      fontSize: '0.95rem',
    },
    userInfoValue: {
      color: '#333',
      fontWeight: '500',
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
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (error) setError(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    // Validate password fields if user is changing password
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        setLoading(false);
        return;
      }
      
      if (!formData.currentPassword) {
        setError('Current password is required to change password');
        setLoading(false);
        return;
      }
    }
    
    try {
      // Prepare data for the API request
      const updateData = {
        username: formData.username
      };
      
      // Include password fields if user is changing password
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
        updateData.currentPassword = formData.currentPassword;
      }
      
      const response = await axios.put(
        `${BASE_URL}/profile`,
        updateData,
        { withCredentials: true }
      );
      
      if (response.data.status === 'Success') {
        // Use the updateUser function from context
        updateUser({
          username: formData.username
        });
        
        // Show success message
        setSuccessMessage('Profile updated successfully');
        
        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Add keyframes for spinner animation
  const spinnerAnimation = document.createElement('style');
  spinnerAnimation.innerHTML = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(spinnerAnimation);
  
  if (!user) {
    return null; // Or a loading state
  }
  
  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>My Profile</h1>
        <div style={styles.decorativeLine}></div>
      </div>
      
      <div style={styles.formContainer}>
        <div style={styles.formHeader}>
          <h2 style={styles.formHeaderTitle}>Profile Settings</h2>
        </div>
        
        <div style={styles.formContent}>
          {successMessage && (
            <div style={styles.successMessage}>{successMessage}</div>
          )}
          
          {error && (
            <div style={styles.errorMessage}>{error}</div>
          )}
          
          <div style={styles.userInfo}>
            <div style={styles.userInfoItem}>
              <div style={styles.userInfoLabel}>Email:</div>
              <div style={styles.userInfoValue}>{user.email}</div>
            </div>
            
            <div style={styles.userInfoItem}>
              <div style={styles.userInfoLabel}>Role:</div>
              <div style={styles.userInfoValue}>{user.role === 'admin' ? 'Administrator' : 'Customer'}</div>
            </div>
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
            
            <div style={styles.divider}></div>
            
            <h3 style={styles.sectionTitle}>Change Password</h3>
            <p style={styles.infoText}>Leave these fields blank if you don't want to change your password.</p>
            
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
            
            <div style={styles.formActions}>
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
                style={styles.saveButton}
                disabled={loading}
                onMouseOver={e => {
                  if (!loading) {
                    e.target.style.backgroundColor = styles.saveButtonHover.backgroundColor;
                    e.target.style.transform = styles.saveButtonHover.transform;
                    e.target.style.boxShadow = styles.saveButtonHover.boxShadow;
                  }
                }}
                onMouseOut={e => {
                  if (!loading) {
                    e.target.style.backgroundColor = styles.saveButton.backgroundColor;
                    e.target.style.transform = 'none';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={styles.buttonLoader}></div>
                    <span>Saving...</span>
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
