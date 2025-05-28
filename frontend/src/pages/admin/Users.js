import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils';
import { AuthContext } from '../../context/AuthContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/users`, {
        withCredentials: true
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    // Don't allow admins to delete themselves
    if (userId === currentUser.id) {
      setError("You cannot delete your own account");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete this user? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setActionLoading(userId);
      await axios.delete(`${BASE_URL}/users/${userId}`, {
        withCredentials: true
      });
      
      // Update users list
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      // Show success message
      setSuccessMessage(`User deleted successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
      
      setActionLoading(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Failed to delete user. Please try again.');
      setTimeout(() => setError(null), 3000);
      setActionLoading(null);
    }
  };

  // Modern bakery design styles
  const styles = {
    pageContainer: {
      padding: '30px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px',
      paddingBottom: '15px',
      borderBottom: '1px solid rgba(184, 92, 56, 0.2)',
    },
    headerTitle: {
      fontSize: '2.5rem',
      color: '#5A2828',
      margin: 0,
      fontWeight: '700',
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      backgroundColor: '#FFFAF0',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    },
    tableHeaderCell: {
      padding: '15px 20px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '1rem',
      color: '#5A2828',
    },
    tableRow: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      transition: 'background-color 0.2s ease',
    },
    tableRowHover: {
      backgroundColor: 'rgba(184, 92, 56, 0.03)',
    },
    tableCell: {
      padding: '15px 20px',
      fontSize: '0.95rem',
      color: '#333',
    },
    userRole: {
      display: 'inline-block',
      padding: '5px 10px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '600',
    },
    adminRole: {
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      color: '#D32F2F',
    },
    customerRole: {
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      color: '#1976D2',
    },
    actionButton: {
      padding: '8px 15px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    deleteButton: {
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      color: '#D32F2F',
    },
    deleteButtonHover: {
      backgroundColor: 'rgba(244, 67, 54, 0.2)',
    },
    deleteButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    loadingContainer: {
      padding: '50px',
      textAlign: 'center',
      color: '#777',
      fontSize: '1.1rem',
    },
    noUsers: {
      textAlign: 'center',
      padding: '30px',
      color: '#777',
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
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>User Management</h1>
      </div>
      
      {error && <div style={styles.errorMessage}>{error}</div>}
      {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
      
      {loading ? (
        <div style={styles.loadingContainer}>Loading users...</div>
      ) : (
        <div style={styles.tableContainer}>
          {users.length === 0 ? (
            <div style={styles.noUsers}>No users found</div>
          ) : (
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>ID</th>
                  <th style={styles.tableHeaderCell}>Username</th>
                  <th style={styles.tableHeaderCell}>Email</th>
                  <th style={styles.tableHeaderCell}>Role</th>
                  <th style={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr 
                    key={user.id} 
                    style={styles.tableRow}
                    onMouseOver={e => {
                      e.currentTarget.style.backgroundColor = styles.tableRowHover.backgroundColor;
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={styles.tableCell}>{user.id}</td>
                    <td style={styles.tableCell}>{user.username}</td>
                    <td style={styles.tableCell}>{user.email}</td>
                    <td style={styles.tableCell}>
                      <span style={{
                        ...styles.userRole, 
                        ...(user.role === 'admin' ? styles.adminRole : styles.customerRole)
                      }}>
                        {user.role === 'admin' ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        style={{
                          ...styles.actionButton,
                          ...styles.deleteButton,
                          ...(actionLoading === user.id || user.id === currentUser.id ? styles.deleteButtonDisabled : {})
                        }}
                        disabled={actionLoading === user.id || user.id === currentUser.id}
                        onMouseOver={e => {
                          if (actionLoading !== user.id && user.id !== currentUser.id) {
                            e.target.style.backgroundColor = styles.deleteButtonHover.backgroundColor;
                          }
                        }}
                        onMouseOut={e => {
                          if (actionLoading !== user.id && user.id !== currentUser.id) {
                            e.target.style.backgroundColor = styles.deleteButton.backgroundColor;
                          }
                        }}
                      >
                        {actionLoading === user.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
