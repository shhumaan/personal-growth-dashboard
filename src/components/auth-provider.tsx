'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Auth } from '@/components/auth';
import { Loader2 } from 'lucide-react';

interface User {
  id: string;
  email?: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initial session check
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        setUser(data.session?.user || null);
        setLoading(false);
        setInitialized(true);
      } catch (error) {
        console.error('Error getting initial session:', error);
        setLoading(false);
        setInitialized(true);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setLoading(true);
    // The auth state change listener will update the user state
    setTimeout(() => setLoading(false), 1000); // Small delay to ensure state is updated
  };

  // Don't render anything until we've checked for an existing session
  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // If no user is logged in, show the auth form
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // User is logged in, render the app
  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
