import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaCaretDown } from 'react-icons/fa';

const Header = () => {
  const { isAuthenticated, isAdmin, user, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">Sweet Bakery</Link>
        </div>
        
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            {isAuthenticated && (
              <li><Link to="/orders">My Orders</Link></li>
            )}
            {isAdmin && (
              <li><Link to="/admin">Admin Dashboard</Link></li>
            )}
          </ul>
        </nav>
        
        <div className="header-actions">
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>
          
          {isAuthenticated ? (
            <div className="user-menu" ref={dropdownRef}>
              <button 
                className="user-menu-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaUser /> {user?.username} <FaCaretDown />
              </button>
              
              {dropdownOpen && (
                <div className="user-dropdown">
                  {/* Add profile edit link */}
                  <Link to="/profile/edit" className="dropdown-item">
                    Edit Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
