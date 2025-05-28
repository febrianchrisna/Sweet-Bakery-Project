import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  // Show loading spinner while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Redirect to login if not authenticated or to home if not admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  // If user is authenticated and admin, render the protected component
  return children;
}

export default AdminRoute;
