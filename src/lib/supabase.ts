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
      select: (columns?: string) => builder,
      insert: (data: any) => builder,
      update: (data: any) => builder,
      delete: () => builder,
      eq: (column: string, value: any) => builder,
      neq: (column: string, value: any) => builder,
      gt: (column: string, value: any) => builder,
      gte: (column: string, value: any) => builder,
      lt: (column: string, value: any) => builder,
      lte: (column: string, value: any) => builder,
      like: (column: string, pattern: string) => builder,
      ilike: (column: string, pattern: string) => builder,
      is: (column: string, value: any) => builder,
      in: (column: string, values: any[]) => builder,
      contains: (column: string, value: any) => builder,
      containedBy: (column: string, value: any) => builder,
      rangeGt: (column: string, value: any) => builder,
      rangeGte: (column: string, value: any) => builder,
      rangeLt: (column: string, value: any) => builder,
      rangeLte: (column: string, value: any) => builder,
      rangeAdjacent: (column: string, value: any) => builder,
      overlaps: (column: string, value: any) => builder,
      textSearch: (column: string, query: string) => builder,
      match: (query: any) => builder,
      not: (column: string, operator: string, value: any) => builder,
      or: (filters: string) => builder,
      and: (filters: string) => builder,
      filter: (column: string, operator: string, value: any) => builder,
      order: (column: string, options?: any) => builder,
      limit: (count: number) => builder,
      range: (from: number, to: number) => builder,
      single: () => Promise.resolve({ data: null, error: new Error('Demo mode - no data') }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      then: (resolve: Function) => {
        // Return a promise-like response for demo mode
        resolve({ data: [], error: null });
        return Promise.resolve({ data: [], error: null });
      },
      catch: (reject: Function) => Promise.resolve({ data: [], error: null })
    };
    return builder;
  };

  return {
    from: (table: string) => createQueryBuilder(),
    rpc: (fn: string, params?: any) => Promise.resolve({ data: 0, error: null }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      signIn: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      onAuthStateChange: (callback: any) => {
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
  ? createMockClient() as any
  : createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  return {
    error: error.message || 'An unexpected error occurred',
    code: error.code || 'UNKNOWN_ERROR'
  }
}

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}
