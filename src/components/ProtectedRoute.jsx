import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, isCustomer, isFranchise } = useAuth();

  // For customer-specific routes
  if (requiredRole === 'customer' && !isCustomer) {
    return <Navigate to="/" />;
  }

  // For franchise-specific routes
  if (requiredRole === 'franchise' && !isFranchise) {
    return <Navigate to="/" />;
  }

  // For non-franchise routes, only redirect if user is logged in AND is a franchise
  if (requiredRole === 'non-franchise' && currentUser && isFranchise) {
    return <Navigate to="/franchise-dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
