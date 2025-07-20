import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Demo mode flag
export const isDemoMode = !supabaseUrl || !supabaseAnonKey

// Create a mock client for demo mode
const createMockClient = () => {
  // Create a chainable query builder
  const createQueryBuilder = () => {
    const builder = {
      select: () => builder,
      insert: () => builder,
      update: () => builder,
      delete: () => builder,
      eq: () => builder,
      neq: () => builder,
      gt: () => builder,
      gte: () => builder,
      lt: () => builder,
      lte: () => builder,
      like: () => builder,
      ilike: () => builder,
      is: () => builder,
      in: () => builder,
      contains: () => builder,
      containedBy: () => builder,
      rangeGt: () => builder,
      rangeGte: () => builder,
      rangeLt: () => builder,
      rangeLte: () => builder,
      rangeAdjacent: () => builder,
      overlaps: () => builder,
      textSearch: () => builder,
      match: () => builder,
      not: () => builder,
      or: () => builder,
      and: () => builder,
      filter: () => builder,
      order: () => builder,
      limit: () => builder,
      range: () => builder,
      single: () => Promise.resolve({ data: null, error: new Error('Demo mode - no data') }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      then: (resolve: (value: { data: unknown[]; error: null }) => void): Promise<{ data: unknown[]; error: null }> => {
        // Return a promise-like response for demo mode
        resolve({ data: [], error: null });
        return Promise.resolve({ data: [], error: null });
      },
      catch: (): Promise<{ data: unknown[]; error: null }> => Promise.resolve({ data: [], error: null })
    };
    return builder;
  };

  return {
    from: () => createQueryBuilder(),
    rpc: () => Promise.resolve({ data: 0, error: null }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      signIn: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
        // Mock subscription object
        const subscription = {
          unsubscribe: () => {},
          data: { subscription: { unsubscribe: () => {} } }
        };
        // Call callback with demo user state
        setTimeout(() => callback('SIGNED_OUT', null), 100);
        return { data: subscription };
      },
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
  };
}

export const supabase = isDemoMode 
  ? createMockClient() as unknown as ReturnType<typeof createClient<Database>>
  : createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: unknown) => {
  console.error('Supabase error:', error)
  const err = error as { message?: string; code?: string }
  return {
    error: err.message || 'An unexpected error occurred',
    code: err.code || 'UNKNOWN_ERROR'
  }
}

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}
