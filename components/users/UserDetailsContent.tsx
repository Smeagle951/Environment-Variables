'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { UserSummary } from '@/lib/types/database'
import { ArrowLeft, Mail, Calendar, Shield, Key, DollarSign, Users, Building2, AlertTriangle, Edit, History } from 'lucide-react'
import Link from 'next/link'

export default function UserDetailsContent({ userId }: { userId: string }) {
  const router = useRouter()
  const [user, setUser] = useState<UserSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [codes, setCodes] = useState<any[]>([])
  const [accessHistory, setAccessHistory] = useState<any[]>([])

  useEffect(() => {
    loadUserDetails()
    loadUserCodes()
    loadAccessHistory()
  }, [userId])

  const loadUserDetails = async () => {
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
    } catch (err: any) {
      console.error('Erro ao carregar detalhes do usuário:', err)
      setError(err.message || 'Erro ao carregar detalhes do usuário')
    } finally {
      setLoading(false)
    }
  }

  const loadUserCodes = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('admin_codes_summary')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (!fetchError && data) {
        setCodes(data)
      }
    } catch (err) {
      console.error('Erro ao carregar códigos:', err)
    }
  }

  const loadAccessHistory = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('admin_access_history')
        .select('*')
        .eq('user_id', userId)
        .order('access_date', { ascending: false })
        .limit(20)

      if (!fetchError && data) {
        setAccessHistory(data)
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err)
    }
  }

  const generateCode = async () => {
    if (!user) return

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
        p_profile_id: user.id,
        p_group_id: null,
        p_expires_in_days: 30,
        p_max_uses: 1,
      })

      if (codeError) throw codeError

      if (data && data.length > 0) {
        const result = data[0]
        if (result.success) {
          alert(`Código gerado: ${result.code}`)
          loadUserCodes()
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
          <p className="mt-4 text-gray-600">Carregando detalhes do usuário...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro</h2>
          <p className="text-gray-600 mb-4">{error || 'Usuário não encontrado'}</p>
          <Link
            href="/dashboard/users"
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
                href="/dashboard/users"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.full_name || user.email}
                </h1>
                <p className="text-sm text-gray-600">Detalhes do usuário</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/dashboard/users/${userId}/edit`}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
              >
                Editar
              </Link>
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
            {/* Informações Pessoais */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Criado em</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(user.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                {user.is_admin && (
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-xs text-gray-500">Tipo de Usuário</p>
                      <p className="text-sm font-medium text-purple-600">Administrador</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Acesso e Recuperação Especiais */}
            {(user.free_access || user.force_data_recovery || (user.authorized_modules && Object.keys(user.authorized_modules).length > 0)) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-gray-500" />
                  Controles Especiais
                </h2>
                <div className="space-y-4">

                  {user.free_access && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-100">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Acesso Livre Ativo</span>
                      </div>
                      <span className="text-xs text-green-700 bg-green-200 px-2 py-1 rounded-full">Bypass</span>
                    </div>
                  )}

                  {user.force_data_recovery && (
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-100">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-red-900">Recuperação de Dados Pendente</span>
                      </div>
                      <span className="text-xs text-red-700 bg-red-200 px-2 py-1 rounded-full">Agendado</span>
                    </div>
                  )}

                  {user.authorized_modules && Object.keys(user.authorized_modules).some(k => user.authorized_modules![k]) && (
                    <div>
                      <h3 className="text-sm text-gray-600 mb-2 mt-4">Módulos Liberados:</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(user.authorized_modules)
                          .filter(([_, isActive]) => isActive)
                          .map(([key]) => (
                            <span key={key} className="px-2.5 py-1 bg-gray-100 border border-gray-200 text-gray-700 text-xs font-medium rounded">
                              {key === 'dashboard' ? 'Dashboard' :
                                key === 'planting' ? 'Plantio' :
                                  key === 'harvest' ? 'Colheita' :
                                    key === 'inventory' ? 'Estoque' :
                                      key === 'financial' ? 'Financeiro' :
                                        key === 'reports' ? 'Relatórios' : key}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Assinatura */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Assinatura</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  {getStatusBadge(user.access_status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plano</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user.plan_name || 'Sem plano'}
                  </span>
                </div>
                {user.days_remaining > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dias Restantes</span>
                    <span className="text-sm font-medium text-gray-900">
                      {user.days_remaining} dias
                    </span>
                  </div>
                )}
                {user.subscription_end && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Expira em</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(user.subscription_end).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Grupo */}
            {user.group_name && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Grupo</h2>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.group_name}</p>
                    <p className="text-xs text-gray-500">Função: {user.group_role || 'Membro'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Códigos Gerados */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Códigos Gerados</h2>
              {codes.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum código gerado ainda</p>
              ) : (
                <div className="space-y-3">
                  {codes.map((code) => (
                    <div key={code.id} className="border border-gray-200 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-gray-600">{code.code}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${code.status === 'used' ? 'bg-green-100 text-green-800' :
                            code.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {code.status === 'used' ? 'Usado' :
                            code.status === 'pending' ? 'Pendente' :
                              'Expirado'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(code.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="space-y-2">
                <Link
                  href={`/dashboard/users/${userId}/edit`}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar Usuário
                </Link>
                <button
                  onClick={generateCode}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Gerar Código de Renovação
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Histórico de Acessos */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <History className="w-5 h-5" />
            Histórico de Acessos
          </h2>
          {accessHistory.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum acesso registrado ainda</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dispositivo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código Usado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accessHistory.map((access) => (
                    <tr key={access.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(access.access_date).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{access.ip_address || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{access.device_info || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{access.code_used || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

