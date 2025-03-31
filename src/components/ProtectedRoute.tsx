
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type Role = 'student' | 'driver' | 'coordinator' | 'admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: Role;
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // If still loading auth state, show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated at all, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but wrong role, redirect to their dashboard
  if (user.role !== role) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'student') {
      return <Navigate to="/student" replace />;
    }
    if (user.role === 'driver') {
      return <Navigate to="/driver" replace />;
    }
    if (user.role === 'coordinator') {
      return <Navigate to="/coordinator" replace />;
    }
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
  }

  // If authenticated and correct role, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
