import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './Navbar.module.css'; // Adjust the import based on your file structure

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

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
        <Link to="/products">Products</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className={styles.userSection}>
        {isAuthenticated ? (
          <div className={styles.userMenu}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={styles.userButton}>
              User Menu
            </button>
            <div style={isDropdownOpen ? styles.dropdownMenu : styles.dropdownMenuHidden}>
              <Link to="/orders" style={styles.dropdownItem}>My Orders</Link>
              
              {/* Add a new link to the profile edit page */}
              <Link to="/profile/edit" style={styles.dropdownItem}>Edit Profile</Link>
              
              <button onClick={handleLogout} style={styles.dropdownLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <div className={styles.authLinks}>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;