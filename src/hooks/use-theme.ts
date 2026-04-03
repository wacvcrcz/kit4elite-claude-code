/**
 * Theme Hook
 * Handles dark/light mode with system preference detection
 */

import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  resolvedTheme: 'dark' | 'light';
  isDark: boolean;
}

/**
 * Hook for managing theme state
 * - Detects system preference on mount
 * - Persists to localStorage
 * - Listens for system changes
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as Theme | null;
      if (stored) return stored;
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  // Apply theme to document
  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    let resolved: 'dark' | 'light';
    if (t === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = t;
    }

    root.classList.add(resolved);
    setResolvedTheme(resolved);

    // Also set data-theme for any CSS that uses that
    root.setAttribute('data-theme', resolved);
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    const current = resolvedTheme;
    const newTheme = current === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
  };
}
