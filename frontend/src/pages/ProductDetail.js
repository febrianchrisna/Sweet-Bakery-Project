import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { BASE_URL } from '../utils';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Modern bakery design styles
  const styles = {
    pageContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    breadcrumbs: {
      marginBottom: '20px',
      fontSize: '0.95rem',
      color: '#777',
    },
    breadcrumbLink: {
      color: '#B85C38',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
    },
    breadcrumbLinkHover: {
      color: '#5A2828',
      textDecoration: 'underline',
    },
    breadcrumbSeparator: {
      margin: '0 8px',
      color: '#999',
    },
    productDetailContainer: {
      display: 'grid',
      gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)',
      gap: '50px',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
    },
    // Image section styles
    imageSection: {
      padding: '30px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to bottom right, #FFF7F0, #FDF6E9)',
      borderRadius: '15px 0 0 15px',
      position: 'relative',
    },
    featuredBadge: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      background: '#B85C38',
      color: 'white',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '600',
      zIndex: 2,
    },
    imageContainer: {
      width: '100%',
      height: '400px',
      overflow: 'hidden',
      borderRadius: '10px',
      boxShadow: '0 10px 30px rgba(90, 40, 40, 0.1)',
    },
    productImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
    },
    productImageHover: {
      transform: 'scale(1.05)',
    },
    // Info section styles
    infoSection: {
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    productName: {
      fontSize: '2.2rem',
      color: '#5A2828',
      marginBottom: '10px',
      fontWeight: '700',
      lineHeight: '1.2',
    },
    productCategory: {
      color: '#B85C38',
      fontSize: '1.1rem',
      marginBottom: '20px',
      textTransform: 'uppercase',
      fontWeight: '600',
      letterSpacing: '1px',
    },
    productPrice: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#B85C38',
      marginBottom: '20px',
    },
    divider: {
      height: '1px',
      background: 'linear-gradient(to right, #F9E0C7, transparent)',
      margin: '20px 0',
    },
    sectionTitle: {
      fontSize: '1.2rem',
      color: '#5A2828',
      fontWeight: '600',
      marginBottom: '10px',
    },
    productDescription: {
      fontSize: '1rem',
      lineHeight: '1.6',
      color: '#555',
      marginBottom: '30px',
    },
    stockInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '25px',
    },
    stockDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#4CAF50', // green for in stock
      marginRight: '5px',
    },
    stockDotOutOfStock: {
      background: '#F44336', // red for out of stock
    },
    inStock: {
      color: '#4CAF50',
      fontWeight: '600',
    },
    outOfStock: {
      color: '#F44336',
      fontWeight: '600',
    },
    actionSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    quantitySelector: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    quantityLabel: {
      color: '#5A2828',
      fontWeight: '600',
      fontSize: '1rem',
      whiteSpace: 'nowrap',
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      background: '#f5f5f5',
      borderRadius: '30px',
      padding: '5px',
    },
    quantityButton: {
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: 'white',
      color: '#5A2828',
      fontWeight: 'bold',
      fontSize: '1.2rem',
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
      margin: '0 15px',
      fontWeight: '600',
      color: '#5A2828',
      fontSize: '1.1rem',
      width: '30px',
      textAlign: 'center',
    },
    quantityInput: {
      width: '50px',
      textAlign: 'center',
      border: '1px solid #ddd',
      borderRadius: '5px',
      padding: '8px 5px',
      fontSize: '1rem',
      appearance: 'textfield',
    },
    actionButtons: {
      display: 'flex',
      gap: '15px',
      marginTop: '10px',
    },
    addToCartBtn: {
      flex: '1',
      padding: '15px 25px',
      backgroundColor: '#B85C38',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      boxShadow: '0 4px 10px rgba(184, 92, 56, 0.2)',
      transition: 'all 0.3s ease',
    },
    addToCartBtnHover: {
      backgroundColor: '#5A2828',
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 15px rgba(184, 92, 56, 0.3)',
    },
    addToCartBtnDisabled: {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none',
    },
    buyNowBtn: {
      padding: '15px 25px',
      backgroundColor: 'white',
      color: '#B85C38',
      border: '2px solid #B85C38',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
    },
    buyNowBtnHover: {
      backgroundColor: 'rgba(184, 92, 56, 0.1)',
      color: '#5A2828',
      borderColor: '#5A2828',
    },
    additionalInfo: {
      marginTop: '30px',
      background: '#FFFAF0',
      padding: '20px',
      borderRadius: '10px',
      fontSize: '0.95rem',
      color: '#666',
    },
    infoIcon: {
      color: '#B85C38',
      marginRight: '8px',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '400px',
      color: '#888',
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
    notification: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#5a2828',
      color: 'white',
      padding: '15px 25px',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      transform: notification.show ? 'translateY(0)' : 'translateY(100px)',
      opacity: notification.show ? 1 : 0,
      transition: 'transform 0.3s ease, opacity 0.3s ease',
    },
    // Responsive styles
    responsiveContainer: {
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
        gap: '0',
      }
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product && quantity > 0 && product.stock > 0) {
      addToCart(product, quantity);
      
      // Show notification
      setNotification({
        show: true,
        message: `${product.name} added to your cart!`
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({
          show: false,
          message: ''
        });
      }, 3000);
    }
  };

  const handleBuyNow = () => {
    if (product && quantity > 0 && product.stock > 0) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Breadcrumbs navigation */}
      <div style={styles.breadcrumbs}>
        <Link 
          to="/" 
          style={styles.breadcrumbLink}
          onMouseOver={e => e.target.style.color = styles.breadcrumbLinkHover.color}
          onMouseOut={e => e.target.style.color = styles.breadcrumbLink.color}
        >
          Home
        </Link>
        <span style={styles.breadcrumbSeparator}>/</span>
        <Link 
          to="/products" 
          style={styles.breadcrumbLink}
          onMouseOver={e => e.target.style.color = styles.breadcrumbLinkHover.color}
          onMouseOut={e => e.target.style.color = styles.breadcrumbLink.color}
        >
          Products
        </Link>
        <span style={styles.breadcrumbSeparator}>/</span>
        <span>{product?.name || 'Product Detail'}</span>
      </div>

      {loading && (
        <div style={styles.loadingContainer}>
          Loading delicious product details...
        </div>
      )}
      
      {error && (
        <div style={styles.errorContainer}>{error}</div>
      )}
      
      {!loading && !error && product && (
        <div style={{
          ...styles.productDetailContainer,
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : styles.productDetailContainer.gridTemplateColumns
        }}>
          {/* Product Image Section */}
          <div style={styles.imageSection}>
            {product.featured && (
              <div style={styles.featuredBadge}>Featured</div>
            )}
            <div style={styles.imageContainer}>
              <img 
                src={product.image || '/images/product-placeholder.jpg'} 
                alt={product.name} 
                style={styles.productImage}
                onMouseOver={e => e.target.style.transform = styles.productImageHover.transform}
                onMouseOut={e => e.target.style.transform = 'none'}
              />
            </div>
          </div>
          
          {/* Product Info Section */}
          <div style={styles.infoSection}>
            <div>
              <h1 style={styles.productName}>{product.name}</h1>
              <p style={styles.productCategory}>{product.category}</p>
              <p style={styles.productPrice}>Rp {product.price.toLocaleString()}</p>
              
              <div style={styles.divider}></div>
              
              <h3 style={styles.sectionTitle}>Description</h3>
              <p style={styles.productDescription}>
                {product.description || `Experience the heavenly taste of our freshly baked ${product.name}. Made with premium ingredients and traditional recipes, this delightful treat is perfect for any occasion.`}
              </p>
              
              <div style={styles.stockInfo}>
                <div style={{
                  ...styles.stockDot,
                  ...(product.stock <= 0 ? styles.stockDotOutOfStock : {})
                }}></div>
                <span style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
                  {product.stock > 0 
                    ? `In Stock (${product.stock} available)` 
                    : 'Out of Stock'
                  }
                </span>
              </div>
            </div>
            
            {product.stock > 0 && (
              <div style={styles.actionSection}>
                <div style={styles.quantitySelector}>
                  <label style={styles.quantityLabel}>Quantity:</label>
                  <div style={styles.quantityControls}>
                    <button 
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      style={{
                        ...styles.quantityButton,
                        ...(quantity <= 1 ? styles.quantityButtonDisabled : {})
                      }}
                      onMouseOver={e => {
                        if (quantity > 1) {
                          e.target.style.backgroundColor = styles.quantityButtonHover.backgroundColor;
                          e.target.style.color = styles.quantityButtonHover.color;
                          e.target.style.transform = styles.quantityButtonHover.transform;
                        }
                      }}
                      onMouseOut={e => {
                        if (quantity > 1) {
                          e.target.style.backgroundColor = styles.quantityButton.backgroundColor;
                          e.target.style.color = styles.quantityButton.color;
                          e.target.style.transform = 'none';
                        }
                      }}
                    >
                      -
                    </button>
                    <span style={styles.quantityValue}>{quantity}</span>
                    <button 
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      style={{
                        ...styles.quantityButton,
                        ...(quantity >= product.stock ? styles.quantityButtonDisabled : {})
                      }}
                      onMouseOver={e => {
                        if (quantity < product.stock) {
                          e.target.style.backgroundColor = styles.quantityButtonHover.backgroundColor;
                          e.target.style.color = styles.quantityButtonHover.color;
                          e.target.style.transform = styles.quantityButtonHover.transform;
                        }
                      }}
                      onMouseOut={e => {
                        if (quantity < product.stock) {
                          e.target.style.backgroundColor = styles.quantityButton.backgroundColor;
                          e.target.style.color = styles.quantityButton.color;
                          e.target.style.transform = 'none';
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div style={styles.actionButtons}>
                  <button 
                    onClick={handleAddToCart}
                    style={styles.addToCartBtn}
                    onMouseOver={e => {
                      e.target.style.backgroundColor = styles.addToCartBtnHover.backgroundColor;
                      e.target.style.transform = styles.addToCartBtnHover.transform;
                      e.target.style.boxShadow = styles.addToCartBtnHover.boxShadow;
                    }}
                    onMouseOut={e => {
                      e.target.style.backgroundColor = styles.addToCartBtn.backgroundColor;
                      e.target.style.transform = 'none';
                      e.target.style.boxShadow = styles.addToCartBtn.boxShadow;
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 20C9 21.1 8.1 22 7 22C5.9 22 5 21.1 5 20C5 18.9 5.9 18 7 18C8.1 18 9 18.9 9 20ZM20 20C20 21.1 19.1 22 18 22C16.9 22 16 21.1 16 20C16 18.9 16.9 18 18 18C19.1 18 20 18.9 20 20ZM8.94 4.24L9.65 8H19.75C20.24 8 20.67 8.29 20.84 8.74C21.02 9.19 20.89 9.71 20.53 10.04L17.07 13.5C16.8 13.77 16.43 13.93 16.04 13.95L9.71 14.43L9.5 16H17.03V18H9C8.24 18 7.62 17.44 7.52 16.69L6.79 12.04L6.35 9.38L5.5 6L3 6V4H6.77C7.34 4 7.84 4.38 7.99 4.92L8.94 4.24Z" fill="currentColor"/>
                    </svg>
                    Add to Cart
                  </button>
                  
                  <button 
                    onClick={handleBuyNow}
                    style={styles.buyNowBtn}
                    onMouseOver={e => {
                      e.target.style.backgroundColor = styles.buyNowBtnHover.backgroundColor;
                      e.target.style.color = styles.buyNowBtnHover.color;
                      e.target.style.borderColor = styles.buyNowBtnHover.borderColor;
                    }}
                    onMouseOut={e => {
                      e.target.style.backgroundColor = styles.buyNowBtn.backgroundColor;
                      e.target.style.color = styles.buyNowBtn.color;
                      e.target.style.borderColor = styles.buyNowBtn.borderColor;
                    }}
                  >
                    Buy Now
                  </button>
                </div>
                
                <div style={styles.additionalInfo}>
                  <span style={styles.infoIcon}>ℹ️</span>
                  Our products are freshly baked daily. Orders placed by 4 PM will be delivered the next business day.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Cart notification */}
      <div style={styles.notification}>
        {notification.message}
      </div>
    </div>
  );
};

export default ProductDetail;
