import { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils';
import { CartContext } from '../context/CartContext';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '' });
  const { addToCart } = useContext(CartContext);
  
  const selectedCategory = searchParams.get('category') || '';

  // Styles object for modern bakery design
  const styles = {
    pageContainer: {
      padding: '0',
      background: 'linear-gradient(180deg, #FDF6E9 0%, #FFFFFF 100%)',
      minHeight: '100vh',
    },
    header: {
      background: 'linear-gradient(to right, rgba(184, 92, 56, 0.8), rgba(90, 40, 40, 0.8)), url(https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      padding: '60px 20px',
      textAlign: 'center',
      borderRadius: '0 0 30px 30px',
      marginBottom: '40px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    pageTitle: {
      fontSize: '2.8rem',
      fontWeight: '700',
      marginBottom: '15px',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    pageDescription: {
      fontSize: '1.1rem',
      maxWidth: '700px',
      margin: '0 auto',
      marginBottom: '20px',
      lineHeight: '1.6',
    },
    contentContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    catalogControls: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '30px',
      marginBottom: '40px',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '0 10px',
    },
    categoryFilter: {
      flex: '1',
      minWidth: '250px',
      background: 'white',
      padding: '25px',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
    },
    categoryTitle: {
      fontSize: '1.4rem',
      fontWeight: '600',
      color: '#5a2828',
      marginBottom: '20px',
      position: 'relative',
      paddingBottom: '10px',
    },
    categoryTitleUnderline: {
      content: '',
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '40px',
      height: '3px',
      background: '#B85C38',
    },
    categoryList: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
    },
    categoryItem: {
      padding: '10px 0',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      color: '#666',
    },
    categoryItemActive: {
      color: '#B85C38',
      fontWeight: '600',
    },
    categoryItemIcon: {
      marginRight: '10px',
      fontSize: '0.8rem',
    },
    searchContainer: {
      flex: '2',
      minWidth: '300px',
    },
    searchForm: {
      display: 'flex',
      background: 'white',
      borderRadius: '15px',
      padding: '5px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
    },
    searchInput: {
      flex: '1',
      border: 'none',
      padding: '15px 20px',
      fontSize: '1rem',
      outline: 'none',
    },
    searchButton: {
      background: '#B85C38',
      color: 'white',
      border: 'none',
      padding: '0 25px',
      borderRadius: '10px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    searchButtonHover: {
      background: '#a04e2f',
    },
    productsContainer: {
      marginTop: '20px',
    },
    noProducts: {
      textAlign: 'center',
      padding: '30px',
      fontSize: '1.1rem',
      color: '#666',
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '30px',
      padding: '10px 0',
    },
    productCard: {
      background: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      position: 'relative',
    },
    productCardHover: {
      transform: 'translateY(-10px)',
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
    },
    productLink: {
      textDecoration: 'none',
      color: 'inherit',
    },
    productImage: {
      height: '220px',
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
    },
    productImageImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
    },
    productImageHover: {
      transform: 'scale(1.05)',
    },
    productInfo: {
      padding: '20px',
    },
    productName: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#333',
      marginBottom: '8px',
    },
    productCategory: {
      color: '#888',
      fontSize: '0.9rem',
      marginBottom: '10px',
    },
    productPrice: {
      color: '#B85C38',
      fontWeight: '700',
      fontSize: '1.3rem',
      marginBottom: '15px',
    },
    addToCartBtn: {
      width: '100%',
      padding: '12px 0',
      background: '#5a2828',
      color: 'white',
      border: 'none',
      borderRadius: '0 0 15px 15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.2s ease',
    },
    addToCartBtnHover: {
      background: '#B85C38',
    },
    addToCartBtnDisabled: {
      background: '#cccccc',
      cursor: 'not-allowed',
      color: '#666',
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
    badge: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: '#B85C38',
      color: 'white',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      zIndex: 1,
    },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `${BASE_URL}/products`;
        
        // Add category filter if present
        if (selectedCategory) {
          url += `?category=${selectedCategory}`;
        }
        
        const response = await axios.get(url);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products/categories`);
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real implementation, you would call the API with the search parameter
    console.log('Searching for:', searchTerm);
    // For now, we'll just filter the products client-side
    // In production, this should be a server-side search
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    // Show notification instead of alert
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
  };

  // Filter products by search term (client-side filtering for demo)
  const filteredProducts = searchTerm
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  return (
    <div style={styles.pageContainer}>
      {/* Modern bakery header section */}
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Our Artisan Bakery Collection</h1>
        <p style={styles.pageDescription}>
          Discover our handcrafted products made with premium ingredients and traditional recipes passed down through generations
        </p>
      </div>
      
      <div style={styles.contentContainer}>
        <div style={styles.catalogControls}>
          <div style={styles.categoryFilter}>
            <h3 style={styles.categoryTitle}>
              Categories
              <div style={styles.categoryTitleUnderline}></div>
            </h3>
            <ul style={styles.categoryList}>
              <li 
                style={{
                  ...styles.categoryItem,
                  ...(selectedCategory === '' ? styles.categoryItemActive : {})
                }}
                onClick={() => handleCategoryChange('')}
              >
                <span style={styles.categoryItemIcon}>•</span> All Products
              </li>
              {categories.map(category => (
                <li 
                  key={category} 
                  style={{
                    ...styles.categoryItem,
                    ...(selectedCategory === category ? styles.categoryItemActive : {})
                  }}
                  onClick={() => handleCategoryChange(category)}
                >
                  <span style={styles.categoryItemIcon}>•</span> {category}
                </li>
              ))}
            </ul>
          </div>
          
          <div style={styles.searchContainer}>
            <form onSubmit={handleSearch} style={styles.searchForm}>
              <input
                type="text"
                placeholder="Search our bakery products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
              <button 
                type="submit" 
                style={styles.searchButton}
                onMouseOver={e => e.currentTarget.style.background = styles.searchButtonHover.background}
                onMouseOut={e => e.currentTarget.style.background = styles.searchButton.background}
              >
                Search
              </button>
            </form>
          </div>
        </div>
        
        <div style={styles.productsContainer}>
          {loading && <div className="loading">Loading delicious treats...</div>}
          
          {error && <div className="error-message">{error}</div>}
          
          {!loading && !error && filteredProducts.length === 0 && (
            <div style={styles.noProducts}>
              No products found. Try a different search term or category.
            </div>
          )}
          
          {!loading && !error && filteredProducts.length > 0 && (
            <div style={styles.productsGrid}>
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  style={styles.productCard}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = styles.productCardHover.transform;
                    e.currentTarget.style.boxShadow = styles.productCardHover.boxShadow;
                    // Find the image and apply hover effect
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = styles.productImageHover.transform;
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = styles.productCard.boxShadow;
                    // Reset image transform
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1)';
                  }}
                >
                  {product.featured && (
                    <div style={styles.badge}>Featured</div>
                  )}
                  <Link to={`/products/${product.id}`} style={styles.productLink}>
                    <div style={styles.productImage}>
                      <img 
                        src={product.image || '/images/product-placeholder.jpg'} 
                        alt={product.name} 
                        style={styles.productImageImg}
                      />
                    </div>
                    <div style={styles.productInfo}>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <p style={styles.productCategory}>{product.category}</p>
                      <p style={styles.productPrice}>Rp {product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                  <button 
                    style={{
                      ...styles.addToCartBtn,
                      ...(product.stock <= 0 ? styles.addToCartBtnDisabled : {})
                    }}
                    disabled={product.stock <= 0}
                    onClick={() => handleAddToCart(product)}
                    onMouseOver={e => {
                      if (product.stock > 0) {
                        e.currentTarget.style.background = styles.addToCartBtnHover.background;
                      }
                    }}
                    onMouseOut={e => {
                      if (product.stock > 0) {
                        e.currentTarget.style.background = styles.addToCartBtn.background;
                      }
                    }}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Cart notification */}
      <div style={styles.notification}>
        {notification.message}
      </div>
    </div>
  );
};

export default ProductCatalog;
