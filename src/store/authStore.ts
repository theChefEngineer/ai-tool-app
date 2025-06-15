import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  initialize: async () => {
    try {
      // Clear any invalid tokens from localStorage
      const invalidTokens = ['sb-access-token', 'sb-refresh-token'];
      invalidTokens.forEach(key => {
        const item = localStorage.getItem(key);
        if (item && (item === 'undefined' || item === 'null' || item === '')) {
          localStorage.removeItem(key);
        }
      });

      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn('Session error during initialization:', error.message);
        // Clear potentially corrupted session data
        await supabase.auth.signOut();
        set({ user: null, loading: false });
        return;
      }

      set({ user: session?.user ?? null, loading: false });

      // Set up auth state change listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              set({ user: session.user, loading: false });
            }
            break;
          case 'SIGNED_OUT':
            set({ user: null, loading: false });
            break;
          case 'TOKEN_REFRESHED':
            if (session?.user) {
              set({ user: session.user, loading: false });
            }
            break;
          case 'USER_UPDATED':
            if (session?.user) {
              set({ user: session.user, loading: false });
            }
            break;
          default:
            set({ user: session?.user ?? null, loading: false });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ user: null, loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    
    if (error) {
      // Provide more user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error('Please check your email and click the confirmation link before signing in.');
      } else if (error.message.includes('Too many requests')) {
        throw new Error('Too many login attempts. Please wait a moment before trying again.');
      }
      throw error;
    }

    if (data.user) {
      set({ user: data.user });
    }
  },

  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      // Provide more user-friendly error messages
      if (error.message.includes('User already registered')) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      } else if (error.message.includes('Password should be at least')) {
        throw new Error('Password must be at least 8 characters long.');
      } else if (error.message.includes('Invalid email')) {
        throw new Error('Please enter a valid email address.');
      }
      throw error;
    }

    // Note: User will need to confirm email before they can sign in
    if (data.user && !data.user.email_confirmed_at) {
      // Don't set user in state until email is confirmed
      console.log('User created, email confirmation required');
    } else if (data.user) {
      set({ user: data.user });
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    set({ user: null });
  },

  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error('Google sign in error:', error);
        
        // Handle specific OAuth errors
        if (error.message.includes('provider is not enabled') || error.message.includes('validation_failed')) {
          throw new Error('Google Sign-In is not configured yet. Please use email and password to sign in.');
        } else if (error.message.includes('popup')) {
          throw new Error('Please allow popups for this site and try again.');
        } else if (error.message.includes('network')) {
          throw new Error('Network error. Please check your connection and try again.');
        } else if (error.message.includes('cancelled')) {
          throw new Error('Sign in was cancelled. Please try again.');
        }
        
        throw new Error(error.message || 'Google sign in failed. Please try again.');
      }

      // The actual user setting will be handled by the auth state change listener
      console.log('Google OAuth initiated');
    } catch (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }
  },
}));