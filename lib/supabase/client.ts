'use client'

import { createClient } from '@supabase/supabase-js'

// Singleton pattern para evitar múltiplas instâncias do GoTrueClient
let supabaseInstance: ReturnType<typeof createClient> | null = null

function createSupabaseClient() {
  // Se já existe, retornar a mesma instância
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Ler variáveis de ambiente (no cliente, precisa ser NEXT_PUBLIC_*)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Verificar variáveis de ambiente
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌')
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set')
  }

  // Criar instância única com configurações otimizadas
  // IMPORTANTE: Usar localStorage para persistir sessão no cliente
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'sb-auth-token',
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    global: {
      headers: {
        'x-client-info': 'admin-dashboard',
      },
    },
  })

  return supabaseInstance
}

// Exportar instância única
export const supabase = createSupabaseClient()
