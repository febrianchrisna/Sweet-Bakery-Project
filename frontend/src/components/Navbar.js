import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Sweet Bakery</Link>
      </div>
      <div className={styles.links}>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        {isAuthenticated && !isAdmin && (
          <Link to="/orders">My Orders</Link>
        )}
        {isAdmin && (
          <Link to="/admin">Admin Dashboard</Link>
        )}
      </div>
      <div className={styles.userSection}>
        {isAuthenticated ? (
          <div className={styles.userMenu}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              className={styles.userButton}
            >
              {user?.username || "User"} ▼
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                {!isAdmin && (
                  <Link to="/orders" className={styles.dropdownItem}>My Orders</Link>
                )}
                <Link to="/profile/edit" className={styles.dropdownItem}>Edit Profile</Link>
                <button onClick={handleLogout} className={styles.dropdownLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.authLinks}>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
        <Link to="/cart" className={styles.cartLink}>
          <span className={styles.cartIcon}>🛒</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;