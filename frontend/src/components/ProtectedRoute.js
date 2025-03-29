import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute; 