'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { GroupSummary } from '@/lib/types/database'
import { Building2, Search, Filter, Plus, Eye, Users, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function GroupsListContent() {
  const router = useRouter()
  const [groups, setGroups] = useState<GroupSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('admin_groups_summary')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setGroups(data || [])
    } catch (err: any) {
      console.error('Erro ao carregar grupos:', err)
      setError(err.message || 'Erro ao carregar grupos')
    } finally {
      setLoading(false)
    }
  }

  const filteredGroups = groups.filter(group => {
    const matchesSearch = 
      group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.cnpj?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = 
      filterStatus === 'all' ||
      group.status === filterStatus

    return matchesSearch && matchesFilter
  })

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
          <p className="mt-4 text-gray-600">Carregando grupos...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Grupos</h1>
              <p className="text-sm text-gray-600">Gerenciar grupos e cooperativas</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, CNPJ ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativo</option>
                <option value="expired">Expirado</option>
                <option value="canceled">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Groups List */}
        {filteredGroups.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum grupo encontrado</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Ainda não há grupos cadastrados'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <div key={group.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                      {group.cnpj && (
                        <p className="text-xs text-gray-500">CNPJ: {group.cnpj}</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(group.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{group.member_count} membros</span>
                  </div>
                  {group.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-xs">📧 {group.email}</span>
                    </div>
                  )}
                  {group.last_activity && (
                    <div className="text-xs text-gray-500">
                      Última atividade: {new Date(group.last_activity).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>

                <Link
                  href={`/dashboard/groups/${group.id}`}
                  className="block w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-center text-sm font-medium"
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  Ver Detalhes
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

