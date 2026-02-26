'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { UserSummary } from '@/lib/types/database'
import { ArrowLeft, Save, AlertTriangle, User, Key, Database } from 'lucide-react'
import Link from 'next/link'

export default function EditUserContent({ userId }: { userId: string }) {
    const router = useRouter()
    const [user, setUser] = useState<UserSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)

    // Form State
    const [fullName, setFullName] = useState('')
    const [status, setStatus] = useState('inactive')

    // Access Control State
    const [freeAccess, setFreeAccess] = useState(false)
    const [forceDataRecovery, setForceDataRecovery] = useState(false)

    // Modules State
    const [modules, setModules] = useState({
        dashboard: true,
        planting: false,
        harvest: false,
        inventory: false,
        financial: false,
        reports: false
    })

    useEffect(() => {
        loadUserDetails()
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
            setFullName(data.full_name || '')
            setStatus(data.profile_status || 'inactive')
            setFreeAccess(data.free_access || false)
            setForceDataRecovery(data.force_data_recovery || false)

            if (data.authorized_modules) {
                setModules(prev => ({ ...prev, ...data.authorized_modules }))
            }

        } catch (err: any) {
            console.error('Erro ao carregar detalhes do usuário:', err)
            setError(err.message || 'Erro ao carregar detalhes do usuário')
        } finally {
            setLoading(false)
        }
    }

    const handleModuleChange = (moduleKey: keyof typeof modules) => {
        setModules(prev => ({
            ...prev,
            [moduleKey]: !prev[moduleKey]
        }))
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) return

        try {
            setSaving(true)
            setError(null)
            setSuccessMsg(null)

            // Em um cenário real Next.js/Supabase admin route, 
            // idealmente atualizar os metadados também se full_name mudar (requer service-role ou edge function)

            // Atualizar a tabela profiles no Supabase
            const updates = {
                status: status,
                free_access: freeAccess,
                force_data_recovery: forceDataRecovery,
                authorized_modules: modules,
                updated_at: new Date().toISOString()
            }

            const { error: updateError } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId)

            if (updateError) throw updateError

            setSuccessMsg('Usuário atualizado com sucesso!')

            // Voltar após breve pausa
            setTimeout(() => {
                router.push(`/dashboard/users/${userId}`)
            }, 1500)

        } catch (err: any) {
            console.error('Erro ao salvar usuário:', err)
            setError(err.message || 'Ocorreu um erro ao salvar as alterações')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando detalhes...</p>
                </div>
            </div>
        )
    }

    if (error && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
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
        <div className="min-h-screen bg-gray-50 pb-12">
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
                            <h1 className="text-2xl font-bold text-gray-900">
                                Editar Usuário
                            </h1>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Form */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                        <p>{successMsg}</p>
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">

                    {/* Sessão 1: Informações Básicas */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-500" />
                            <h2 className="text-lg font-medium text-gray-900">Informações Básicas</h2>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Nome do usuário"
                                    disabled // O nome vem do Auth, precisaria de supabase.auth.admin.updateUserById para alterar
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    * O nome é gerenciado diretamente na autenticação do Supabase. Edição será implementada no futuro.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status da Conta
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="active">🟢 Ativo</option>
                                    <option value="trial">🔵 Trial</option>
                                    <option value="expired">🔴 Expirado</option>
                                    <option value="inactive">⚪ Inativo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Sessão 2: Controle de Acesso e Módulos */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                            <Key className="w-5 h-5 text-gray-500" />
                            <h2 className="text-lg font-medium text-gray-900">Controles de Acesso Avançado</h2>
                        </div>

                        <div className="p-6 space-y-6">

                            {/* Acesso Livre */}
                            <label className="flex items-start cursor-pointer group">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        checked={freeAccess}
                                        onChange={(e) => setFreeAccess(e.target.checked)}
                                        className="w-5 h-5 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                                    />
                                </div>
                                <div className="ml-3">
                                    <span className="block text-sm font-medium text-gray-900 group-hover:text-primary-700">
                                        Acesso Livre (Bypass)
                                    </span>
                                    <span className="block text-sm text-gray-500 mt-1">
                                        Ao ativar, o usuário terá acesso total ao aplicativo independentemente de assinaturas vencidas.
                                    </span>
                                </div>
                            </label>

                            <hr className="border-gray-200" />

                            {/* Módulos */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3">
                                    Permissões de Módulos Específicos
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    {Object.entries({
                                        dashboard: 'Dashboard Principal',
                                        planting: 'Módulo de Plantio',
                                        harvest: 'Módulo de Colheita',
                                        inventory: 'Módulo de Estoque',
                                        financial: 'Gestão Financeira',
                                        reports: 'Geração de Relatórios'
                                    }).map(([key, label]) => (
                                        <label key={key} className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={modules[key as keyof typeof modules]}
                                                onChange={() => handleModuleChange(key as keyof typeof modules)}
                                                className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{label}</span>
                                        </label>
                                    ))}

                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Sessão 3: Recuperação de Dados */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-red-50 flex items-center gap-2">
                            <Database className="w-5 h-5 text-red-600" />
                            <h2 className="text-lg font-medium text-red-800">Forçar Recuperação</h2>
                        </div>

                        <div className="p-6">
                            <label className="flex items-start cursor-pointer group">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        checked={forceDataRecovery}
                                        onChange={(e) => setForceDataRecovery(e.target.checked)}
                                        className="w-5 h-5 border-gray-300 rounded text-red-600 focus:ring-red-500"
                                    />
                                </div>
                                <div className="ml-3">
                                    <span className="block text-sm font-medium text-gray-900">
                                        Agendar Recuperação Forçada do Servidor
                                    </span>
                                    <span className="block text-sm text-gray-500 mt-1">
                                        Se marcado, no próximo login ou sincronização, o App Android desconsiderará o backup local do Google Drive temporariamente e forçará o download das informações contidas aqui no Supabase. O próprio app desmarcará esta opção automaticamente após puxar os dados.
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Botões Acão */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => router.push(`/dashboard/users/${userId}`)}
                            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center gap-2 font-medium shadow-sm transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    )
}
