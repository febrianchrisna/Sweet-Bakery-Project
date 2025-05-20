import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    shipping_address: '',
    payment_method: '',
  });
  const navigate = useNavigate();

  const styles = {
    pageContainer: {
      padding: '20px',
      minHeight: '100vh',
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
      marginBottom: '20px',
      fontWeight: '500',
    },
    decorativeLine: {
      width: '80px',
      height: '3px',
      backgroundColor: '#B85C38',
      margin: '0 auto',
      position: 'absolute',
      bottom: '0',
      left: 'calc(50% - 40px)',
    },
    ordersContainer: {
      maxWidth: '900px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '25px',
    },
    orderCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
    },
    orderCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 25px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    },
    orderNumber: {
      fontWeight: '600',
      fontSize: '1.1rem',
      color: '#5A2828',
    },
    orderDate: {
      color: '#888',
      fontSize: '0.9rem',
      marginLeft: '15px',
    },
    orderInfo: {
      display: 'flex',
      alignItems: 'center',
    },
    statusBadge: {
      padding: '6px 14px',
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
    orderSummary: {
      padding: '20px 25px',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      fontSize: '0.95rem',
      color: '#666',
    },
    summaryRowLast: {
      marginBottom: '0',
      paddingTop: '10px',
      borderTop: '1px solid rgba(0, 0, 0, 0.05)',
      fontWeight: '600',
      color: '#5A2828',
      fontSize: '1.05rem',
    },
    viewDetailsBtn: {
      display: 'block',
      width: '100%',
      padding: '15px',
      textAlign: 'center',
      backgroundColor: '#5A2828',
      color: 'white',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      textDecoration: 'none',
    },
    viewDetailsBtnHover: {
      backgroundColor: '#B85C38',
    },
    noOrders: {
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '15px',
      textAlign: 'center',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
    },
    noOrdersText: {
      color: '#666',
      fontSize: '1.1rem',
      marginBottom: '20px',
    },
    startShoppingBtn: {
      display: 'inline-block',
      padding: '12px 25px',
      backgroundColor: '#B85C38',
      color: 'white',
      borderRadius: '8px',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
    },
    startShoppingBtnHover: {
      backgroundColor: '#5A2828',
      transform: 'translateY(-3px)',
      boxShadow: '0 5px 15px rgba(184, 92, 56, 0.3)',
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '50px 0',
      color: '#666',
      fontSize: '1.1rem',
    },
    errorContainer: {
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      color: '#D32F2F',
      padding: '20px',
      borderRadius: '10px',
      margin: '20px 0',
      borderLeft: '4px solid #D32F2F',
    },
    orderActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '15px',
      borderTop: '1px solid rgba(0, 0, 0, 0.05)',
      paddingTop: '15px',
    },
    cancelButton: {
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      color: '#D32F2F',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    cancelButtonHover: {
      backgroundColor: 'rgba(244, 67, 54, 0.2)',
    },
    viewButton: {
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      color: '#1976D2',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center',
    },
    viewButtonHover: {
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    successMessage: {
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      color: '#388E3C',
      padding: '15px 20px',
      borderRadius: '10px',
      margin: '20px 0',
      fontSize: '1rem',
      borderLeft: '4px solid #388E3C',
    },
    editButton: {
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      color: '#1976D2',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    editButtonHover: {
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      width: '500px',
      maxWidth: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
    modalHeader: {
      borderBottom: '2px solid #F9E0C7',
      paddingBottom: '15px',
      marginBottom: '20px',
    },
    modalTitle: {
      fontSize: '1.5rem',
      color: '#5A2828',
      fontWeight: '700',
      margin: 0,
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
    formTextarea: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid #E0E0E0',
      borderRadius: '8px',
      fontSize: '1rem',
      boxSizing: 'border-box',
      minHeight: '100px',
      fontFamily: 'inherit',
      resize: 'vertical',
    },
    formSelect: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid #E0E0E0',
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: '#FFFCF7',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235A2828' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 15px center',
      cursor: 'pointer',
    },
    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '15px',
      marginTop: '25px',
    },
    cancelModalBtn: {
      padding: '10px 20px',
      backgroundColor: '#f5f5f5',
      color: '#666',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    saveButton: {
      padding: '10px 20px',
      backgroundColor: '#1976D2',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
    },
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/user/orders`);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load your orders. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This will permanently delete it from the system.')) return;

    try {
      setActionLoading(orderId);

      // Change from PUT to DELETE request to actually remove the order
      await axios.delete(`${BASE_URL}/user/orders/${orderId}`);

      // Remove the order from the orders list
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));

      setActionLoading(false);
    } catch (err) {
      console.error('Error deleting order:', err);
      setError(err.response?.data?.message || 'Failed to delete order. Please try again.');
      setActionLoading(false);
    }
  };

  const handleEditClick = (order) => {
    setEditingOrderId(order.id);
    setEditFormData({
      shipping_address: order.shipping_address || '',
      payment_method: order.payment_method || '',
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(editingOrderId);

      await axios.put(`${BASE_URL}/user/orders/${editingOrderId}`, editFormData);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === editingOrderId ? { ...order, ...editFormData } : order
        )
      );

      setEditingOrderId(null);
      setActionLoading(null);
    } catch (err) {
      console.error('Error updating order:', err);
      setError(err.response?.data?.message || 'Failed to update order. Please try again.');
      setActionLoading(null);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>My Orders</h1>
        <p style={styles.headerSubtitle}>Track and manage your delicious orders</p>
        <div style={styles.decorativeLine}></div>
      </div>

      {loading && <div style={styles.loadingContainer}>Loading your orders...</div>}

      {error && <div style={styles.errorContainer}>{error}</div>}

      {!loading && !error && orders.length === 0 && (
        <div style={styles.noOrders}>
          <p style={styles.noOrdersText}>You haven't placed any orders yet.</p>
          <Link
            to="/products"
            style={styles.startShoppingBtn}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = styles.startShoppingBtnHover.backgroundColor;
              e.target.style.transform = styles.startShoppingBtnHover.transform;
              e.target.style.boxShadow = styles.startShoppingBtnHover.boxShadow;
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = styles.startShoppingBtn.backgroundColor;
              e.target.style.transform = 'none';
              e.target.style.boxShadow = 'none';
            }}
          >
            Start Shopping
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div style={styles.ordersContainer}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={styles.orderCard}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.orderCardHover.transform;
                e.currentTarget.style.boxShadow = styles.orderCardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.orderCard.boxShadow;
              }}
            >
              <div style={styles.orderHeader}>
                <div style={styles.orderInfo}>
                  <span style={styles.orderNumber}>Order #{order.id}</span>
                  <span style={styles.orderDate}>{formatDate(order.createdAt)}</span>
                </div>

                <div style={{ ...styles.statusBadge, ...getStatusStyles(order.status) }}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              <div style={styles.orderSummary}>
                <div style={styles.summaryRow}>
                  <span>Total Items:</span>
                  <span>{order.order_details?.length || 0}</span>
                </div>

                <div style={styles.summaryRow}>
                  <span>Payment Method:</span>
                  <span>{order.payment_method}</span>
                </div>

                <div style={{ ...styles.summaryRow, ...styles.summaryRowLast }}>
                  <span>Total Amount:</span>
                  <span>Rp {order.total_amount.toLocaleString()}</span>
                </div>

                <div style={styles.orderActions}>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleEditClick(order)}
                      disabled={actionLoading === order.id}
                      style={{
                        ...styles.editButton,
                        ...(actionLoading === order.id ? styles.disabledButton : {}),
                      }}
                      onMouseOver={(e) => {
                        if (actionLoading !== order.id) {
                          e.target.style.backgroundColor = styles.editButtonHover.backgroundColor;
                        }
                      }}
                      onMouseOut={(e) => {
                        if (actionLoading !== order.id) {
                          e.target.style.backgroundColor = styles.editButton.backgroundColor;
                        }
                      }}
                    >
                      Edit Order
                    </button>
                  )}

                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={actionLoading === order.id}
                      style={{
                        ...styles.cancelButton,
                        ...(actionLoading === order.id ? styles.disabledButton : {}),
                      }}
                      onMouseOver={(e) => {
                        if (actionLoading !== order.id) {
                          e.target.style.backgroundColor = styles.cancelButtonHover.backgroundColor;
                        }
                      }}
                      onMouseOut={(e) => {
                        if (actionLoading !== order.id) {
                          e.target.style.backgroundColor = styles.cancelButton.backgroundColor;
                        }
                      }}
                    >
                      {actionLoading === order.id ? 'Processing...' : 'Cancel Order'}
                    </button>
                  )}

                  <Link
                    to={`/orders/${order.id}`}
                    style={styles.viewButton}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = styles.viewButtonHover.backgroundColor;
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = styles.viewButton.backgroundColor;
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingOrderId && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Order #{editingOrderId}</h2>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="shipping_address">Shipping Address</label>
                <textarea
                  id="shipping_address"
                  name="shipping_address"
                  value={editFormData.shipping_address}
                  onChange={handleEditInputChange}
                  style={styles.formTextarea}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="payment_method">Payment Method</label>
                <select
                  id="payment_method"
                  name="payment_method"
                  value={editFormData.payment_method}
                  onChange={handleEditInputChange}
                  style={styles.formSelect}
                  required
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="transfer">Bank Transfer</option>
                </select>
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setEditingOrderId(null)}
                  style={styles.cancelModalBtn}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    ...styles.saveButton,
                    ...(actionLoading ? styles.disabledButton : {}),
                  }}
                >
                  {actionLoading ? 'Processing...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
