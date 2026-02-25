'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { LogIn, Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebug = (message: string) => {
    console.log('🔍', message)
    setDebugInfo(prev => [...prev, message])
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setDebugInfo([])

    try {
      addDebug('Iniciando login...')
      
      // Verificar se cliente Supabase está configurado
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl) {
        addDebug('❌ NEXT_PUBLIC_SUPABASE_URL não configurado!')
        setError('Erro de configuração: Variáveis de ambiente não encontradas. Reinicie o servidor.')
        setLoading(false)
        return
      }
      addDebug(`🔗 URL Supabase: ${supabaseUrl.substring(0, 30)}...`)
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        addDebug(`❌ Erro de autenticação: ${authError.message}`)
        setError(authError.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        addDebug('❌ Nenhum usuário retornado')
        setError('Erro ao fazer login. Tente novamente.')
        setLoading(false)
        return
      }

      addDebug(`✅ Usuário autenticado: ${data.user.id}`)
      addDebug(`📧 Email: ${data.user.email}`)

      // Verificar se é admin - tentar por auth_uid primeiro, depois por email
      interface ProfileType {
        is_admin: boolean
        email: string
        auth_uid: string
        id: string
      }
      
      let profile: ProfileType | null = null
      let profileError: any = null

      addDebug('🔍 Buscando perfil por auth_uid...')
      const { data: profileByUid, error: errorByUid } = await supabase
        .from('profiles')
        .select('is_admin, email, auth_uid, id')
        .eq('auth_uid', data.user.id)
        .single()

      if (errorByUid) {
        addDebug(`⚠️ Não encontrado por auth_uid: ${errorByUid.message}`)
      } else if (profileByUid) {
        addDebug(`✅ Perfil encontrado por auth_uid`)
        profile = profileByUid as ProfileType
      }

      if (!profile && email) {
        addDebug('🔍 Buscando perfil por email...')
        const { data: profileByEmail, error: errorByEmail } = await supabase
          .from('profiles')
          .select('is_admin, email, auth_uid, id')
          .eq('email', email)
          .single()

        if (errorByEmail) {
          addDebug(`❌ Erro ao buscar por email: ${errorByEmail.message}`)
          profileError = errorByEmail
        } else if (profileByEmail) {
          addDebug(`✅ Perfil encontrado por email`)
          profile = profileByEmail as ProfileType
        }
      }

      addDebug(`📊 Perfil encontrado: ${JSON.stringify(profile, null, 2)}`)
      addDebug(`🔑 is_admin: ${profile?.is_admin}`)

      if (profileError && !profile) {
        addDebug(`❌ Erro ao buscar perfil: ${profileError.message}`)
        setError(`Erro ao verificar permissões: ${profileError.message}. Verifique o console para mais detalhes.`)
        setLoading(false)
        return
      }

      if (!profile) {
        addDebug('❌ Perfil não encontrado')
        setError('Perfil não encontrado. Verifique se o usuário existe na tabela profiles.')
        setLoading(false)
        return
      }

      if (!profile.is_admin) {
        addDebug('❌ Usuário não é admin')
        await supabase.auth.signOut()
        setError('Você não tem permissão para acessar o painel administrativo. Verifique se is_admin = true no banco.')
        setLoading(false)
        return
      }

      addDebug('✅ Login autorizado! Salvando sessão...')
      
      // Verificar se a sessão foi salva
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        addDebug('✅ Sessão confirmada!')
      } else {
        addDebug('⚠️ Sessão não encontrada, aguardando...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Tentar novamente
        const { data: { session: session2 } } = await supabase.auth.getSession()
        if (session2) {
          addDebug('✅ Sessão confirmada na segunda tentativa!')
        } else {
          addDebug('⚠️ Sessão ainda não encontrada, mas continuando...')
        }
      }
      
      addDebug('🔄 Aguardando cookies serem salvos...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Verificar novamente se a sessão está salva
      const { data: { session: finalSession } } = await supabase.auth.getSession()
      if (finalSession) {
        addDebug('✅ Sessão final confirmada!')
      } else {
        addDebug('⚠️ Sessão não encontrada, mas tentando redirecionar...')
      }
      
      addDebug('🔄 Redirecionando para dashboard...')
      
      // Verificar se a sessão está realmente salva antes de redirecionar
      const { data: { session: verifySession } } = await supabase.auth.getSession()
      if (!verifySession) {
        addDebug('❌ Sessão não encontrada após verificação final!')
        setError('Erro ao salvar sessão. Tente novamente.')
        setLoading(false)
        return
      }
      
      addDebug('✅ Sessão verificada antes do redirecionamento')
      
      // Aguardar mais tempo para garantir que cookies sejam persistidos
      addDebug('⏳ Aguardando 1.5 segundos antes de redirecionar...')
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Verificar novamente
      const { data: { session: finalVerify } } = await supabase.auth.getSession()
      if (!finalVerify) {
        addDebug('❌ Sessão perdida durante o delay!')
        setError('Erro ao manter sessão. Tente novamente.')
        setLoading(false)
        return
      }
      
      addDebug('🚀 Executando redirecionamento...')
      addDebug(`📍 URL atual: ${window.location.href}`)
      
      // Verificar cookies antes de redirecionar
      // O Supabase pode salvar cookies com nomes diferentes ou em localStorage
      const cookies = document.cookie.split(';').map(c => c.trim())
      const allCookies = cookies.join('; ')
      addDebug(`📋 Todos os cookies: ${allCookies || '(nenhum cookie encontrado)'}`)
      
      // Verificar também localStorage (Supabase pode usar isso)
      const localStorageKeys = Object.keys(localStorage).filter(k => k.includes('supabase') || k.includes('sb-'))
      if (localStorageKeys.length > 0) {
        addDebug(`📦 LocalStorage keys encontradas: ${localStorageKeys.join(', ')}`)
      }
      
      // Verificar sessionStorage também
      const sessionStorageKeys = Object.keys(sessionStorage).filter(k => k.includes('supabase') || k.includes('sb-'))
      if (sessionStorageKeys.length > 0) {
        addDebug(`📦 SessionStorage keys encontradas: ${sessionStorageKeys.join(', ')}`)
      }
      
      // Verificar se a sessão está realmente salva no Supabase
      const { data: { session: finalCheck }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        addDebug(`❌ Erro ao verificar sessão final: ${sessionError.message}`)
      }
      
      if (!finalCheck) {
        addDebug('❌ Sessão não encontrada no Supabase!')
        addDebug('💡 Tentando forçar refresh da sessão...')
        
        // Tentar obter o usuário novamente
        const { data: { user: userCheck } } = await supabase.auth.getUser()
        if (userCheck) {
          addDebug('✅ Usuário ainda autenticado, mas sessão não está em getSession()')
          addDebug('💡 Isso pode ser normal - cookies podem estar sendo salvos pelo middleware')
        } else {
          addDebug('❌ Usuário também não encontrado!')
          setError('Erro ao manter sessão. Tente novamente.')
          setLoading(false)
          return
        }
      } else {
        addDebug('✅ Sessão confirmada no Supabase antes do redirecionamento')
      }
      
      // IMPORTANTE: Sincronizar localStorage com cookies do servidor
      // O Supabase salva em localStorage, mas o servidor precisa de cookies
      if (finalCheck) {
        addDebug('🔄 Sincronizando sessão com cookies do servidor...')
        try {
          const syncResponse = await fetch('/api/auth/sync-cookies', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_token: finalCheck.access_token,
              refresh_token: finalCheck.refresh_token,
            }),
          })

          if (syncResponse.ok) {
            addDebug('✅ Cookies sincronizados com sucesso!')
          } else {
            const errorData = await syncResponse.json()
            addDebug(`⚠️ Erro ao sincronizar cookies: ${errorData.error}`)
            // Continuar mesmo assim - pode funcionar
          }
        } catch (syncError: any) {
          addDebug(`⚠️ Erro ao sincronizar cookies: ${syncError.message}`)
          // Continuar mesmo assim - pode funcionar
        }
      }
      
      // Aguardar um pouco para garantir que cookies sejam salvos
      addDebug('⏳ Aguardando 500ms para cookies serem persistidos...')
      await new Promise(resolve => setTimeout(resolve, 500))
      
      addDebug('🔄 Redirecionando para /dashboard...')
      addDebug('💡 Nota: Se redirecionar de volta, verifique logs do servidor')
      
      // Verificar se estamos no Electron (window.process existe no Electron)
      const isElectron = typeof window !== 'undefined' && 
                        (window as any).process && 
                        (window as any).process.type === 'renderer'
      
      if (isElectron) {
        // No Electron, usar href com URL completa para garantir que funcione
        addDebug('🖥️ Detectado Electron - usando window.location.href com URL completa')
        addDebug('⏳ Aguardando 1 segundo antes de redirecionar no Electron...')
        
        // Aguardar um pouco mais no Electron para garantir que tudo está salvo
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        addDebug('🔄 Redirecionando no Electron...')
        // No Electron, usar URL completa para garantir que funcione
        const currentUrl = window.location.origin
        window.location.href = `${currentUrl}/dashboard`
        
        // Fallback: se não redirecionar em 2 segundos, tentar novamente
        setTimeout(() => {
          if (window.location.pathname !== '/dashboard') {
            addDebug('⚠️ Redirecionamento não funcionou, tentando novamente...')
            window.location.href = `${currentUrl}/dashboard`
          }
        }, 2000)
      } else {
        // No navegador, usar replace
        window.location.replace('/dashboard')
      }
      
      // Não chegará aqui se o redirecionamento funcionar
      return
    } catch (err: any) {
      addDebug(`❌ Erro geral: ${err.message}`)
      setError(err.message || 'Erro ao fazer login')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">FortSmart Agro</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {debugInfo.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-40 overflow-y-auto">
              <p className="text-xs font-mono text-gray-600 text-sm mb-2">Debug:</p>
              {debugInfo.map((info, idx) => (
                <p key={idx} className="text-xs text-gray-500">{info}</p>
              ))}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="admin@fortsmartagro.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Entrar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
