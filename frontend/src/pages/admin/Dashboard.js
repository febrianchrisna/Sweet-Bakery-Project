import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    recentOrders: []
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userError, setUserError] = useState(null);
  const [userDeleteLoading, setUserDeleteLoading] = useState(null);
  const [userDeleteSuccess, setUserDeleteSuccess] = useState(null);

  // Modern bakery design styles
  const styles = {
    dashboardContainer: {
      padding: '30px 20px',
      maxWidth: '1300px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      marginBottom: '40px',
      position: 'relative',
      paddingBottom: '15px',
      borderBottom: '1px solid rgba(184, 92, 56, 0.2)',
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
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '25px',
      marginBottom: '40px',
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
    },
    statCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
    statCardHeader: {
      backgroundColor: '#FFFAF0',
      padding: '20px 25px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    },
    statCardTitle: {
      fontSize: '1.1rem',
      color: '#5A2828',
      fontWeight: '600',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
    },
    statCardIcon: {
      width: '24px',
      height: '24px',
      marginRight: '10px',
      color: '#B85C38',
    },
    statCardBody: {
      padding: '25px',
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    statValue: {
      fontSize: '3rem',
      fontWeight: '700',
      color: '#B85C38',
      marginBottom: '20px',
      textAlign: 'center',
    },
    statLink: {
      display: 'block',
      textAlign: 'center',
      color: '#5A2828',
      textDecoration: 'none',
      fontSize: '0.95rem',
      fontWeight: '600',
      padding: '10px 0',
      borderTop: '1px solid rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease',
    },
    statLinkHover: {
      backgroundColor: 'rgba(184, 92, 56, 0.1)',
      color: '#B85C38',
    },
    // Product stats card specific
    productsCard: {
      borderTop: '4px solid #8AB17D', // Light green
    },
    productsValue: {
      color: '#8AB17D',
    },
    // Total orders card specific
    totalOrdersCard: {
      borderTop: '4px solid #B85C38', // Rustic orange
    },
    totalOrdersValue: {
      color: '#B85C38',
    },
    // Pending orders card specific
    pendingOrdersCard: {
      borderTop: '4px solid #E6B325', // Warm yellow
    },
    pendingOrdersValue: {
      color: '#E6B325',
    },
    // Recent activity section
    recentActivitySection: {
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
    },
    sectionHeader: {
      padding: '20px 25px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      
    },
    sectionTitle: {
      fontSize: '1.3rem',
      color: '#5A2828',
      fontWeight: '600',
      margin: '0',
    },
    viewAllLink: {
      color: '#B85C38',
      textDecoration: 'none',
      fontSize: '0.9rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
    },
    viewAllArrow: {
      marginLeft: '5px',
    },
    sectionContent: {
      padding: '0',
    },
    noOrders: {
      padding: '30px',
      textAlign: 'center',
      color: '#777',
    },
    // Table styles
    tableContainer: {
      width: '100%',
      overflow: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeaderCell: {
      padding: '15px 20px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '0.95rem',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    },
    tableRow: {
      transition: 'background-color 0.2s ease',
    },
    tableRowHover: {
      backgroundColor: 'rgba(184, 92, 56, 0.03)',
    },
    tableCell: {
      padding: '15px 20px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      fontSize: '0.95rem',
      color: '#555',
    },
    tableCellOrder: {
      fontWeight: '600',
      color: '#5A2828',
    },
    tableCellTotal: {
      color: '#B85C38',
      fontWeight: '600',
    },
    statusBadge: {
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '600',
      display: 'inline-block',
      textTransform: 'capitalize',
    },
    statusPending: {
      backgroundColor: 'rgba(255, 193, 7, 0.15)',
      color: '#FFA000',
    },
    statusProcessing: {
      backgroundColor: 'rgba(33, 150, 243, 0.15)',
      color: '#1976D2',
    },
    statusCompleted: {
      backgroundColor: 'rgba(76, 175, 80, 0.15)',
      color: '#388E3C',
    },
    statusCancelled: {
      backgroundColor: 'rgba(244, 67, 54, 0.15)',
      color: '#D32F2F',
    },
    viewDetailsLink: {
      color: '#B85C38',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    },
    viewDetailsLinkHover: {
      color: '#5A2828',
      textDecoration: 'underline',
    },
    // Loading and error states
    loadingContainer: {
      padding: '50px',
      textAlign: 'center',
      color: '#777',
      fontSize: '1.1rem',
    },
    errorContainer: {
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      color: '#D32F2F',
      padding: '20px',
      borderRadius: '10px',
      margin: '20px 0',
      fontSize: '1rem',
    },
    // Add new styles for user management
    userManagementSection: {
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      marginTop: '40px',
    },
    userTableContainer: {
      width: '100%',
      overflow: 'auto',
    },
    userTable: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    userTableHeader: {
      backgroundColor: '#FFFAF0',
    },
    deleteUserButton: {
      padding: '8px 12px',
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      color: '#D32F2F',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '0.9rem',
    },
    deleteUserButtonHover: {
      backgroundColor: 'rgba(244, 67, 54, 0.2)',
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    roleAdmin: {
      backgroundColor: 'rgba(76, 175, 80, 0.15)',
      color: '#388E3C',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '600',
      display: 'inline-block',
    },
    roleCustomer: {
      backgroundColor: 'rgba(33, 150, 243, 0.15)',
      color: '#1976D2',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '600',
      display: 'inline-block',
    },
  };

  const combinedStyles = { ...styles, ...userStyles };

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get products count
      const productsResponse = await axios.get(`${BASE_URL}/products`);
      
      // Get all orders
      const ordersResponse = await axios.get(`${BASE_URL}/orders`);
      
      // Calculate stats
      const allOrders = ordersResponse.data;
      const pendingOrders = allOrders.filter(order => order.status === 'pending');
      const recentOrders = allOrders.slice(0, 5); // Get 5 most recent orders
      
      setStats({
        totalProducts: productsResponse.data.length,
        totalOrders: allOrders.length,
        pendingOrders: pendingOrders.length,
        recentOrders
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError('Failed to load dashboard data. Please try again later.');
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUserError('Failed to load users. Please try again later.');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setUserDeleteLoading(userId);
      await axios.delete(`${BASE_URL}/users/${userId}`);
      
      // Remove user from state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      setUserDeleteSuccess(`User "${username}" deleted successfully`);
      setTimeout(() => setUserDeleteSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setUserError(err.response?.data?.message || 'Failed to delete user. Please try again.');
    } finally {
      setUserDeleteLoading(null);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function for status badge styling
  const getStatusStyles = (status) => {
    switch (status) {
      case 'pending': return combinedStyles.statusPending;
      case 'processing': return combinedStyles.statusProcessing;
      case 'completed': return combinedStyles.statusCompleted;
      case 'cancelled': return combinedStyles.statusCancelled;
      default: return {};
    }
  };

  // Helper function for role badge styling
  const getRoleStyles = (role) => {
    return role === 'admin' ? combinedStyles.roleAdmin : combinedStyles.roleCustomer;
  };

  return (
    <div style={combinedStyles.dashboardContainer}>
      <div style={combinedStyles.header}>
        <h1 style={combinedStyles.headerTitle}>Admin Dashboard</h1>
        <p style={combinedStyles.headerSubtitle}>Welcome back! Here's an overview of your bakery business.</p>
      </div>
      
      {loading && <div style={combinedStyles.loadingContainer}>Loading dashboard data...</div>}
      
      {error && <div style={combinedStyles.errorContainer}>{error}</div>}
      
      {!loading && !error && (
        <>
          <div style={combinedStyles.statsContainer}>
            {/* Products Card */}
            <div 
              style={{...combinedStyles.statCard, ...combinedStyles.productsCard}}
              onMouseOver={e => {
                e.currentTarget.style.transform = combinedStyles.statCardHover.transform;
                e.currentTarget.style.boxShadow = combinedStyles.statCardHover.boxShadow;
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = combinedStyles.statCard.boxShadow;
              }}
            >
              <div style={combinedStyles.statCardHeader}>
                <h3 style={combinedStyles.statCardTitle}>
                  <svg style={combinedStyles.statCardIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7L12 3L4 7M20 7V17L12 21M20 7L12 11M12 21L4 17V7M12 21V11M4 7L12 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Product Inventory
                </h3>
              </div>
              
              <div style={combinedStyles.statCardBody}>
                <div style={{...combinedStyles.statValue, ...combinedStyles.productsValue}}>
                  {stats.totalProducts}
                </div>
                
                <Link 
                  to="/admin/products" 
                  style={combinedStyles.statLink}
                  onMouseOver={e => {
                    e.target.style.backgroundColor = combinedStyles.statLinkHover.backgroundColor;
                    e.target.style.color = combinedStyles.statLinkHover.color;
                  }}
                  onMouseOut={e => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = combinedStyles.statLink.color;
                  }}
                >
                  Manage Products →
                </Link>
              </div>
            </div>
            
            {/* Total Orders Card */}
            <div 
              style={{...combinedStyles.statCard, ...combinedStyles.totalOrdersCard}}
              onMouseOver={e => {
                e.currentTarget.style.transform = combinedStyles.statCardHover.transform;
                e.currentTarget.style.boxShadow = combinedStyles.statCardHover.boxShadow;
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = combinedStyles.statCard.boxShadow;
              }}
            >
              <div style={combinedStyles.statCardHeader}>
                <h3 style={combinedStyles.statCardTitle}>
                  <svg style={combinedStyles.statCardIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Total Orders
                </h3>
              </div>
              
              <div style={combinedStyles.statCardBody}>
                <div style={{...combinedStyles.statValue, ...combinedStyles.totalOrdersValue}}>
                  {stats.totalOrders}
                </div>
                
                <Link 
                  to="/admin/orders" 
                  style={combinedStyles.statLink}
                  onMouseOver={e => {
                    e.target.style.backgroundColor = combinedStyles.statLinkHover.backgroundColor;
                    e.target.style.color = combinedStyles.statLinkHover.color;
                  }}
                  onMouseOut={e => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = combinedStyles.statLink.color;
                  }}
                >
                  View All Orders →
                </Link>
              </div>
            </div>
            
            {/* Pending Orders Card */}
            <div 
              style={{...combinedStyles.statCard, ...combinedStyles.pendingOrdersCard}}
              onMouseOver={e => {
                e.currentTarget.style.transform = combinedStyles.statCardHover.transform;
                e.currentTarget.style.boxShadow = combinedStyles.statCardHover.boxShadow;
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = combinedStyles.statCard.boxShadow;
              }}
            >
              <div style={combinedStyles.statCardHeader}>
                <h3 style={combinedStyles.statCardTitle}>
                  <svg style={combinedStyles.statCardIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Pending Orders
                </h3>
              </div>
              
              <div style={combinedStyles.statCardBody}>
                <div style={{...combinedStyles.statValue, ...combinedStyles.pendingOrdersValue}}>
                  {stats.pendingOrders}
                </div>
                
                <Link 
                  to="/admin/orders?status=pending" 
                  style={combinedStyles.statLink}
                  onMouseOver={e => {
                    e.target.style.backgroundColor = combinedStyles.statLinkHover.backgroundColor;
                    e.target.style.color = combinedStyles.statLinkHover.color;
                  }}
                  onMouseOut={e => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = combinedStyles.statLink.color;
                  }}
                >
                  View Pending Orders →
                </Link>
              </div>
            </div>
          </div>
          
          <div style={combinedStyles.recentActivitySection}>
            <div style={combinedStyles.sectionHeader}>
              <h2 style={combinedStyles.sectionTitle}>Recent Orders</h2>
              <Link to="/admin/orders" style={combinedStyles.viewAllLink}>
                View All <span style={combinedStyles.viewAllArrow}>→</span>
              </Link>
            </div>
            
            <div style={combinedStyles.sectionContent}>
              {stats.recentOrders.length === 0 ? (
                <div style={combinedStyles.noOrders}>No orders yet.</div>
              ) : (
                <div style={combinedStyles.tableContainer}>
                  <table style={combinedStyles.table}>
                    <thead style={combinedStyles.tableHeader}>
                      <tr>
                        <th style={{...combinedStyles.tableHeaderCell, width: '80px'}}>Order ID</th>
                        <th style={combinedStyles.tableHeaderCell}>Date</th>
                        <th style={combinedStyles.tableHeaderCell}>Customer</th>
                        <th style={combinedStyles.tableHeaderCell}>Total</th>
                        <th style={combinedStyles.tableHeaderCell}>Status</th>
                        <th style={{...combinedStyles.tableHeaderCell, width: '100px'}}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map(order => (
                        <tr 
                          key={order.id} 
                          style={combinedStyles.tableRow}
                          onMouseOver={e => {
                            e.currentTarget.style.backgroundColor = combinedStyles.tableRowHover.backgroundColor;
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <td style={{...combinedStyles.tableCell, ...combinedStyles.tableCellOrder}}>#{order.id}</td>
                          <td style={combinedStyles.tableCell}>{formatDate(order.createdAt)}</td>
                          <td style={combinedStyles.tableCell}>{order.user?.username || 'Unknown'}</td>
                          <td style={{...combinedStyles.tableCell, ...combinedStyles.tableCellTotal}}>
                            Rp {order.total_amount.toLocaleString()}
                          </td>
                          <td style={combinedStyles.tableCell}>
                            <span style={{...combinedStyles.statusBadge, ...getStatusStyles(order.status)}}>
                              {order.status}
                            </span>
                          </td>
                          <td style={combinedStyles.tableCell}>
                            <Link 
                              to={`/orders/${order.id}`}
                              style={combinedStyles.viewDetailsLink}
                              onMouseOver={e => {
                                e.target.style.color = combinedStyles.viewDetailsLinkHover.color;
                                e.target.style.textDecoration = combinedStyles.viewDetailsLinkHover.textDecoration;
                              }}
                              onMouseOut={e => {
                                e.target.style.color = combinedStyles.viewDetailsLink.color;
                                e.target.style.textDecoration = 'none';
                              }}
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* User Management Section */}
          <div style={combinedStyles.userManagementSection}>
            <div style={combinedStyles.sectionHeader}>
              <h2 style={combinedStyles.sectionTitle}>User Management</h2>
            </div>
            
            {userError && <div style={combinedStyles.errorContainer}>{userError}</div>}
            {userDeleteSuccess && <div style={combinedStyles.successMessage}>{userDeleteSuccess}</div>}
            
            <div style={combinedStyles.userTableContainer}>
              <table style={combinedStyles.userTable}>
                <thead style={combinedStyles.userTableHeader}>
                  <tr>
                    <th style={combinedStyles.tableHeaderCell}>ID</th>
                    <th style={combinedStyles.tableHeaderCell}>Username</th>
                    <th style={combinedStyles.tableHeaderCell}>Email</th>
                    <th style={combinedStyles.tableHeaderCell}>Role</th>
                    <th style={combinedStyles.tableHeaderCell}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr 
                      key={user.id} 
                      style={combinedStyles.tableRow}
                      onMouseOver={e => {
                        e.currentTarget.style.backgroundColor = combinedStyles.tableRowHover.backgroundColor;
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td style={combinedStyles.tableCell}>{user.id}</td>
                      <td style={combinedStyles.tableCell}>{user.username}</td>
                      <td style={combinedStyles.tableCell}>{user.email}</td>
                      <td style={combinedStyles.tableCell}>
                        <span style={getRoleStyles(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td style={combinedStyles.tableCell}>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          disabled={userDeleteLoading === user.id || user.role === 'admin'}
                          style={{
                            ...combinedStyles.deleteUserButton,
                            ...(userDeleteLoading === user.id || user.role === 'admin' ? combinedStyles.disabledButton : {})
                          }}
                          onMouseOver={e => {
                            if (userDeleteLoading !== user.id && user.role !== 'admin') {
                              e.target.style.backgroundColor = combinedStyles.deleteUserButtonHover.backgroundColor;
                            }
                          }}
                          onMouseOut={e => {
                            if (userDeleteLoading !== user.id && user.role !== 'admin') {
                              e.target.style.backgroundColor = combinedStyles.deleteUserButton.backgroundColor;
                            }
                          }}
                          title={user.role === 'admin' ? "Cannot delete admin users" : ""}
                        >
                          {userDeleteLoading === user.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
