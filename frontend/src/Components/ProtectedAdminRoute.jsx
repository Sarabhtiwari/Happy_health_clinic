// components/ProtectedAdminRoute.jsx
// Wrap any <Route> that should be admin-only with this component.
//
// Usage in your router:
//   <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />

import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../zustand/UseAuthStore';

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const location = useLocation();

  // Not logged in → go to login, remember where they came from
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but not admin → silently send to home (don't leak the route exists)
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
