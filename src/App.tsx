import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Auth
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';

// Products
import { ProductListPage } from '@/pages/products/product-list';
import { ProductDetailPage } from '@/pages/products/product-detail';

// Route guards
import { ProtectedRoute, GuestRoute } from '@/components/auth/protected-route';

// Placeholder for future pages
const Home = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-6">
    <h1 className="font-display text-display-lg text-gradient mb-6">LUXE</h1>
    <p className="text-neutral-400 text-lg max-w-md text-center">
      Premium e-commerce platform. Auth system ready.
    </p>
  </div>
);

// Protected dashboard placeholder
const Dashboard = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-6">
    <h1 className="font-display text-display-lg text-gradient mb-6">Dashboard</h1>
    <p className="text-neutral-400 text-lg">Protected customer dashboard</p>
  </div>
);

// Admin Pages
import { AdminDashboardPage } from '@/pages/admin/dashboard';
import { AdminProductsPage } from '@/pages/admin/products';
import { AdminCategoriesPage } from '@/pages/admin/categories';
import { AdminCouponsPage } from '@/pages/admin/coupons';
import { AdminOrdersPage } from '@/pages/admin/orders';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />

        {/* Guest-only routes (redirects if authenticated) */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />

        {/* Protected customer routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminCategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/coupons"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminCouponsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="font-display text-6xl text-neutral-600 mb-4">404</h1>
                <p className="text-neutral-400">Page not found</p>
              </div>
            </div>
          }
        />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#fafafa',
            border: '1px solid #333',
            borderRadius: '0.5rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fafafa',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fafafa',
            },
          },
        }}
      />
    </AnimatePresence>
  );
}

export default App;
