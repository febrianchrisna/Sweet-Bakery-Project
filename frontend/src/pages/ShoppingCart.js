import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ShoppingCart = () => {
  const { cartItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  // Modern bakery design styles
  const styles = {
    pageContainer: {
      padding: '30px 20px',
      maxWidth: '1100px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      marginBottom: '40px',
      textAlign: 'center',
      position: 'relative',
      paddingBottom: '15px',
    },
    headerTitle: {
      fontSize: '2.5rem',
      color: '#5A2828',
      margin: '0 0 10px 0',
      fontWeight: '700',
    },
    headerSubtitle: {
      color: '#B85C38',
      fontSize: '1.1rem',
      opacity: '0.9',
      margin: '0 0 15px 0',
    },
    decorativeLine: {
      width: '80px',
      height: '3px',
      backgroundColor: '#B85C38',
      margin: '0 auto',
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 350px',
      gap: '30px',
      alignItems: 'start',
    },
    emptyCart: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      gridColumn: '1 / -1',
    },
    emptyCartMessage: {
      fontSize: '1.2rem',
      color: '#666',
      marginBottom: '25px',
    },
    emptyCartImage: {
      width: '150px',
      height: '150px',
      margin: '0 auto 30px',
      opacity: '0.7',
    },
    browseButton: {
      display: 'inline-block',
      padding: '12px 25px',
      backgroundColor: '#B85C38',
      color: 'white',
      borderRadius: '8px',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 10px rgba(184, 92, 56, 0.2)',
    },
    browseButtonHover: {
      backgroundColor: '#5A2828',
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 15px rgba(184, 92, 56, 0.3)',
    },
    cartItemsContainer: {
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
    },
    cartItemsHeader: {
      backgroundColor: '#FFFAF0',
      padding: '15px 25px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    },
    cartItemsHeaderText: {
      color: '#5A2828',
      fontWeight: '600',
      fontSize: '1.1rem',
      margin: 0,
    },
    cartItemsList: {
      padding: '10px',
    },
    cartItem: {
      display: 'flex',
      padding: '20px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      position: 'relative',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    cartItemHover: {
      backgroundColor: 'rgba(255, 250, 240, 0.5)',
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.03)',
      borderRadius: '8px',
      zIndex: 2,
    },
    itemImage: {
      width: '90px',
      height: '90px',
      borderRadius: '8px',
      overflow: 'hidden',
      marginRight: '20px',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
      flexShrink: 0,
    },
    itemImageInner: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    itemDetails: {
      flex: '1',
    },
    itemName: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#5A2828',
      marginBottom: '5px',
    },
    itemPrice: {
      color: '#B85C38',
      fontSize: '1rem',
      marginBottom: '5px',
    },
    itemSubtotal: {
      fontSize: '0.9rem',
      color: '#777',
    },
    itemPriceHighlight: {
      fontWeight: '600',
      color: '#B85C38',
    },
    itemActions: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      background: '#f5f5f5',
      borderRadius: '30px',
      padding: '5px',
      margin: '5px 0',
    },
    quantityButton: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: 'white',
      color: '#5A2828',
      fontWeight: 'bold',
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
    },
    quantityButtonHover: {
      backgroundColor: '#5A2828',
      color: 'white',
      transform: 'scale(1.05)',
    },
    quantityButtonDisabled: {
      backgroundColor: '#e0e0e0',
      color: '#999',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none',
    },
    quantityValue: {
      margin: '0 12px',
      fontWeight: '600',
      color: '#5A2828',
    },
    removeButton: {
      background: 'none',
      border: 'none',
      color: '#999',
      fontSize: '0.9rem',
      padding: '5px 10px',
      cursor: 'pointer',
      borderRadius: '5px',
      transition: 'all 0.2s ease',
    },
    removeButtonHover: {
      color: '#D32F2F',
      background: 'rgba(244, 67, 54, 0.1)',
    },
    // Cart summary styles
    cartSummary: {
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      position: 'sticky',
      top: '20px',
    },
    summaryHeader: {
      backgroundColor: '#FFFAF0',
      padding: '15px 25px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    },
    summaryHeaderText: {
      color: '#5A2828',
      fontWeight: '600',
      fontSize: '1.1rem',
      margin: 0,
    },
    summaryContent: {
      padding: '25px',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '15px',
    },
    summaryLabel: {
      color: '#666',
    },
    summaryValue: {
      fontWeight: '600',
      color: '#5A2828',
    },
    divider: {
      height: '1px',
      background: 'rgba(0, 0, 0, 0.05)',
      margin: '15px 0',
    },
    summaryTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '25px',
      fontSize: '1.2rem',
    },
    summaryTotalLabel: {
      color: '#5A2828',
      fontWeight: '600',
    },
    summaryTotalValue: {
      color: '#B85C38',
      fontWeight: '700',
    },
    cartActions: {
      marginTop: '20px',
    },
    actionButton: {
      width: '100%',
      padding: '12px 0',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      marginBottom: '10px',
      transition: 'all 0.3s ease',
      display: 'block',
      textAlign: 'center',
      textDecoration: 'none',
    },
    clearCartBtn: {
      backgroundColor: '#F5F5F5',
      color: '#777',
    },
    clearCartBtnHover: {
      backgroundColor: '#E0E0E0',
    },
    checkoutBtn: {
      backgroundColor: '#B85C38',
      color: 'white',
      boxShadow: '0 4px 10px rgba(184, 92, 56, 0.2)',
    },
    checkoutBtnHover: {
      backgroundColor: '#5A2828',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(184, 92, 56, 0.3)',
    },
    loginBtn: {
      backgroundColor: '#B85C38',
      color: 'white',
      boxShadow: '0 4px 10px rgba(184, 92, 56, 0.2)',
    },
    loginBtnHover: {
      backgroundColor: '#5A2828',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(184, 92, 56, 0.3)',
    },
    continueShoppingBtn: {
      backgroundColor: 'transparent',
      color: '#5A2828',
      border: '1px solid #5A2828',
    },
    continueShoppingBtnHover: {
      backgroundColor: 'rgba(90, 40, 40, 0.05)',
    },
    // Responsive styles
    responsiveLayout: {
      '@media (max-width: 768px)': {
        mainContent: {
          gridTemplateColumns: '1fr',
        }
      }
    }
  };

  // Function to handle responsive styling since we can't use media queries in inline styles
  const getResponsiveStyles = () => {
    if (window.innerWidth <= 768) {
      return {
        mainContent: {
          gridTemplateColumns: '1fr',
        }
      };
    }
    return {};
  };

  // Apply responsive styles
  const responsiveMainContent = { 
    ...styles.mainContent,
    ...(window.innerWidth <= 768 ? { gridTemplateColumns: '1fr' } : {})
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Your Shopping Cart</h1>
        <p style={styles.headerSubtitle}>Review your delicious selection before checkout</p>
        <div style={styles.decorativeLine}></div>
      </div>
      
      {cartItems.length === 0 ? (
        <div style={styles.emptyCart}>
          <div style={styles.emptyCartImage}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#B85C38">
              <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={styles.emptyCartMessage}>Your cart is empty. Add some bakery treats!</p>
          <Link 
            to="/products" 
            style={styles.browseButton}
            onMouseOver={e => {
              e.target.style.backgroundColor = styles.browseButtonHover.backgroundColor;
              e.target.style.transform = styles.browseButtonHover.transform;
              e.target.style.boxShadow = styles.browseButtonHover.boxShadow;
            }}
            onMouseOut={e => {
              e.target.style.backgroundColor = styles.browseButton.backgroundColor;
              e.target.style.transform = 'none';
              e.target.style.boxShadow = styles.browseButton.boxShadow;
            }}
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div style={responsiveMainContent}>
          <div style={styles.cartItemsContainer}>
            <div style={styles.cartItemsHeader}>
              <h2 style={styles.cartItemsHeaderText}>Cart Items ({cartItems.length})</h2>
            </div>
            
            <div style={styles.cartItemsList}>
              {cartItems.map(item => (
                <div 
                  key={item.id} 
                  style={styles.cartItem}
                  onMouseOver={e => {
                    e.currentTarget.style.backgroundColor = styles.cartItemHover.backgroundColor;
                    e.currentTarget.style.transform = styles.cartItemHover.transform;
                    e.currentTarget.style.boxShadow = styles.cartItemHover.boxShadow;
                    e.currentTarget.style.borderRadius = styles.cartItemHover.borderRadius;
                    e.currentTarget.style.zIndex = styles.cartItemHover.zIndex;
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderRadius = '0';
                    e.currentTarget.style.zIndex = 1;
                  }}
                >
                  <div style={styles.itemImage}>
                    <img 
                      src={item.image || '/images/product-placeholder.jpg'} 
                      alt={item.name} 
                      style={styles.itemImageInner}
                    />
                  </div>
                  
                  <div style={styles.itemDetails}>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <p style={styles.itemPrice}>
                      Rp {item.price.toLocaleString()} x {item.quantity}
                    </p>
                    <p style={styles.itemSubtotal}>
                      Subtotal: <span style={styles.itemPriceHighlight}>
                        Rp {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  
                  <div style={styles.itemActions}>
                    <div style={styles.quantityControls}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{
                          ...styles.quantityButton,
                          ...(item.quantity <= 1 ? styles.quantityButtonDisabled : {})
                        }}
                        onMouseOver={e => {
                          if (item.quantity > 1) {
                            e.target.style.backgroundColor = styles.quantityButtonHover.backgroundColor;
                            e.target.style.color = styles.quantityButtonHover.color;
                            e.target.style.transform = styles.quantityButtonHover.transform;
                          }
                        }}
                        onMouseOut={e => {
                          if (item.quantity > 1) {
                            e.target.style.backgroundColor = styles.quantityButton.backgroundColor;
                            e.target.style.color = styles.quantityButton.color;
                            e.target.style.transform = 'none';
                          }
                        }}
                      >
                        -
                      </button>
                      <span style={styles.quantityValue}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        style={{
                          ...styles.quantityButton,
                          ...(item.quantity >= item.stock ? styles.quantityButtonDisabled : {})
                        }}
                        onMouseOver={e => {
                          if (item.quantity < item.stock) {
                            e.target.style.backgroundColor = styles.quantityButtonHover.backgroundColor;
                            e.target.style.color = styles.quantityButtonHover.color;
                            e.target.style.transform = styles.quantityButtonHover.transform;
                          }
                        }}
                        onMouseOut={e => {
                          if (item.quantity < item.stock) {
                            e.target.style.backgroundColor = styles.quantityButton.backgroundColor;
                            e.target.style.color = styles.quantityButton.color;
                            e.target.style.transform = 'none';
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      style={styles.removeButton}
                      onMouseOver={e => {
                        e.target.style.color = styles.removeButtonHover.color;
                        e.target.style.background = styles.removeButtonHover.background;
                      }}
                      onMouseOut={e => {
                        e.target.style.color = styles.removeButton.color;
                        e.target.style.background = 'none';
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={styles.cartSummary}>
            <div style={styles.summaryHeader}>
              <h2 style={styles.summaryHeaderText}>Order Summary</h2>
            </div>
            
            <div style={styles.summaryContent}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Total Items:</span>
                <span style={styles.summaryValue}>
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </div>
              
              <div style={styles.divider}></div>
              
              <div style={styles.summaryTotal}>
                <span style={styles.summaryTotalLabel}>Total Price:</span>
                <span style={styles.summaryTotalValue}>
                  Rp {totalPrice.toLocaleString()}
                </span>
              </div>
              
              <div style={styles.cartActions}>
                <button 
                  onClick={clearCart} 
                  style={{...styles.actionButton, ...styles.clearCartBtn}}
                  onMouseOver={e => {
                    e.target.style.backgroundColor = styles.clearCartBtnHover.backgroundColor;
                  }}
                  onMouseOut={e => {
                    e.target.style.backgroundColor = styles.clearCartBtn.backgroundColor;
                  }}
                >
                  Clear Cart
                </button>
                
                {isAuthenticated ? (
                  <Link 
                    to="/checkout" 
                    style={{...styles.actionButton, ...styles.checkoutBtn}}
                    onMouseOver={e => {
                      e.target.style.backgroundColor = styles.checkoutBtnHover.backgroundColor;
                      e.target.style.transform = styles.checkoutBtnHover.transform;
                      e.target.style.boxShadow = styles.checkoutBtnHover.boxShadow;
                    }}
                    onMouseOut={e => {
                      e.target.style.backgroundColor = styles.checkoutBtn.backgroundColor;
                      e.target.style.transform = 'none';
                      e.target.style.boxShadow = styles.checkoutBtn.boxShadow;
                    }}
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    style={{...styles.actionButton, ...styles.loginBtn}}
                    onMouseOver={e => {
                      e.target.style.backgroundColor = styles.loginBtnHover.backgroundColor;
                      e.target.style.transform = styles.loginBtnHover.transform;
                      e.target.style.boxShadow = styles.loginBtnHover.boxShadow;
                    }}
                    onMouseOut={e => {
                      e.target.style.backgroundColor = styles.loginBtn.backgroundColor;
                      e.target.style.transform = 'none';
                      e.target.style.boxShadow = styles.loginBtn.boxShadow;
                    }}
                  >
                    Login to Checkout
                  </Link>
                )}
                
                <Link 
                  to="/products" 
                  style={{...styles.actionButton, ...styles.continueShoppingBtn}}
                  onMouseOver={e => {
                    e.target.style.backgroundColor = styles.continueShoppingBtnHover.backgroundColor;
                  }}
                  onMouseOut={e => {
                    e.target.style.backgroundColor = styles.continueShoppingBtn.backgroundColor;
                  }}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
