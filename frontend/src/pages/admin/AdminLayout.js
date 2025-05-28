import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  // Style for the admin layout
  const styles = {
    container: {
      display: 'flex',
      minHeight: 'calc(100vh - 60px)', // Adjust based on your header height
    },
    sidebar: {
      width: '250px',
      backgroundColor: 'white',
      borderRight: '1px solid rgba(0, 0, 0, 0.05)',
      padding: '30px 0',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#5A2828',
      padding: '0 20px 20px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      marginBottom: '20px',
    },
    navItem: {
      padding: '12px 20px',
      color: '#555',
      textDecoration: 'none',
      display: 'block',
      transition: 'all 0.2s ease',
    },
    navItemActive: {
      backgroundColor: 'rgba(184, 92, 56, 0.1)',
      color: '#B85C38',
      borderLeft: '4px solid #B85C38',
    },
    content: {
      flex: 1,
      padding: '30px',
      backgroundColor: '#f9f9f9',
    },
  };

  // Function to check if a link is active
  const isActive = (path) => {
    return window.location.pathname === path;
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>Admin Panel</div>
        <nav>
          <Link 
            to="/admin" 
            style={{
              ...styles.navItem,
              ...(isActive('/admin') ? styles.navItemActive : {})
            }}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/products" 
            style={{
              ...styles.navItem,
              ...(isActive('/admin/products') ? styles.navItemActive : {})
            }}
          >
            Products
          </Link>
          <Link 
            to="/admin/orders" 
            style={{
              ...styles.navItem,
              ...(isActive('/admin/orders') ? styles.navItemActive : {})
            }}
          >
            Orders
          </Link>
          <Link 
            to="/admin/users" 
            style={{
              ...styles.navItem,
              ...(isActive('/admin/users') ? styles.navItemActive : {})
            }}
          >
            Users
          </Link>
        </nav>
      </div>
      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
