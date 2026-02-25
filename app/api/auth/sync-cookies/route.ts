import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { access_token, refresh_token } = await request.json()

    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { error: 'Missing tokens' },
        { status: 400 }
      )
    }

    const cookieStore = cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Criar cliente Supabase para processar tokens
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({
              name,
              value,
              ...options,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              httpOnly: true,
              path: '/',
            })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({
              name,
              value: '',
              ...options,
              sameSite: 'lax',
              path: '/',
            })
          },
        },
      }
    )

    // Definir a sessão usando os tokens
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    })

    if (error) {
      console.error('Error setting session:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error: any) {
    console.error('Error in sync-cookies:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

