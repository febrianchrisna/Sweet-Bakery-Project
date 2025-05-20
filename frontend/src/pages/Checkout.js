import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'cod'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Redirect if cart is empty
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const shippingAddress = `${formData.address}, ${formData.city}, ${formData.postalCode}`;
    
    try {
      setLoading(true);
      setError(null);
      
      // Map cart items to order items format
      const items = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));
      
      // Create order through API
      const response = await axios.post(`${BASE_URL}/orders`, {
        items,
        shipping_address: shippingAddress,
        payment_method: formData.paymentMethod
      });
      
      // On success, clear cart and navigate to success page
      if (response.status === 201) {
        clearCart();
        navigate(`/orders/${response.data.order.id}`);
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(err.response?.data?.message || 'Failed to complete your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Modern bakery design styles
  const styles = {
    page: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    pageTitle: {
      fontSize: '2.5rem',
      color: '#5A2828',
      marginBottom: '30px',
      fontWeight: '700',
      textAlign: 'center',
      position: 'relative',
      paddingBottom: '15px',
    },
    decorativeLine: {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80px',
      height: '3px',
      backgroundColor: '#B85C38',
    },
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.5fr',
      gap: '30px',
      alignItems: 'start',
    },
    orderSummaryCard: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      color: '#5A2828',
      marginBottom: '25px',
      fontWeight: '600',
      borderBottom: '2px solid #F9E0C7',
      paddingBottom: '10px',
    },
    itemsList: {
      margin: '20px 0',
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid #F0F0F0',
    },
    itemName: {
      color: '#555',
      fontSize: '1rem',
    },
    itemPrice: {
      color: '#B85C38',
      fontWeight: '600',
      fontSize: '1rem',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
      padding: '15px 0',
      borderTop: '2px dashed #F9E0C7',
      fontSize: '1.2rem',
    },
    totalLabel: {
      fontWeight: '600',
      color: '#5A2828',
    },
    totalAmount: {
      fontWeight: '700',
      color: '#B85C38',
    },
    formCard: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
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
      backgroundColor: '#FFFCF7',
      transition: 'all 0.2s ease',
    },
    formInputReadOnly: {
      backgroundColor: '#F9F9F9',
      color: '#777',
      border: '1px solid #E0E0E0',
    },
    formTextarea: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid #E0E0E0',
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: '#FFFCF7',
      minHeight: '100px',
      resize: 'vertical',
      fontFamily: 'inherit',
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    paymentOptions: {
      display: 'flex',
      gap: '20px',
      marginTop: '10px',
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '15px',
      border: '1px solid #E0E0E0',
      borderRadius: '8px',
      flex: '1',
      transition: 'all 0.2s ease',
    },
    radioLabelSelected: {
      borderColor: '#B85C38',
      backgroundColor: 'rgba(184, 92, 56, 0.05)',
      boxShadow: '0 0 0 1px #B85C38',
    },
    radioInput: {
      marginRight: '10px',
      accentColor: '#B85C38',
    },
    orderButton: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#B85C38',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '20px',
      boxShadow: '0 4px 10px rgba(184, 92, 56, 0.2)',
      transition: 'all 0.3s ease',
    },
    orderButtonHover: {
      backgroundColor: '#5A2828',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(184, 92, 56, 0.3)',
    },
    orderButtonDisabled: {
      backgroundColor: '#D0A090',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none',
    },
    errorMessage: {
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      color: '#D32F2F',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      borderLeft: '4px solid #D32F2F',
      fontSize: '0.95rem',
    },
    responsiveBreakpoint: {
      '@media (max-width: 768px)': {
        container: {
          gridTemplateColumns: '1fr',
        }
      }
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>
        Checkout
        <div style={styles.decorativeLine}></div>
      </h1>
      
      <div style={{
        ...styles.container,
        gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : styles.container.gridTemplateColumns
      }}>
        <div style={styles.orderSummaryCard}>
          <h2 style={styles.sectionTitle}>Order Summary</h2>
          
          <div style={styles.itemsList}>
            {cartItems.map(item => (
              <div key={item.id} style={styles.item}>
                <span style={styles.itemName}>
                  {item.name} x {item.quantity}
                </span>
                <span style={styles.itemPrice}>
                  Rp {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total:</span>
            <span style={styles.totalAmount}>Rp {totalPrice.toLocaleString()}</span>
          </div>
        </div>
        
        <div style={styles.formCard}>
          <h2 style={styles.sectionTitle}>Shipping Information</h2>
          
          {error && <div style={styles.errorMessage}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Name</label>
              <input 
                type="text"
                value={user.username}
                readOnly
                style={{...styles.formInput, ...styles.formInputReadOnly}}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Email</label>
              <input 
                type="email"
                value={user.email}
                readOnly
                style={{...styles.formInput, ...styles.formInputReadOnly}}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="address" style={styles.formLabel}>Shipping Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={styles.formTextarea}
              />
            </div>
            
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label htmlFor="city" style={styles.formLabel}>City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  style={styles.formInput}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label htmlFor="postalCode" style={styles.formLabel}>Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  style={styles.formInput}
                />
              </div>
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="phone" style={styles.formLabel}>Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={styles.formInput}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Payment Method</label>
              <div style={styles.paymentOptions}>
                <label 
                  className="radio-label"
                  style={{
                    ...styles.radioLabel, 
                    ...(formData.paymentMethod === 'cod' ? styles.radioLabelSelected : {})
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    style={styles.radioInput}
                  />
                  Cash on Delivery
                </label>
                
                <label 
                  className="radio-label"
                  style={{
                    ...styles.radioLabel, 
                    ...(formData.paymentMethod === 'transfer' ? styles.radioLabelSelected : {})
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={formData.paymentMethod === 'transfer'}
                    onChange={handleChange}
                    style={styles.radioInput}
                  />
                  Bank Transfer
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              style={styles.orderButton}
              disabled={loading}
              onMouseOver={e => {
                if (!loading) {
                  e.target.style.backgroundColor = styles.orderButtonHover.backgroundColor;
                  e.target.style.transform = styles.orderButtonHover.transform;
                  e.target.style.boxShadow = styles.orderButtonHover.boxShadow;
                }
              }}
              onMouseOut={e => {
                if (!loading) {
                  e.target.style.backgroundColor = styles.orderButton.backgroundColor;
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = styles.orderButton.boxShadow;
                }
              }}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
