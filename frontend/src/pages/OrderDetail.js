import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils';
import { AuthContext } from '../context/AuthContext';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    shipping_address: '',
    payment_method: ''
  });

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
    detailContainer: {
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
    },
    orderHeader: {
      backgroundColor: '#FFFAF0',
      padding: '25px 30px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '15px',
    },
    orderInfo: {
      flex: 1,
    },
    orderNumber: {
      fontSize: '1.4rem',
      color: '#5A2828',
      fontWeight: '700',
      marginBottom: '10px',
    },
    orderDate: {
      color: '#777',
      fontSize: '0.95rem',
    },
    statusBadge: {
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '0.95rem',
      fontWeight: '600',
      textTransform: 'capitalize',
      display: 'inline-block',
      alignSelf: 'flex-start',
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
    sectionTitle: {
      fontSize: '1.2rem',
      color: '#5A2828',
      marginBottom: '15px',
      fontWeight: '600',
      borderBottom: '2px solid #F9E0C7',
      paddingBottom: '10px',
    },
    contentSection: {
      padding: '25px 30px',
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px',
      marginBottom: '30px',
    },
    customerInfo: {
      marginBottom: '30px',
    },
    infoLabel: {
      color: '#777',
      fontSize: '0.9rem',
      marginBottom: '5px',
    },
    infoValue: {
      color: '#333',
      fontSize: '1rem',
    },
    shippingAddress: {
      marginBottom: '30px',
    },
    itemsContainer: {
      borderTop: '1px solid rgba(0, 0, 0, 0.05)',
      padding: '25px 30px',
    },
    itemsList: {
      marginBottom: '20px',
    },
    item: {
      display: 'flex',
      padding: '15px 0',
      borderBottom: '1px solid #F0F0F0',
      alignItems: 'center',
    },
    itemImage: {
      width: '60px',
      height: '60px',
      borderRadius: '8px',
      overflow: 'hidden',
      marginRight: '15px',
      backgroundColor: '#f5f5f5',
    },
    itemDetails: {
      flex: 1,
    },
    itemName: {
      color: '#333',
      fontSize: '1rem',
      marginBottom: '5px',
      fontWeight: '500',
    },
    itemPrice: {
      color: '#B85C38',
      fontSize: '0.95rem',
      fontWeight: '600',
    },
    itemQuantity: {
      backgroundColor: '#F9F9F9',
      padding: '3px 10px',
      borderRadius: '4px',
      marginLeft: '10px',
      fontSize: '0.9rem',
      color: '#555',
    },
    itemSubtotal: {
      color: '#5A2828',
      fontWeight: '600',
      fontSize: '1rem',
      textAlign: 'right',
      whiteSpace: 'nowrap',
    },
    orderSummary: {
      backgroundColor: '#FFFAF0',
      padding: '25px 30px',
      borderTop: '1px solid rgba(0, 0, 0, 0.05)',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px',
      fontSize: '0.95rem',
      color: '#555',
    },
    summaryTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '15px',
      paddingTop: '15px',
      borderTop: '2px dashed #F9E0C7',
      fontWeight: '700',
      fontSize: '1.2rem',
      color: '#5A2828',
    },
    totalAmount: {
      color: '#B85C38',
    },
    actionsContainer: {
      padding: '25px 30px',
      borderTop: '1px solid rgba(0, 0, 0, 0.05)',
      textAlign: 'center',
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '20px',
    },
    cancelButton: {
      display: 'inline-block',
      padding: '12px 25px',
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      color: '#D32F2F',
      borderRadius: '8px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    cancelButtonHover: {
      backgroundColor: 'rgba(244, 67, 54, 0.2)',
      transform: 'translateY(-3px)',
      boxShadow: '0 5px 15px rgba(244, 67, 54, 0.2)',
    },
    disabledButton: {
      opacity: '0.5',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none',
    },
    backBtn: {
      display: 'inline-block',
      padding: '12px 25px',
      backgroundColor: '#5A2828',
      color: 'white',
      borderRadius: '8px',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
    },
    backBtnHover: {
      backgroundColor: '#B85C38',
      transform: 'translateY(-3px)',
      boxShadow: '0 5px 15px rgba(90, 40, 40, 0.2)',
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '50px 0',
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
    },
    successMessage: {
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      color: '#388E3C',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '15px',
      borderLeft: '4px solid #388E3C',
      fontSize: '0.95rem',
    },
    paymentInfo: {
      marginBottom: '30px',
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
    formInput: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid #E0E0E0',
      borderRadius: '8px',
      fontSize: '1rem',
      boxSizing: 'border-box',
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
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/orders/${id}`);
      setOrder(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (order && isEditing) {
      setEditFormData({
        shipping_address: order.shipping_address || '',
        payment_method: order.payment_method || ''
      });
    }
  }, [order, isEditing]);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(true);
      
      await axios.put(`${BASE_URL}/user/orders/${id}`, editFormData);
      
      setOrder(prevOrder => ({
        ...prevOrder,
        ...editFormData
      }));
      
      setSuccessMessage('Order has been successfully updated.');
      setIsEditing(false);
      setActionLoading(false);
      
      setTimeout(() => {
        fetchOrderDetails();
        setSuccessMessage(null);
      }, 2000);
      
    } catch (err) {
      console.error('Error updating order:', err);
      setError(err.response?.data?.message || 'Failed to update order. Please try again.');
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This will permanently delete it from the system.')) return;
    
    try {
      setActionLoading(true);
      
      // Change from PUT to DELETE request to actually remove the order
      await axios.delete(`${BASE_URL}/user/orders/${id}`);
      
      setSuccessMessage('Order has been successfully deleted.');
      setActionLoading(false);
      
      // Redirect to orders page after successful deletion
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
      
    } catch (err) {
      console.error('Error deleting order:', err);
      setError(err.response?.data?.message || 'Failed to delete order. Please try again.');
      setActionLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function for status badge styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'processing': return styles.statusProcessing;
      case 'completed': return styles.statusCompleted;
      case 'cancelled': return styles.statusCancelled;
      default: return {};
    }
  };

  // Check if user can cancel/delete (owner + pending status)
  const canCancelOrder = order && 
    order.status === 'pending' && 
    user && 
    user.id === order.userId;

  // Calculate order total
  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      const itemSubtotal = Number(item.subtotal || (item.price * item.quantity));
      return total + itemSubtotal;
    }, 0);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Order Details</h1>
        <div style={styles.decorativeLine}></div>
      </div>
      {loading ? (
        <div style={styles.loadingContainer}>Loading order details...</div>
      ) : error ? (
        <div style={styles.errorContainer}>{error}</div>
      ) : !order ? (
        <div style={styles.errorContainer}>Order not found.</div>
      ) : (
        <>
          {successMessage && (
            <div style={styles.successMessage}>{successMessage}</div>
          )}
          <div style={styles.detailContainer}>
            <div style={styles.orderHeader}>
              <div style={styles.orderInfo}>
                <h2 style={styles.orderNumber}>Order #{order.id}</h2>
                <p style={styles.orderDate}>Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div style={{...styles.statusBadge, ...getStatusStyle(order.status)}}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>
            <div style={styles.contentSection}>
              <div style={styles.gridContainer}>
                <div style={styles.customerInfo}>
                  <h3 style={styles.sectionTitle}>Customer Information</h3>
                  <p style={styles.infoLabel}>Name</p>
                  <p style={styles.infoValue}>{user.username}</p>
                  <p style={styles.infoLabel}>Email</p>
                  <p style={styles.infoValue}>{user.email}</p>
                </div>
                <div style={styles.shippingAddress}>
                  <h3 style={styles.sectionTitle}>Shipping Address</h3>
                  <p style={styles.infoValue}>{order.shipping_address}</p>
                </div>
                <div style={styles.paymentInfo}>
                  <h3 style={styles.sectionTitle}>Payment Method</h3>
                  <p style={styles.infoValue}>{order.payment_method}</p>
                </div>
              </div>
            </div>
            <div style={styles.itemsContainer}>
              <h3 style={styles.sectionTitle}>Order Items</h3>
              <div style={styles.itemsList}>
                {order.order_details && order.order_details.map((item, index) => (
                  <div key={index} style={styles.item}>
                    <div style={styles.itemImage}>
                      {item.product && item.product.image && (
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          style={{width: '100%', height: '100%', objectFit: 'cover'}}
                        />
                      )}
                    </div>
                    <div style={styles.itemDetails}>
                      <div style={styles.itemName}>
                        {item.product ? item.product.name : 'Product'}
                      </div>
                      <div style={styles.itemPrice}>
                        Rp {item.price?.toLocaleString() || 0}
                        <span style={styles.itemQuantity}>x{item.quantity}</span>
                      </div>
                    </div>
                    <div style={styles.itemSubtotal}>
                      Rp {Number(item.subtotal || (item.price * item.quantity)).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.orderSummary}>
              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>Rp {calculateTotal(order.order_details || []).toLocaleString()}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Tax</span>
                <span>Included</span>
              </div>
              <div style={styles.summaryTotal}>
                <span>Total</span>
                <span style={styles.totalAmount}>Rp {order.total_amount?.toLocaleString() || 0}</span>
              </div>
            </div>
            <div style={styles.actionsContainer}>
              {canCancelOrder && (
                <div style={styles.actionButtons}>
                  <button 
                    onClick={handleCancelOrder}
                    disabled={actionLoading}
                    style={{
                      ...styles.cancelButton,
                      ...(actionLoading ? styles.disabledButton : {})
                    }}
                    onMouseOver={e => {
                      if (!actionLoading) {
                        e.target.style.backgroundColor = styles.cancelButtonHover.backgroundColor;
                        e.target.style.transform = styles.cancelButtonHover.transform;
                        e.target.style.boxShadow = styles.cancelButtonHover.boxShadow;
                      }
                    }}
                    onMouseOut={e => {
                      if (!actionLoading) {
                        e.target.style.backgroundColor = styles.cancelButton.backgroundColor;
                        e.target.style.transform = 'none';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {actionLoading ? 'Processing...' : 'Cancel Order'}
                  </button>
                </div>
              )}
              <Link 
                to="/orders" 
                style={styles.backBtn}
                onMouseOver={e => {
                  e.target.style.backgroundColor = styles.backBtnHover.backgroundColor;
                  e.target.style.transform = styles.backBtnHover.transform;
                  e.target.style.boxShadow = styles.backBtnHover.boxShadow;
                }}
                onMouseOut={e => {
                  e.target.style.backgroundColor = styles.backBtn.backgroundColor;
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderDetail;