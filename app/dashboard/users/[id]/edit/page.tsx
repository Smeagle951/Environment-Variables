import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import UserEditContent from '@/components/users/UserEditContent'

export default async function UserEditPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Verificar se é admin
  type ProfileType = { is_admin: boolean; email: string; auth_uid: string } | null
  let profile: ProfileType = null
  const { data: profileByUid } = await supabase
    .from('profiles')
    .select('is_admin, email, auth_uid')
    .eq('auth_uid', user.id)
    .single()

  if (!profileByUid && user.email) {
    const { data: profileByEmail } = await supabase
      .from('profiles')
      .select('is_admin, email, auth_uid')
      .eq('email', user.email)
      .single()
    profile = (profileByEmail as ProfileType)
  } else {
    profile = (profileByUid as ProfileType)
  }

  if (!profile?.is_admin) {
    redirect('/')
  }

  return <UserEditContent userId={params.id} />
}

