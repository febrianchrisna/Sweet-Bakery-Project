import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Sweet Bakery</h3>
          <p>Delicious baked goods made fresh daily.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>123 Bakery Street</p>
          <p>Jakarta, Indonesia</p>
          <p>Email: info@sweetbakery.com</p>
          <p>Phone: +62 123 456 7890</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Sweet Bakery. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
