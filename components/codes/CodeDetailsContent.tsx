'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { CodeSummary } from '@/lib/types/database'
import { ArrowLeft, Key, Copy, Mail, Calendar, Users, Building2, AlertTriangle, Check } from 'lucide-react'
import Link from 'next/link'

export default function CodeDetailsContent({ codeId }: { codeId: string }) {
  const router = useRouter()
  const [code, setCode] = useState<CodeSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadCodeDetails()
  }, [codeId])

  const loadCodeDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('admin_codes_summary')
        .select('*')
        .eq('id', codeId)
        .single()

      if (fetchError) throw fetchError

      setCode(data)
    } catch (err: any) {
      console.error('Erro ao carregar detalhes do código:', err)
      setError(err.message || 'Erro ao carregar detalhes do código')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
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
          <p className="mt-4 text-gray-600">Carregando detalhes do código...</p>
        </div>
      </div>
    )
  }

  if (error || !code) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro</h2>
          <p className="text-gray-600 mb-4">{error || 'Código não encontrado'}</p>
          <Link
            href="/dashboard/codes"
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
                href="/dashboard/codes"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Detalhes do Código</h1>
                <p className="text-sm text-gray-600">Informações completas do código de acesso</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Código */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Código de Acesso</h2>
              <div className="bg-gray-50 border-2 border-primary-500 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Código</p>
                    <p className="text-3xl font-mono font-bold text-primary-600">{code.code}</p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
            </div>

            {/* Informações do Código */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  {getStatusBadge(code.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tipo</span>
                  <span className="text-sm font-medium text-gray-900">{code.code_type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Usos</span>
                  <span className="text-sm font-medium text-gray-900">
                    {code.current_uses} / {code.max_uses}
                  </span>
                </div>
                {code.expires_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Expira em</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(code.expires_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                {code.days_until_expiry !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dias até expirar</span>
                    <span className="text-sm font-medium text-gray-900">
                      {code.days_until_expiry} dias
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Criado em</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(code.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {code.used_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Usado em</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(code.used_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Associação */}
            {(code.user_name || code.group_name) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Associação</h2>
                {code.user_name && (
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{code.user_name}</p>
                      <p className="text-xs text-gray-500">{code.user_email}</p>
                    </div>
                  </div>
                )}
                {code.group_name && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{code.group_name}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Criador */}
            {code.creator_name && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Criado por</h2>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{code.creator_name}</p>
                    {code.creator_email && (
                      <p className="text-xs text-gray-500">{code.creator_email}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ações Rápidas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações</h2>
              <div className="space-y-2">
                <button
                  onClick={copyToClipboard}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado!' : 'Copiar Código'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

