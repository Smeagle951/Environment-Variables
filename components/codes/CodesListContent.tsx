'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { CodeSummary } from '@/lib/types/database'
import { Key, Search, Filter, Plus, Eye, Copy, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function CodesListContent() {
  const router = useRouter()
  const [codes, setCodes] = useState<CodeSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCodes()
  }, [])

  const loadCodes = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('admin_codes_summary')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (fetchError) throw fetchError

      setCodes(data || [])
    } catch (err: any) {
      console.error('Erro ao carregar códigos:', err)
      setError(err.message || 'Erro ao carregar códigos')
    } finally {
      setLoading(false)
    }
  }

  const filteredCodes = codes.filter(code => {
    const matchesSearch = 
      code.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.group_name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = 
      filterStatus === 'all' ||
      code.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Código copiado!')
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      used: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      max_uses_reached: 'bg-orange-100 text-orange-800',
      pending: 'bg-yellow-100 text-yellow-800',
    }

    const labels = {
      used: 'Usado',
      expired: 'Expirado',
      max_uses_reached: 'Limite Atingido',
      pending: 'Pendente',
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
          <p className="mt-4 text-gray-600">Carregando códigos...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Códigos de Acesso</h1>
              <p className="text-sm text-gray-600">Gerenciar códigos gerados</p>
            </div>
            <Link
              href="/dashboard/codes/generate"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Gerar Novo Código
            </Link>
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
                placeholder="Buscar por código, usuário ou grupo..."
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
                <option value="pending">Pendente</option>
                <option value="used">Usado</option>
                <option value="expired">Expirado</option>
                <option value="max_uses_reached">Limite Atingido</option>
              </select>
            </div>
          </div>
        </div>

        {/* Codes List */}
        {filteredCodes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum código encontrado</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Ainda não há códigos gerados'}
            </p>
            <Link
              href="/dashboard/codes/generate"
              className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Gerar Primeiro Código
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário/Grupo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criado em</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCodes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-gray-900">{code.code}</span>
                        <button
                          onClick={() => copyToClipboard(code.code)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copiar código"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{code.code_type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {code.user_name && (
                          <div>
                            <span className="text-gray-900">{code.user_name}</span>
                            <span className="text-gray-500 text-xs block">{code.user_email}</span>
                          </div>
                        )}
                        {code.group_name && (
                          <span className="text-gray-900">{code.group_name}</span>
                        )}
                        {!code.user_name && !code.group_name && (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(code.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {code.current_uses} / {code.max_uses}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {new Date(code.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/dashboard/codes/${code.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

