'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Key, Save, AlertTriangle, Copy, Check } from 'lucide-react'
import Link from 'next/link'

export default function GenerateCodeContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [formData, setFormData] = useState({
    code_type: 'renewal',
    target_type: 'user', // 'user' or 'group'
    profile_id: '',
    group_id: '',
    expires_in_days: 30,
    max_uses: 1,
  })

  const [users, setUsers] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])

  useEffect(() => {
    loadUsers()
    loadGroups()
  }, [])

  const loadUsers = async () => {
    try {
      const { data } = await supabase
        .from('admin_users_summary')
        .select('id, email, full_name')
        .limit(100)
      if (data) setUsers(data)
    } catch (err) {
      console.error('Erro ao carregar usuários:', err)
    }
  }

  const loadGroups = async () => {
    try {
      const { data } = await supabase
        .from('admin_groups_summary')
        .select('id, name')
        .limit(100)
      if (data) setGroups(data)
    } catch (err) {
      console.error('Erro ao carregar grupos:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setGeneratedCode(null)

    try {
      setLoading(true)

      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        throw new Error('Usuário não autenticado')
      }

      const params: Record<string, any> = {
        p_creator_auth_uid: currentUser.id,
        p_code_type: formData.code_type,
        p_expires_in_days: formData.expires_in_days,
        p_max_uses: formData.max_uses,
      }

      if (formData.target_type === 'user' && formData.profile_id) {
        params.p_profile_id = formData.profile_id
      } else if (formData.target_type === 'group' && formData.group_id) {
        params.p_group_id = formData.group_id
      }

      // Fazer type assertion para evitar erro de tipo do TypeScript
      // Supabase RPC não tem tipos definidos para funções customizadas
      const rpc = supabase.rpc as any
      const { data, error: codeError } = await rpc('generate_access_code', params)

      if (codeError) throw codeError

      // Tipar explicitamente o resultado do RPC
      type RpcResult = { success: boolean; code?: string; message?: string }
      
      // Fazer type assertion direto para evitar erro de tipo 'never'
      const rpcData = data as RpcResult[] | RpcResult | null
      
      if (!rpcData) {
        throw new Error('Resposta vazia do servidor')
      }

      // Verificar se é array
      if (Array.isArray(rpcData)) {
        if (rpcData.length > 0) {
          const result = rpcData[0]
          if (result.success && result.code) {
            setGeneratedCode(result.code)
          } else {
            throw new Error(result.message || 'Erro ao gerar código')
          }
        } else {
          throw new Error('Resposta vazia do servidor')
        }
      } else {
        // Se retornar objeto único
        const result = rpcData as RpcResult
        if (result.success && result.code) {
          setGeneratedCode(result.code)
        } else {
          throw new Error(result.message || 'Erro ao gerar código')
        }
      }
    } catch (err: any) {
      console.error('Erro ao gerar código:', err)
      setError(err.message || 'Erro ao gerar código')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/codes"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gerar Código de Acesso</h1>
              <p className="text-sm text-gray-600">Criar um novo código de acesso</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {generatedCode ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Código Gerado com Sucesso!</h2>
              <div className="bg-gray-50 border-2 border-primary-500 rounded-lg p-6 my-6">
                <p className="text-sm text-gray-600 mb-2">Código de Acesso</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl font-mono font-bold text-primary-600">{generatedCode}</span>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setGeneratedCode(null)
                    setFormData({
                      code_type: 'renewal',
                      target_type: 'user',
                      profile_id: '',
                      group_id: '',
                      expires_in_days: 30,
                      max_uses: 1,
                    })
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Gerar Outro
                </button>
                <Link
                  href="/dashboard/codes"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Ver Todos os Códigos
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Código
              </label>
              <select
                value={formData.code_type}
                onChange={(e) => setFormData({ ...formData, code_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="renewal">Renovação</option>
                <option value="trial_extension">Extensão de Trial</option>
                <option value="premium_upgrade">Upgrade Premium</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Associar a
              </label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="target_user"
                    name="target_type"
                    value="user"
                    checked={formData.target_type === 'user'}
                    onChange={(e) => setFormData({ ...formData, target_type: e.target.value, group_id: '' })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="target_user" className="ml-2 block text-sm text-gray-700">
                    Usuário Específico
                  </label>
                </div>
                {formData.target_type === 'user' && (
                  <select
                    value={formData.profile_id}
                    onChange={(e) => setFormData({ ...formData, profile_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Selecione um usuário (opcional)</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name || user.email}
                      </option>
                    ))}
                  </select>
                )}

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="target_group"
                    name="target_type"
                    value="group"
                    checked={formData.target_type === 'group'}
                    onChange={(e) => setFormData({ ...formData, target_type: e.target.value, profile_id: '' })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="target_group" className="ml-2 block text-sm text-gray-700">
                    Grupo/Cooperativa
                  </label>
                </div>
                {formData.target_type === 'group' && (
                  <select
                    value={formData.group_id}
                    onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Selecione um grupo (opcional)</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                )}

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="target_none"
                    name="target_type"
                    value="none"
                    checked={formData.target_type === 'none'}
                    onChange={(e) => setFormData({ ...formData, target_type: e.target.value, profile_id: '', group_id: '' })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="target_none" className="ml-2 block text-sm text-gray-700">
                    Não associar (código genérico)
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validade (dias)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.expires_in_days}
                  onChange={(e) => setFormData({ ...formData, expires_in_days: parseInt(e.target.value) || 30 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Usos
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({ ...formData, max_uses: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                <Key className="w-4 h-4" />
                {loading ? 'Gerando...' : 'Gerar Código'}
              </button>
              <Link
                href="/dashboard/codes"
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}

