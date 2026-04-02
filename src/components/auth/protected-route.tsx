/**
 * Protected Route Component
 * Handles authentication and role-based access control
 * Client-side guard only - server-side protection is required per constraints
 */

import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import type { ProtectedRouteProps, UserRole } from '@/types';

/**
 * Role-based route guard
 * Checks authentication and required role
 */
export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login, but save the attempted URL
    return (
      fallback || (
        <Navigate
          to="/login"
          state={{ from: location.pathname }}
          replace
        />
      )
    );
  }

  // Check if user has required role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to home if wrong role
    return <Navigate to="/" replace />;
  }

  // Role check for admin routes
  if (location.pathname.startsWith('/admin') && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Wrap content in animation for page transitions
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Admin-only route wrapper
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}

/**
 * Authenticated route wrapper (any logged-in user)
 */
export function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Guest-only route (redirects if already authenticated)
 */
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated) {
    // Redirect to intended page or home
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hook for checking route access permissions
 */
export function useCanAccess(path: string): boolean {
  const { user, isAuthenticated } = useAuthStore();

  if (path.startsWith('/admin')) {
    return isAuthenticated && user?.role === 'admin';
  }

  return isAuthenticated;
}
