import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginPage from '@/components/auth/LoginPage'

export default async function Home() {
  try {
    // Criar cliente Supabase
    const supabase = createClient()

    // Verificar autenticação (sem tratar erros de sessão como erro)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Log detalhado para debug
    console.log('=== HOME PAGE DEBUG ===')
    console.log('Home: User:', user?.id, 'email:', user?.email)
    console.log('Home: Auth error:', authError?.message || 'none')

    // Se houver erro de autenticação (exceto "session missing" que é esperado quando não logado)
    if (authError && 
        !authError.message?.includes('session missing') && 
        !authError.message?.includes('Auth session missing')) {
      console.error('Home: Auth error (real):', authError.message)
      return <LoginPage />
    }

    // Se usuário está logado, verificar se é admin
    if (user) {
      console.log('Home: User found, checking if admin...')
      type ProfileType = { is_admin: boolean; email: string; auth_uid: string } | null
      let profile: ProfileType = null

      // Tentar buscar por auth_uid
      try {
        const { data: profileByUid } = await supabase
          .from('profiles')
          .select('is_admin, email, auth_uid')
          .eq('auth_uid', user.id)
          .single()

        profile = (profileByUid as ProfileType)
      } catch (e) {
        // Ignorar erro se não encontrar
      }

      // Se não encontrou por auth_uid, tentar por email
      if (!profile && user.email) {
        try {
          const { data: profileByEmail } = await supabase
            .from('profiles')
            .select('is_admin, email, auth_uid')
            .eq('email', user.email)
            .single()

          profile = (profileByEmail as ProfileType)
        } catch (e) {
          // Ignorar erro se não encontrar
        }
      }

      // Se é admin, redirecionar para dashboard
      if (profile?.is_admin) {
        redirect('/dashboard')
      }
    }

    // Se não está logado ou não é admin, mostrar tela de login
    return <LoginPage />
  } catch (error: any) {
    // Em caso de erro, mostrar tela de login (não quebrar a aplicação)
    console.error('Error in Home page:', error)
    return <LoginPage />
  }
}
