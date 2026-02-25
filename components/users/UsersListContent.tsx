'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { UserSummary } from '@/lib/types/database'
import { Users, Search, Filter, Plus, Eye, Key, Mail, Calendar, Shield } from 'lucide-react'
import Link from 'next/link'

export default function UsersListContent() {
  const router = useRouter()
  const [users, setUsers] = useState<UserSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('admin_users_summary')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setUsers(data || [])
    } catch (err: any) {
      console.error('Erro ao carregar usuários:', err)
      setError(err.message || 'Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.plan_name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.access_status === 'active') ||
      (filterStatus === 'trial' && user.access_status === 'trial') ||
      (filterStatus === 'expired' && user.access_status === 'expired')

    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      trial: 'bg-blue-100 text-blue-800',
      expired: 'bg-red-100 text-red-800',
      trial_expired: 'bg-orange-100 text-orange-800',
    }

    const labels = {
      active: 'Ativo',
      trial: 'Trial',
      expired: 'Expirado',
      trial_expired: 'Trial Expirado',
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando usuários...</p>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
              <p className="text-sm text-gray-600">Total: {filteredUsers.length} usuário(s)</p>
            </div>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros e Busca */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou plano..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filtro de Status */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Todos os status</option>
                <option value="active">Ativos</option>
                <option value="trial">Trial</option>
                <option value="expired">Expirados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Lista de Usuários */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Tente ajustar os filtros de busca.'
                : 'Ainda não há usuários cadastrados no sistema.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.full_name || user.email}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{user.email}</span>
                          {user.is_admin && (
                            <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs font-medium flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Status</p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(user.access_status)}
                          {user.days_remaining > 0 && (
                            <span className="text-sm text-gray-600">
                              ({user.days_remaining} dias restantes)
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Plano</p>
                        <p className="text-sm font-medium text-gray-900">
                          {user.plan_name || 'Sem plano'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Criado em</p>
                        <p className="text-sm text-gray-900">
                          {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

