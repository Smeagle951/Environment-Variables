import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env file:\n' +
      '- NEXT_PUBLIC_SUPABASE_URL\n' +
      '- NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          const value = cookieStore.get(name)?.value
          // Log para debug (apenas em desenvolvimento)
          if (process.env.NODE_ENV === 'development' && name.includes('auth-token')) {
            console.log(`Server: Getting cookie ${name}: ${value ? 'found' : 'not found'}`)
          }
          return value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ 
              name, 
              value, 
              ...options,
              // Garantir que cookies sejam enviados
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
            // Log para debug
            if (process.env.NODE_ENV === 'development' && name.includes('auth-token')) {
              console.log(`Server: Setting cookie ${name}`)
            }
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ 
              name, 
              value: '', 
              ...options,
              sameSite: 'lax',
            })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

