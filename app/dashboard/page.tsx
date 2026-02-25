import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardContent from '@/components/dashboard/DashboardContent'

export default async function DashboardPage() {
  let supabase
  try {
    supabase = createClient()
  } catch (error: any) {
    console.error('Dashboard: Error creating Supabase client:', error.message)
    redirect('/')
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  // Log detalhado para debug
  console.log('=== DASHBOARD PAGE DEBUG ===')
  console.log('Dashboard: Auth check - user:', user?.id, 'email:', user?.email)
  console.log('Dashboard: Auth error:', authError?.message || 'none')
  console.log('Dashboard: Cookies available:', typeof document !== 'undefined' ? 'yes' : 'server-side')

  // Se houver erro de autenticação (exceto "session missing" que é esperado)
  if (authError && 
      !authError.message?.includes('session missing') && 
      !authError.message?.includes('Auth session missing')) {
    console.error('Dashboard: Auth error (real):', authError.message)
    console.log('Dashboard: Redirecting to / due to auth error')
    redirect('/')
  }

  if (!user) {
    console.log('Dashboard: No user found')
    console.log('Dashboard: Auth error details:', authError)
    console.log('Dashboard: Redirecting to / due to no user')
    redirect('/')
  }

  console.log('Dashboard: User found:', user.id, user.email)

  // Verificar se é admin - tentar por auth_uid primeiro, depois por email
  type ProfileType = { is_admin: boolean; email: string; auth_uid: string } | null
  let profile: ProfileType = null

  // Tentar buscar por auth_uid
  const { data: profileByUid, error: errorByUid } = await supabase
    .from('profiles')
    .select('is_admin, email, auth_uid')
    .eq('auth_uid', user.id)
    .single()

  if (errorByUid) {
    console.log('Dashboard: Error finding profile by auth_uid:', errorByUid.message)
  }

  if (!profileByUid && user.email) {
    // Se não encontrou por auth_uid, tentar por email
    const { data: profileByEmail, error: errorByEmail } = await supabase
      .from('profiles')
      .select('is_admin, email, auth_uid')
      .eq('email', user.email)
      .single()

    if (errorByEmail) {
      console.log('Dashboard: Error finding profile by email:', errorByEmail.message)
    }

    profile = (profileByEmail as ProfileType)
  } else {
    profile = (profileByUid as ProfileType)
  }

  if (!profile) {
    console.log('Dashboard: Profile not found, redirecting')
    redirect('/')
  }

  console.log('Dashboard: Profile found:', profile.email, 'is_admin:', profile.is_admin)

  if (!profile.is_admin) {
    console.log('Dashboard: User is not admin, redirecting')
    redirect('/')
  }

  console.log('Dashboard: Access granted, showing dashboard')
  return <DashboardContent />
}

