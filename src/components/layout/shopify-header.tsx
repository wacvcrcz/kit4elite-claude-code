/**
 * Shopify-Style Header Component
 * Clean, minimal, professional e-commerce navigation
 */

import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

interface NavLinkItem {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
}

const navLinks: NavLinkItem[] = [
  { name: 'Shop', href: '/products' },
  { name: 'Digital', href: '/products?type=digital' },
  { name: 'Physical', href: '/products?type=physical' },
];

export function ShopifyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated, user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();

  // Track scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center text-xs font-medium py-2 px-4">
        Free shipping on orders over $50
      </div>

      {/* Main Header */}
      <div className="container-shopify">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Logo - Centered on mobile, left on desktop */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:mr-auto"
          >
            <span className="text-2xl font-bold tracking-tight">
              LUXE
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-4">
            {/* Search */}
            <button
              className="hidden md:flex p-2 hover:text-muted-foreground transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="hidden md:flex items-center gap-1 p-2 text-sm font-medium hover:text-muted-foreground transition-colors">
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-popover border border-border rounded-lg shadow-lg p-2">
                    <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border mb-2">
                      {user?.name}
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-accent"
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-accent"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-accent text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex p-2 text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative p-2">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar - Expandable */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="py-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="input-shopify"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg"
          >
            <nav className="container-shopify py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-3 text-lg font-medium border-b border-border ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-4 mt-4">
                  <Link to="/login" className="flex-1">
                    <Button fullWidth variant="secondary">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button fullWidth>Get Started</Button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
