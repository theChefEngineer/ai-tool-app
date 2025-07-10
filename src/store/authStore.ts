import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

// Define a mock user object.
const mockUser: User = {
  id: 'mock-user-id',
  app_metadata: {
    provider: 'email',
    providers: ['email'],
  },
  user_metadata: {
    full_name: 'Mock User',
  },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  initialize: async () => {
    // Set the mock user and mark loading as complete.
    set({ user: mockUser, loading: false });
  },

  signIn: async (email: string, password: string) => {
    // Simulate a successful sign-in.
    console.log(`Bypassing login for email: ${email}`);
    set({ user: mockUser, loading: false });
  },

  signUp: async (email: string, password: string) => {
    // Simulate a successful sign-up.
    console.log(`Bypassing signup for email: ${email}`);
    set({ user: mockUser, loading: false });
  },

  signOut: async () => {
    // Do nothing on sign out.
    console.log('Sign out called, but authentication is bypassed.');
  },

  signInWithGoogle: async () => {
    // Simulate a successful Google sign-in.
    console