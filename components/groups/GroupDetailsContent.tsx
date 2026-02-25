'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { GroupSummary } from '@/lib/types/database'
import { ArrowLeft, Mail, Phone, MapPin, Building2, Users, Key, AlertTriangle, Edit } from 'lucide-react'
import Link from 'next/link'

export default function GroupDetailsContent({ groupId }: { groupId: string }) {
  const router = useRouter()
  const [group, setGroup] = useState<GroupSummary | null>(null)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGroupDetails()
    loadMembers()
  }, [groupId])

  const loadGroupDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('admin_groups_summary')
        .select('*')
        .eq('id', groupId)
        .single()

      if (fetchError) throw fetchError

      setGroup(data)
    } catch (err: any) {
      console.error('Erro ao carregar detalhes do grupo:', err)
      setError(err.message || 'Erro ao carregar detalhes do grupo')
    } finally {
      setLoading(false)
    }
  }

  const loadMembers = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('group_members')
        .select(`
          *,
          profile:profiles!group_members_profile_id_fkey(
            id,
            email,
            full_name
          )
        `)
        .eq('group_id', groupId)
        .eq('is_active', true)

      if (!fetchError && data) {
        setMembers(data)
      }
    } catch (err) {
      console.error('Erro ao carregar membros:', err)
    }
  }

  const generateCode = async () => {
    if (!group) return

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        alert('Usuário não autenticado')
        return
      }

      const rpc = supabase.rpc as any
      const { data, error: codeError } = await rpc('generate_access_code', {
        p_creator_auth_uid: currentUser.id,
        p_code_type: 'renewal',
        p_group_id: group.id,
        p_profile_id: null,
        p_expires_in_days: 30,
        p_max_uses: 1,
      })

      if (codeError) throw codeError

      if (data && data.length > 0) {
        const result = data[0]
        if (result.success) {
          alert(`Código gerado: ${result.code}`)
        } else {
          alert(`Erro: ${result.message}`)
        }
      }
    } catch (err: any) {
      alert(`Erro ao gerar código: ${err.message}`)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      canceled: 'bg-gray-100 text-gray-800',
      unknown: 'bg-yellow-100 text-yellow-800',
    }

    const labels = {
      active: 'Ativo',
      expired: 'Expirado',
      canceled: 'Cancelado',
      unknown: 'Desconhecido',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando detalhes do grupo...</p>
        </div>
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro</h2>
          <p className="text-gray-600 mb-4">{error || 'Grupo não encontrado'}</p>
          <Link
            href="/dashboard/groups"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Voltar para Lista
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/groups"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
                <p className="text-sm text-gray-600">Detalhes do grupo</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={generateCode}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                Gerar Código
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações do Grupo */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Grupo</h2>
              <div className="space-y-4">
                {group.cnpj && (
                  <div>
                    <p className="text-xs text-gray-500">CNPJ</p>
                    <p className="text-sm font-medium text-gray-900">{group.cnpj}</p>
                  </div>
                )}
                {group.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{group.email}</p>
                    </div>
                  </div>
                )}
                {group.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Telefone</p>
                      <p className="text-sm font-medium text-gray-900">{group.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  {getStatusBadge(group.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Criado em</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(group.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Membros */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Membros ({members.length})
              </h2>
              {members.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum membro encontrado</p>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => {
                    const profile = member.profile as any
                    return (
                      <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {profile?.full_name || profile?.email || 'Sem nome'}
                          </p>
                          <p className="text-xs text-gray-500">{profile?.email}</p>
                        </div>
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                          {member.role}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Estatísticas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Membros</span>
                  <span className="text-sm font-medium text-gray-900">{group.member_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fazendas</span>
                  <span className="text-sm font-medium text-gray-900">{group.farm_count || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Códigos Ativos</span>
                  <span className="text-sm font-medium text-gray-900">{group.active_codes_count || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Máx. Fazendas</span>
                  <span className="text-sm font-medium text-gray-900">{group.max_farms || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Máx. Usuários</span>
                  <span className="text-sm font-medium text-gray-900">{group.max_users || '-'}</span>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="space-y-2">
                <button
                  onClick={generateCode}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Gerar Código
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

