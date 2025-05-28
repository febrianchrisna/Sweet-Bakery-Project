import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  // Don't redirect while still checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect if not authenticated or not an admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" />;
  }

  // Render children if user is an admin
  return children;
}

export default AdminRoute;
