import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { BASE_URL } from '../utils';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

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
  }, [id]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  return (
    <div className="product-detail-page">
      {loading && <div className="loading">Loading product...</div>}
      
      {error && <div className="error-message">{error}</div>}
      
      {!loading && !error && product && (
        <div className="product-detail">
          <div className="product-image">
            <img 
              src={product.image || '/images/product-placeholder.jpg'} 
              alt={product.name} 
            />
          </div>
          
          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="category">{product.category}</p>
            <p className="price">Rp {product.price.toLocaleString()}</p>
            
            <div className="description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
            
            <div className="stock-info">
              <p className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                {product.stock > 0 
                  ? `In Stock (${product.stock} available)` 
                  : 'Out of Stock'
                }
              </p>
            </div>
            
            {product.stock > 0 && (
              <div className="purchase-actions">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
