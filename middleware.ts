import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Se não tem variáveis de ambiente, apenas retorna sem fazer nada
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables in middleware')
      return response
    }

    try {
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              request.cookies.set({
                name,
                value,
                ...options,
              })
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              })
              response.cookies.set({
                name,
                value,
                ...options,
              })
            },
            remove(name: string, options: CookieOptions) {
              request.cookies.set({
                name,
                value: '',
                ...options,
              })
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              })
              response.cookies.set({
                name,
                value: '',
                ...options,
              })
            },
          },
        }
      )

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      // "Auth session missing" é esperado quando não há login - não é um erro
      // Apenas loga erros reais de conexão/configuração
      if (authError && 
          !authError.message?.includes('session missing') && 
          !authError.message?.includes('Auth session missing')) {
        console.error('Auth error in middleware:', authError.message)
      }

      // Se está tentando acessar /dashboard sem estar logado
      if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
        // Verificar se há cookies de autenticação (pode estar em processo de salvamento)
        const authCookies = request.cookies.getAll().filter(c => c.name.startsWith('sb-'))
        if (authCookies.length > 0) {
          console.log('Middleware: Found auth cookies but no user - may be in process of saving')
          console.log('Middleware: Cookies found:', authCookies.map(c => c.name).join(', '))
          // Dar uma chance - não redirecionar imediatamente
          // O dashboard page vai verificar novamente
        } else {
          console.log('Middleware: Blocking /dashboard - no user found and no auth cookies')
          console.log('Middleware: Auth error:', authError?.message || 'none')
          return NextResponse.redirect(new URL('/', request.url))
        }
      }
      
      // Log quando permite acesso ao dashboard
      if (request.nextUrl.pathname.startsWith('/dashboard') && user) {
        console.log('Middleware: Allowing /dashboard - user found:', user.id)
      }
    } catch (supabaseError: any) {
      // Se houver erro ao criar cliente Supabase, apenas loga e continua
      console.error('Error creating Supabase client in middleware:', supabaseError.message)
    }

    return response
  } catch (error: any) {
    // Se houver qualquer erro no middleware, retorna resposta básica
    console.error('Middleware error:', error.message)
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
