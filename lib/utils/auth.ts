import { supabase } from '@/lib/supabase/client'

export async function checkAdminAccess(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    // Verificar se o usuário é admin
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('auth_uid', user.id)
      .single()

    if (error || !profile) {
      return false
    }

    return (profile as any)?.is_admin === true
  } catch (error) {
    console.error('Erro ao verificar acesso admin:', error)
    return false
  }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

