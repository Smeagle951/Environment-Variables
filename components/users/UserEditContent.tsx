'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { UserSummary } from '@/lib/types/database'
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function UserEditContent({ userId }: { userId: string }) {
  const router = useRouter()
  const [user, setUser] = useState<UserSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    is_active: true,
  })

  useEffect(() => {
    loadUser()
  }, [userId])

  const loadUser = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('admin_users_summary')
        .select('*')
        .eq('id', userId)
        .single()

      if (fetchError) throw fetchError

      setUser(data)
      const userData = data as any
      setFormData({
        full_name: userData.full_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        is_active: userData.is_active ?? true,
      })
    } catch (err: any) {
      console.error('Erro ao carregar usuário:', err)
      setError(err.message || 'Erro ao carregar usuário')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setSaving(true)
      setError(null)

      // Atualizar perfil
      const updateQuery = supabase.from('profiles') as any
      const { error: updateError } = await updateQuery
        .update({
          full_name: formData.full_name || null,
          phone: formData.phone || null,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (updateError) throw updateError

      // Atualizar email no auth (se mudou)
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.admin.updateUserById(
          user.auth_uid,
          { email: formData.email }
        )
        if (emailError) {
          console.warn('Erro ao atualizar email no auth:', emailError)
        }
      }

      router.push(`/dashboard/users/${userId}`)
    } catch (err: any) {
      console.error('Erro ao salvar:', err)
      setError(err.message || 'Erro ao salvar alterações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/dashboard/users"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Voltar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/users/${userId}`}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Usuário</h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Nome completo do usuário"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Usuário ativo
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <Link
              href={`/dashboard/users/${userId}`}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}

