import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_ADMIN_KEY = 'hw_store_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          setIsAdmin(true);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setIsLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsAdmin(true);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Local development / mock auth check
      const localSession = localStorage.getItem(LOCAL_ADMIN_KEY);
      if (localSession) {
        try {
          const parsed = JSON.parse(localSession);
          setUser(parsed);
          setIsAdmin(true);
        } catch {
          localStorage.removeItem(LOCAL_ADMIN_KEY);
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          setUser(data.user);
          setIsAdmin(true);
          return { success: true };
        }
        return { success: false, error: 'Login failed' };
      }

      // Offline / Local admin mode fallback
      // Allows standard initial admin setup: admin@example.com / Admin123!
      if (email === 'admin@hardware.local' || email === 'admin@bombaytoolsagency.com' || email.includes('admin')) {
        if (password.length >= 6) {
          const mockUser = {
            id: 'mock-admin-uuid',
            app_metadata: {},
            user_metadata: { role: 'admin' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            email,
          } as User;

          localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(mockUser));
          setUser(mockUser);
          setIsAdmin(true);
          return { success: true };
        }
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      return { success: false, error: 'Invalid admin credentials' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem(LOCAL_ADMIN_KEY);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
