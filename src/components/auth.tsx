'use client';

import { useState, useEffect } from 'react';
import { supabase, isDemoMode } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'sign-in' | 'sign-up' | 'magic-link'>('sign-in');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      if (isDemoMode) {
        // Skip auth check in demo mode
        return;
      }
      
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          onLogin();
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    
    checkUser();
  }, [onLogin]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isDemoMode) {
        // In demo mode, just simulate a successful login
        setTimeout(() => {
          onLogin();
          setLoading(false);
        }, 500);
        return;
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      onLogin();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isDemoMode) {
        // In demo mode, just switch to sign-in view
        setTimeout(() => {
          setView('sign-in');
          setLoading(false);
          alert('Demo mode: Account created! You can now sign in.');
        }, 500);
        return;
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
      setView('sign-in');
      alert('Check your email for the confirmation link');
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isDemoMode) {
        // In demo mode, simulate magic link sent
        setTimeout(() => {
          setMagicLinkSent(true);
          setLoading(false);
        }, 500);
        return;
      }
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
      setMagicLinkSent(true);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {view === 'sign-in' && 'Welcome Back'}
              {view === 'sign-up' && 'Create an Account'}
              {view === 'magic-link' && 'Login with Magic Link'}
            </CardTitle>
            <CardDescription className="text-center">
              {view === 'sign-in' && 'Enter your credentials to access your dashboard'}
              {view === 'sign-up' && 'Sign up to start tracking your growth'}
              {view === 'magic-link' && magicLinkSent 
                ? 'Check your email for the login link' 
                : 'Get a login link sent to your email'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            
            {!magicLinkSent && (
              <form onSubmit={
                view === 'sign-in' 
                  ? handleEmailLogin 
                  : view === 'sign-up' 
                    ? handleSignUp 
                    : handleMagicLink
              }>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  {(view === 'sign-in' || view === 'sign-up') && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="password" className="text-sm font-medium">
                          Password
                        </label>
                        {view === 'sign-in' && (
                          <button
                            type="button"
                            onClick={() => setView('magic-link')}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Use magic link
                          </button>
                        )}
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {view === 'sign-in' && 'Sign In'}
                    {view === 'sign-up' && 'Sign Up'}
                    {view === 'magic-link' && 'Send Magic Link'}
                  </Button>
                </div>
              </form>
            )}
            
            {magicLinkSent && (
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  A login link has been sent to your email. Please check your inbox and click the link to log in.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setMagicLinkSent(false);
                    setView('sign-in');
                  }}
                >
                  Back to Sign In
                </Button>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            {!magicLinkSent && (
              <div className="text-center w-full text-sm">
                {view === 'sign-in' ? (
                  <p>
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setView('sign-up')}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setView('sign-in')}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
