import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [actionLoading, setActionLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const statusFilter = searchParams.get('status') || '';

  const styles = {
    pageContainer: {
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
    filterSection: {
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      padding: '25px',
      marginBottom: '30px',
    },
    filterLabel: {
      display: 'block',
      marginBottom: '15px',
      color: '#5A2828',
      fontWeight: '600',
      fontSize: '1.1rem',
    },
    filtersContainer: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    },
    filterButton: {
      padding: '10px 20px',
      borderRadius: '30px',
      border: 'none',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: '#f5f5f5',
      color: '#666',
    },
    filterButtonHover: {
      backgroundColor: '#e8e8e8',
      transform: 'translateY(-2px)',
    },
    filterButtonActive: {
      backgroundColor: '#5A2828',
      color: 'white',
    },
    ordersContainer: {
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
    },
    noOrders: {
      padding: '40px',
      textAlign: 'center',
      color: '#777',
      fontSize: '1.1rem',
    },
    tableContainer: {
      width: '100%',
      overflow: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      backgroundColor: '#FFFAF0',
    },
    tableHeaderCell: {
      padding: '15px 20px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '0.95rem',
      color: '#5A2828',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      whiteSpace: 'nowrap',
    },
    tableRow: {
      transition: 'background-color 0.2s ease',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    },
    tableRowHover: {
      backgroundColor: 'rgba(184, 92, 56, 0.03)',
    },
    tableCell: {
      padding: '15px 20px',
      fontSize: '0.95rem',
      color: '#555',
      verticalAlign: 'middle',
    },
    tableCellId: {
      fontWeight: '600',
      color: '#5A2828',
    },
    tableCellDate: {
      color: '#777',
      whiteSpace: 'nowrap',
    },
    tableCellCustomer: {
      fontWeight: '500',
    },
    tableCellAmount: {
      color: '#B85C38',
      fontWeight: '600',
      whiteSpace: 'nowrap',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '600',
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
    actionsCell: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    viewButton: {
      color: '#1976D2',
      textDecoration: 'none',
      fontWeight: '600',
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '0.9rem',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      transition: 'all 0.2s ease',
    },
    viewButtonHover: {
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
    },
    deleteButton: {
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
    deleteButtonHover: {
      backgroundColor: 'rgba(244, 67, 54, 0.2)',
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    statusSelect: {
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      backgroundColor: 'white',
      fontSize: '0.9rem',
      color: '#5A2828',
      cursor: 'pointer',
      fontWeight: '500',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 8px center',
      backgroundSize: '12px',
      paddingRight: '28px',
      appearance: 'none',
    },
    statusSelectFocus: {
      borderColor: '#B85C38',
      boxShadow: '0 0 0 3px rgba(184, 92, 56, 0.1)',
    },
    successMessage: {
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      color: '#388E3C',
      padding: '15px 20px',
      borderRadius: '10px',
      margin: '0 0 20px 0',
      fontSize: '1rem',
      borderLeft: '4px solid #388E3C',
    },
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
      borderLeft: '4px solid #D32F2F',
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/orders`);
      let filteredOrders = response.data;
      if (statusFilter) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
      }
      setOrders(filteredOrders);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setActionLoading(orderId);
      await axios.put(`${BASE_URL}/orders/${orderId}/status`, { status: newStatus });
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setSuccessMessage(`Order #${orderId} status updated to ${newStatus}`);
      setTimeout(() => setSuccessMessage(null), 3000);
      setActionLoading(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
      setActionLoading(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order #${orderId}? This action cannot be undone.`)) {
      return;
    }
    try {
      setActionLoading(orderId);
      await axios.delete(`${BASE_URL}/orders/${orderId}`);
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      setSuccessMessage(`Order #${orderId} has been deleted`);
      setTimeout(() => setSuccessMessage(null), 3000);
      setActionLoading(null);
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order. Please try again.');
      setActionLoading(null);
    }
  };

  const viewOrderDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleFilterChange = (status) => {
    if (status) {
      setSearchParams({ status });
    } else {
      setSearchParams({});
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'processing': return styles.statusProcessing;
      case 'completed': return styles.statusCompleted;
      case 'cancelled': return styles.statusCancelled;
      default: return {};
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Manage Orders</h1>
        <p style={styles.headerSubtitle}>Monitor and update your bakery orders</p>
      </div>
      
      {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
      
      <div style={styles.filterSection}>
        <label style={styles.filterLabel}>Filter by Status:</label>
        <div style={styles.filtersContainer}>
          <button 
            style={{
              ...styles.filterButton,
              ...(statusFilter === '' ? styles.filterButtonActive : {})
            }}
            onClick={() => handleFilterChange('')}
            onMouseOver={e => {
              if (statusFilter !== '') {
                e.target.style.backgroundColor = styles.filterButtonHover.backgroundColor;
                e.target.style.transform = styles.filterButtonHover.transform;
              }
            }}
            onMouseOut={e => {
              if (statusFilter !== '') {
                e.target.style.backgroundColor = styles.filterButton.backgroundColor;
                e.target.style.transform = 'none';
              }
            }}
          >
            All Orders
          </button>
          <button 
            style={{
              ...styles.filterButton,
              ...(statusFilter === 'pending' ? styles.filterButtonActive : {})
            }}
            onClick={() => handleFilterChange('pending')}
            onMouseOver={e => {
              if (statusFilter !== 'pending') {
                e.target.style.backgroundColor = styles.filterButtonHover.backgroundColor;
                e.target.style.transform = styles.filterButtonHover.transform;
              }
            }}
            onMouseOut={e => {
              if (statusFilter !== 'pending') {
                e.target.style.backgroundColor = styles.filterButton.backgroundColor;
                e.target.style.transform = 'none';
              }
            }}
          >
            Pending
          </button>
          <button 
            style={{
              ...styles.filterButton,
              ...(statusFilter === 'processing' ? styles.filterButtonActive : {})
            }}
            onClick={() => handleFilterChange('processing')}
            onMouseOver={e => {
              if (statusFilter !== 'processing') {
                e.target.style.backgroundColor = styles.filterButtonHover.backgroundColor;
                e.target.style.transform = styles.filterButtonHover.transform;
              }
            }}
            onMouseOut={e => {
              if (statusFilter !== 'processing') {
                e.target.style.backgroundColor = styles.filterButton.backgroundColor;
                e.target.style.transform = 'none';
              }
            }}
          >
            Processing
          </button>
          <button 
            style={{
              ...styles.filterButton,
              ...(statusFilter === 'completed' ? styles.filterButtonActive : {})
            }}
            onClick={() => handleFilterChange('completed')}
            onMouseOver={e => {
              if (statusFilter !== 'completed') {
                e.target.style.backgroundColor = styles.filterButtonHover.backgroundColor;
                e.target.style.transform = styles.filterButtonHover.transform;
              }
            }}
            onMouseOut={e => {
              if (statusFilter !== 'completed') {
                e.target.style.backgroundColor = styles.filterButton.backgroundColor;
                e.target.style.transform = 'none';
              }
            }}
          >
            Completed
          </button>
          <button 
            style={{
              ...styles.filterButton,
              ...(statusFilter === 'cancelled' ? styles.filterButtonActive : {})
            }}
            onClick={() => handleFilterChange('cancelled')}
            onMouseOver={e => {
              if (statusFilter !== 'cancelled') {
                e.target.style.backgroundColor = styles.filterButtonHover.backgroundColor;
                e.target.style.transform = styles.filterButtonHover.transform;
              }
            }}
            onMouseOut={e => {
              if (statusFilter !== 'cancelled') {
                e.target.style.backgroundColor = styles.filterButton.backgroundColor;
                e.target.style.transform = 'none';
              }
            }}
          >
            Cancelled
          </button>
        </div>
      </div>
      
      {loading ? (
        <div style={styles.loadingContainer}>Loading orders...</div>
      ) : error ? (
        <div style={styles.errorContainer}>{error}</div>
      ) : orders.length === 0 ? (
        <div style={styles.ordersContainer}>
          <div style={styles.noOrders}>
            <p>No orders found with the selected filter.</p>
          </div>
        </div>
      ) : (
        <div style={styles.ordersContainer}>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>Order ID</th>
                  <th style={styles.tableHeaderCell}>Date</th>
                  <th style={styles.tableHeaderCell}>Customer</th>
                  <th style={styles.tableHeaderCell}>Total Amount</th>
                  <th style={styles.tableHeaderCell}>Status</th>
                  <th style={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr 
                    key={order.id} 
                    style={styles.tableRow}
                    onMouseOver={e => {
                      e.currentTarget.style.backgroundColor = styles.tableRowHover.backgroundColor;
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{...styles.tableCell, ...styles.tableCellId}}>#{order.id}</td>
                    <td style={{...styles.tableCell, ...styles.tableCellDate}}>{formatDate(order.createdAt)}</td>
                    <td style={{...styles.tableCell, ...styles.tableCellCustomer}}>{order.user?.username || 'Unknown'}</td>
                    <td style={{...styles.tableCell, ...styles.tableCellAmount}}>
                      Rp {order.total_amount.toLocaleString()}
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{...styles.statusBadge, ...getStatusStyles(order.status)}}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.actionsCell}>
                        <button 
                          onClick={() => viewOrderDetails(order.id)}
                          style={styles.viewButton}
                          onMouseOver={e => {
                            e.target.style.backgroundColor = styles.viewButtonHover.backgroundColor;
                          }}
                          onMouseOut={e => {
                            e.target.style.backgroundColor = styles.viewButton.backgroundColor;
                          }}
                        >
                          View Details
                        </button>
                        
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={actionLoading === order.id}
                          style={{
                            ...styles.statusSelect,
                            ...(actionLoading === order.id ? styles.disabledButton : {})
                          }}
                          onFocus={e => {
                            if (actionLoading !== order.id) {
                              e.target.style.borderColor = styles.statusSelectFocus.borderColor;
                              e.target.style.boxShadow = styles.statusSelectFocus.boxShadow;
                            }
                          }}
                          onBlur={e => {
                            if (actionLoading !== order.id) {
                              e.target.style.borderColor = '1px solid rgba(0, 0, 0, 0.1)';
                              e.target.style.boxShadow = 'none';
                            }
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          disabled={actionLoading === order.id}
                          style={{
                            ...styles.deleteButton,
                            ...(actionLoading === order.id ? styles.disabledButton : {})
                          }}
                          onMouseOver={e => {
                            if (actionLoading !== order.id) {
                              e.target.style.backgroundColor = styles.deleteButtonHover.backgroundColor;
                            }
                          }}
                          onMouseOut={e => {
                            if (actionLoading !== order.id) {
                              e.target.style.backgroundColor = styles.deleteButton.backgroundColor;
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
