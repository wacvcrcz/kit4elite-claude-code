/**
 * Header Component
 * Main navigation with theme toggle, cart, auth links
 */

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Store,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();

  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Cart', href: '/cart' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.span
              className="font-display text-2xl font-semibold text-gradient"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              LUXE
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-white ${
                    isActive ? 'text-white' : 'text-neutral-400'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart */}
            <NavLink to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="primary"
                    size="sm"
                    className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </NavLink>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative group">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-400">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:inline">{user?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <div className="absolute right-0 top-full mt-1 w-48 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl p-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-800 rounded-md"
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-800 rounded-md"
                      >
                        <Store className="w-4 h-4" />
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-800 rounded-md text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <NavLink to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </NavLink>
                <NavLink to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </NavLink>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-neutral-800"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-neutral-400 hover:bg-neutral-800'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <div className="pt-2 border-t border-neutral-800 flex gap-2">
                  <NavLink to="/login" className="flex-1">
                    <Button variant="secondary" fullWidth size="sm">Sign In</Button>
                  </NavLink>
                  <NavLink to="/register" className="flex-1">
                    <Button variant="primary" fullWidth size="sm">Get Started</Button>
                  </NavLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
