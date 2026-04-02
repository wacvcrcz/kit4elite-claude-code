/**
 * Auth Store using Zustand
 * Manages authentication state, tokens, and user data
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  AuthState,
  AuthActions,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
} from '@/types';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

/**
 * Combined auth store type
 */
type AuthStore = AuthState & AuthActions;

/**
 * Initial state factory
 */
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Auth Store
 * Persisted to localStorage for token persistence
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Login user with credentials
       */
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post<AuthResponse>('/auth/login', credentials);

          set({
            user: response.user,
            accessToken: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          toast.success(`Welcome back, ${response.user.name}!`);
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Login failed';
          set({
            isLoading: false,
            error: message,
          });
          throw error;
        }
      },

      /**
       * Register new user
       */
      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post<AuthResponse>('/auth/register', credentials);

          set({
            user: response.user,
            accessToken: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          toast.success(`Welcome, ${response.user.name}! Your account has been created.`);
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Registration failed';
          set({
            isLoading: false,
            error: message,
          });
          throw error;
        }
      },

      /**
       * Logout user and clear state
       */
      logout: () => {
        const { user } = get();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        if (user) {
          toast.success('You have been logged out');
        }
      },

      /**
       * Refresh access token using refresh token
       * Returns new token or null if refresh failed
       */
      refreshAccessToken: async (): Promise<string | null> => {
        const { refreshToken } = get();

        if (!refreshToken) {
          return null;
        }

        try {
          const response = await api.post<AuthResponse>('/auth/refresh', {
            refreshToken,
          });

          set({
            accessToken: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
          });

          return response.tokens.accessToken;
        } catch {
          get().logout();
          return null;
        }
      },

      /**
       * Clear error state
       */
      clearError: () => set({ error: null }),

      /**
       * Update user data (for profile updates)
       */
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      /**
       * Only persist tokens, not loading/error state
       */
      partialize: (state: AuthStore) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Hook for checking if user is admin
 */
export const useIsAdmin = (): boolean => {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'admin';
};

/**
 * Hook for getting current user
 */
export const useCurrentUser = (): User | null => {
  return useAuthStore((state) => state.user);
};
