import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error('Invalid Supabase URL format. Please check your VITE_SUPABASE_URL environment variable.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: import.meta.env.DEV,
    storage: {
      getItem: (key: string) => {
        try {
          const item = localStorage.getItem(key);
          // Return null for invalid values
          if (item === 'undefined' || item === 'null' || item === '') {
            return null;
          }
          return item;
        } catch {
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          // Don't store invalid values
          if (value === 'undefined' || value === 'null' || value === '') {
            localStorage.removeItem(key);
            return;
          }
          localStorage.setItem(key, value);
        } catch (error) {
          console.warn('Failed to store auth data:', error);
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn('Failed to remove auth data:', error);
        }
      },
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});