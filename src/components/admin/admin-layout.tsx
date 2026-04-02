/**
 * Admin Layout Component
 * Sidebar navigation with mobile responsiveness
 */

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Tags,
  Ticket,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
];

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : '-100%',
        }}
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-neutral-900 border-r border-neutral-800 z-50 lg:translate-x-0 transition-transform`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <NavLink to="/admin" className="flex items-center gap-2">
            <span className="font-display text-2xl font-semibold text-gradient">
              LUXE
            </span>
            <span className="text-xs text-neutral-500 uppercase tracking-wider">
              Admin
            </span>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/admin'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
              <ChevronRight
                className={`w-4 h-4 ml-auto transition-transform ${
                  location.pathname === item.href ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
              <span className="font-medium text-primary-400">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" fullWidth onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="font-display text-xl font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <NavLink
              to="/"
              className="text-sm text-neutral-400 hover:text-neutral-200"
            >
              View Store
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
