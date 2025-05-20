import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, CATEGORIES } from '../utils';
import { CartContext } from '../context/CartContext';
import cakeHero from '../assets/cake-hero.png'; // Import the cake hero image

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  
  const categories = ['Bread', 'Cake', 'Pastry', 'Cookies', 'Dessert'];

  // Category images mapping
  const categoryImages = {
    'Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'Pastry': 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'Cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'Dessert': 'https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  };
  
  // Modern bakery design styles
  const styles = {
    // Call to action section styles
    ctaSection: {
      backgroundColor: '#5A2828',
      padding: '80px 20px',
      color: 'white',
      textAlign: 'center',
      position: 'relative',
    },
    ctaContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      position: 'relative',
      zIndex: '2',
    },
    ctaTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '20px',
    },
    ctaText: {
      fontSize: '1.2rem',
      lineHeight: '1.6',
      marginBottom: '40px',
      maxWidth: '600px',
      margin: '0 auto 40px',
      opacity: '0.9',
    },
    ctaButton: {
      backgroundColor: 'white',
      color: '#5A2828',
      padding: '14px 30px',
      borderRadius: '30px',
      fontSize: '1.1rem',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      display: 'inline-block',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    },
    ctaButtonHover: {
      backgroundColor: '#FDF6E9',
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    },
    ctaDecoration: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '20px',
      backgroundColor: '#FCF8F5',
      clipPath: 'polygon(0 0, 100% 100%, 100% 0)',
    },
    // Section background styles with connected gradients - updated with reduced top padding
    heroSection: {
      background: 'linear-gradient(180deg, #FFF7F0 0%, #F9E0C7 100%)',
      position: 'relative',
    },
    featuredSection: {
      background: 'linear-gradient(180deg,rgb(250, 250, 250) 0%, #FDF6E9 100%)',
      position: 'relative',
    },
    categoriesSection: {
      padding: '40px 20px 90px', // Reduced top padding from 90px to 40px
      background: 'linear-gradient(180deg, #FDF6E9 0%, #FCF8F5 100%)',
      position: 'relative',
    },
    cardsSection: {
      padding: '40px 20px 90px', // Reduced top padding from 90px to 40px
      background: 'linear-gradient(180deg, #FCF8F5 0%, #FFF7F0 100%)',
      position: 'relative',
    },
    reviewsSection: {
      padding: '40px 20px 90px', // Reduced top padding from 90px to 40px
      background: 'linear-gradient(180deg, #FFF7F0 0%, #FDF6E9 100%)',
      position: 'relative',
    },
    // Enhanced categories section styles - updated with gradient background
    categoriesContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '25px',
      marginTop: '50px',
    },
    categoryCard: {
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.08)',
      position: 'relative',
      backgroundColor: 'white',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      display: 'block',
      transform: 'translateY(0)',
    },
    categoryCardHover: {
      transform: 'translateY(-10px)',
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
    },
    categoryImage: {
      height: '200px',
      width: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
    },
    categoryImageHover: {
      transform: 'scale(1.08)',
    },
    categoryOverlay: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(90, 40, 40, 0.7))',
      opacity: '0.7',
      transition: 'opacity 0.3s ease',
    },
    categoryOverlayHover: {
      opacity: '1',
    },
    categoryContent: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      padding: '20px',
      color: 'white',
      zIndex: '2',
    },
    categoryName: {
      fontSize: '1.4rem',
      fontWeight: '700',
      marginBottom: '5px',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    },
    categoryExplore: {
      fontSize: '0.95rem',
      opacity: '0',
      transform: 'translateX(-10px)',
      transition: 'all 0.3s ease',
      fontWeight: '500',
      color: 'white',
      display: 'inline-block',
    },
    categoryExploreHover: {
      opacity: '1',
      transform: 'translateX(0)',
    },
    categoryIcon: {
      position: 'absolute',
      bottom: '25px',
      right: '20px',
      color: 'white',
      zIndex: '2',
      opacity: '0',
      transform: 'translateX(10px)',
      transition: 'all 0.3s ease',
    },
    categoryIconHover: {
      opacity: '1',
      transform: 'translateX(0)',
    },
    infoCard: {
      backgroundColor: 'white', // Changed from the default to white
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      gap: '20px',
      transition: 'all 0.3s ease',
    },
    infoCardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
    },
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/products?featured=true`);
        setFeaturedProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products. Please try again later.');
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    // Show a subtle confirmation
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerText = `${product.name} added to cart`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 2000);
    }, 100);
  };

  // Typing animation state for hero title
  const fullTitle = "Bring you Happiness through a piece of cake";
  const [typedTitle, setTypedTitle] = useState("");
  
  useEffect(() => {
    let idx = 0;
    setTypedTitle(""); // reset on mount
    const interval = setInterval(() => {
      setTypedTitle(fullTitle.slice(0, idx + 1));
      idx++;
      if (idx === fullTitle.length) clearInterval(interval);
    }, 60); // typing speed in ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section with updated styles */}
      <section
        className="hero-section"
        style={styles.heroSection}
      >
        <div className="hero-content">
          <h1>
            <span>{typedTitle}</span>
            {typedTitle.length < fullTitle.length && (
              <span style={{
                display: 'inline-block',
                width: '1ch',
                animation: 'blink-cursor 1s steps(1) infinite',
                color: '#5a2828'
              }}>|</span>
            )}
          </h1>
          <p>Reach out to us to place an order or ask about our many menu options. We'd love to help you create a memorable dessert experience.</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn order-now-btn">Order Now</Link>
            <Link to="/products" className="btn see-menus-btn">See all menus</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={cakeHero} alt="Delicious Chocolate Cake" />
        </div>
      </section>

      {/* Modernized Featured Products Section with gradient background */}
      <section className="modern-featured-section" style={styles.featuredSection}>
        <div className="section-title-container">
          <h2 className="modern-section-title">Featured Delights</h2>
          <div className="title-decoration">
            <span className="dot"></span>
            <span className="line"></span>
            <span className="dot"></span>
          </div>
          <p className="section-subtitle">Handcrafted with love and premium ingredients</p>
        </div>
        
        {loading && <div className="loading">Loading our delicious treats...</div>}
        
        {error && <div className="error-message">{error}</div>}
        
        {!loading && !error && (
          <div className="modern-products-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="modern-product-card">
                <div className="product-image-container">
                  <Link to={`/products/${product.id}`}>
                    <img 
                      src={product.image || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'} 
                      alt={product.name} 
                      className="modern-product-image"
                    />
                  </Link>
                  <div className="featured-tag">Featured</div>
                </div>
                <div className="modern-product-info">
                  <Link to={`/products/${product.id}`} className="product-name-link">
                    <h3 className="modern-product-name">{product.name}</h3>
                  </Link>
                  <div className="product-meta">
                    <span className="modern-product-category">{product.category}</span>
                    <span className="modern-product-price">Rp {product.price.toLocaleString()}</span>
                  </div>
                  <button 
                    className="modern-add-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="modern-view-all">
          <Link to="/products" className="view-all-btn">
            <span>Explore All Products</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Enhanced Categories Section - already has gradient styling */}
      <section style={styles.categoriesSection}>
        <div style={styles.categoriesContainer}>
          <div className="section-title-container">
            <h2 className="modern-section-title">Our Specialties</h2>
            <div className="title-decoration">
              <span className="dot"></span>
              <span className="line"></span>
              <span className="dot"></span>
            </div>
            <p className="section-subtitle">Discover our range of handcrafted bakery items</p>
          </div>
          
          <div style={styles.categoriesGrid}>
            {categories.map(category => (
              <Link 
                key={category} 
                to={`/products?category=${category}`}
                style={styles.categoryCard}
                onMouseOver={e => {
                  e.currentTarget.style.transform = styles.categoryCardHover.transform;
                  e.currentTarget.style.boxShadow = styles.categoryCardHover.boxShadow;
                  
                  // Find and apply hover effects to child elements
                  const img = e.currentTarget.querySelector('.category-img');
                  if (img) img.style.transform = styles.categoryImageHover.transform;
                  
                  const overlay = e.currentTarget.querySelector('.category-overlay');
                  if (overlay) overlay.style.opacity = styles.categoryOverlayHover.opacity;
                  
                  const explore = e.currentTarget.querySelector('.category-explore');
                  if (explore) {
                    explore.style.opacity = styles.categoryExploreHover.opacity;
                    explore.style.transform = styles.categoryExploreHover.transform;
                  }
                  
                  const icon = e.currentTarget.querySelector('.category-icon');
                  if (icon) {
                    icon.style.opacity = styles.categoryIconHover.opacity;
                    icon.style.transform = styles.categoryIconHover.transform;
                  }
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = styles.categoryCard.transform;
                  e.currentTarget.style.boxShadow = styles.categoryCard.boxShadow;
                  
                  // Reset child elements
                  const img = e.currentTarget.querySelector('.category-img');
                  if (img) img.style.transform = 'none';
                  
                  const overlay = e.currentTarget.querySelector('.category-overlay');
                  if (overlay) overlay.style.opacity = styles.categoryOverlay.opacity;
                  
                  const explore = e.currentTarget.querySelector('.category-explore');
                  if (explore) {
                    explore.style.opacity = styles.categoryExplore.opacity;
                    explore.style.transform = styles.categoryExplore.transform;
                  }
                  
                  const icon = e.currentTarget.querySelector('.category-icon');
                  if (icon) {
                    icon.style.opacity = styles.categoryIcon.opacity;
                    icon.style.transform = styles.categoryIcon.transform;
                  }
                }}
              >
                <img 
                  src={categoryImages[category]} 
                  alt={category} 
                  style={styles.categoryImage}
                  className="category-img"
                />
                
                <div 
                  style={styles.categoryOverlay}
                  className="category-overlay"
                ></div>
                
                <div style={styles.categoryContent}>
                  <h3 style={styles.categoryName}>{category}</h3>
                  <span 
                    style={styles.categoryExplore}
                    className="category-explore"
                  >
                    Browse Collection
                  </span>
                </div>
                
                <div 
                  style={styles.categoryIcon}
                  className="category-icon"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Promise Card Section with gradient background */}
      <section className="cards-section" style={styles.cardsSection}>
        <div className="section-title-container">
          <h2 className="modern-section-title">Why Choose Us</h2>
          <div className="title-decoration">
            <span className="dot"></span>
            <span className="line"></span>
            <span className="dot"></span>
          </div>
        </div>
        
        <div className="cards-container">
          <div 
            className="info-card" 
            style={styles.infoCard}
            onMouseOver={e => {
              e.currentTarget.style.transform = styles.infoCardHover.transform;
              e.currentTarget.style.boxShadow = styles.infoCardHover.boxShadow;
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = styles.infoCard.boxShadow;
            }}
          >
            <div className="card-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#B85C38" strokeWidth="2"/>
                <path d="M7.5 12.5L10.5 15.5L16.5 9.5" stroke="#B85C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="card-content">
              <h3>Premium Quality</h3>
              <p>We use only the finest ingredients, traditional recipes, and bake everything fresh daily.</p>
            </div>
          </div>
          
          <div 
            className="info-card"
            style={styles.infoCard}
            onMouseOver={e => {
              e.currentTarget.style.transform = styles.infoCardHover.transform;
              e.currentTarget.style.boxShadow = styles.infoCardHover.boxShadow;
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = styles.infoCard.boxShadow;
            }}
          >
            <div className="card-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="#B85C38" strokeWidth="2"/>
                <path d="M8 14.6001L3 21.0001" stroke="#B85C38" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 14.6001L21 21.0001" stroke="#B85C38" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="card-content">
              <h3>Artisan Crafted</h3>
              <p>Each product is handcrafted with attention to detail by our expert bakers with decades of experience.</p>
            </div>
          </div>
          
          <div 
            className="info-card"
            style={styles.infoCard}
            onMouseOver={e => {
              e.currentTarget.style.transform = styles.infoCardHover.transform;
              e.currentTarget.style.boxShadow = styles.infoCardHover.boxShadow;
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = styles.infoCard.boxShadow;
            }}
          >
            <div className="card-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.5 12.5723C19.5 15.8998 16.2899 21 12 21C7.71008 21 4.5 15.8998 4.5 12.5723C4.5 9.24476 7.71008 6.5 12 6.5C16.2899 6.5 19.5 9.24476 19.5 12.5723Z" stroke="#B85C38" strokeWidth="2"/>
                <path d="M14.4373 3.53301L12.5627 5.96699M12.5627 5.96699L10.6881 3.53301M12.5627 5.96699L11.5 3" stroke="#B85C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="card-content">
              <h3>No Preservatives</h3>
              <p>We never use artificial preservatives or additives in our products. Just pure bakery goodness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section with gradient background */}
      <section className="reviews-section" style={styles.reviewsSection}>
        <div className="section-title-container">
          <h2 className="modern-section-title">Customer Love</h2>
          <div className="title-decoration">
            <span className="dot"></span>
            <span className="line"></span>
            <span className="dot"></span>
          </div>
          <p className="section-subtitle">What our customers say about us</p>
        </div>
        
        <div className="reviews-slider">
          <div className="review-card">
            <div className="review-stars">
              ★★★★★
            </div>
            <p className="review-text">"The chocolate cake was absolutely divine! Moist, rich, and the perfect balance of sweetness. It was the highlight of my daughter's birthday party."</p>
            <div className="reviewer-info">
              <div className="reviewer-avatar">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah J." />
              </div>
              <div className="reviewer-details">
                <h4>Sarah Johnson</h4>
                <p>Jakarta, Indonesia</p>
              </div>
            </div>
          </div>
          
          <div className="review-card">
            <div className="review-stars">
              ★★★★★
            </div>
            <p className="review-text">"I've tried many bakeries in the city, but Sweet Bakery truly stands out. Their sourdough bread is exceptional - crispy crust and soft inside. Simply perfect!"</p>
            <div className="reviewer-info">
              <div className="reviewer-avatar">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="David L." />
              </div>
              <div className="reviewer-details">
                <h4>David Lee</h4>
                <p>Bandung, Indonesia</p>
              </div>
            </div>
          </div>
          
          <div className="review-card">
            <div className="review-stars">
              ★★★★★
            </div>
            <p className="review-text">"Their pastries are works of art! Not only do they look beautiful, but they taste incredible. The attention to detail and quality of ingredients really shines through."</p>
            <div className="reviewer-info">
              <div className="reviewer-avatar">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Maya R." />
              </div>
              <div className="reviewer-details">
                <h4>Maya Renata</h4>
                <p>Surabaya, Indonesia</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section - keep existing styling as it's already distinct */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContainer}>
          <h2 style={styles.ctaTitle}>Ready to Taste the Difference?</h2>
          <p style={styles.ctaText}>
            Experience our handcrafted baked goods made with the finest ingredients and traditional techniques.
          </p>
          <Link 
            to="/products" 
            style={styles.ctaButton}
            onMouseOver={e => {
              e.target.style.backgroundColor = styles.ctaButtonHover.backgroundColor;
              e.target.style.transform = styles.ctaButtonHover.transform;
              e.target.style.boxShadow = styles.ctaButtonHover.boxShadow;
            }}
            onMouseOut={e => {
              e.target.style.backgroundColor = styles.ctaButton.backgroundColor;
              e.target.style.transform = 'none';
              e.target.style.boxShadow = styles.ctaButton.boxShadow;
            }}
          >
            Shop Now
          </Link>
        </div>
        <div style={styles.ctaDecoration}></div>
      </section>
      
      {/* Add a final divider for smooth finish */}
      <div className="section-divider"></div>
    </div>
  );
};

// Add keyframes for blinking cursor (inject into global style if not present)
const style = document.createElement('style');
style.innerHTML = `
@keyframes blink-cursor {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
`;
if (typeof document !== "undefined" && !document.getElementById("typing-cursor-keyframes")) {
  style.id = "typing-cursor-keyframes";
  document.head.appendChild(style);
}

export default Home;

