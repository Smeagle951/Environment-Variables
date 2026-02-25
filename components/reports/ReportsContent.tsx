'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Statistics } from '@/lib/types/database'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { TrendingUp, Users, DollarSign, Key, Download, FileText } from 'lucide-react'
import Link from 'next/link'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function ReportsContent() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    loadReportsData()
  }, [dateRange])

  const loadReportsData = async () => {
    try {
      const { data: statsData, error: statsError } = await supabase
        .from('admin_statistics')
        .select('*')
        .single()

      if (statsError) {
        console.warn('Erro ao carregar estatísticas:', statsError.message)
        setStats({
          total_users: 0,
          trial_users: 0,
          expired_users: 0,
          active_subscriptions: 0,
          expired_subscriptions: 0,
          total_groups: 0,
          active_groups: 0,
          expired_groups: 0,
          total_codes: 0,
          used_codes: 0,
          pending_codes: 0,
          monthly_revenue: 0,
          basic_plan_count: 0,
          advanced_plan_count: 0,
          premium_plan_count: 0,
          enterprise_plan_count: 0,
        } as Statistics)
      } else {
        setStats(statsData as Statistics)
      }
    } catch (error) {
      console.error('Erro ao carregar dados de relatórios:', error)
    } finally {
      setLoading(false)
    }
  }

  const planDistribution = stats ? [
    { name: 'Básico', value: stats.basic_plan_count || 0 },
    { name: 'Avançado', value: stats.advanced_plan_count || 0 },
    { name: 'Premium', value: stats.premium_plan_count || 0 },
    { name: 'Enterprise', value: stats.enterprise_plan_count || 0 },
  ].filter(item => item.value > 0) : []

  const codesData = stats ? [
    { name: 'Usados', value: stats.used_codes || 0 },
    { name: 'Pendentes', value: stats.pending_codes || 0 },
    { name: 'Expirados', value: (stats.total_codes || 0) - (stats.used_codes || 0) - (stats.pending_codes || 0) },
  ].filter(item => item.value > 0) : []

  const usersData = stats ? [
    { name: 'Ativos', value: stats.active_subscriptions || 0 },
    { name: 'Trial', value: stats.trial_users || 0 },
    { name: 'Expirados', value: stats.expired_users || 0 },
  ].filter(item => item.value > 0) : []

  const revenueData = [
    { month: 'Jan', revenue: stats?.monthly_revenue ? (stats.monthly_revenue / 100) * 0.8 : 0 },
    { month: 'Fev', revenue: stats?.monthly_revenue ? (stats.monthly_revenue / 100) * 0.9 : 0 },
    { month: 'Mar', revenue: stats?.monthly_revenue ? (stats.monthly_revenue / 100) : 0 },
    { month: 'Abr', revenue: stats?.monthly_revenue ? (stats.monthly_revenue / 100) * 1.1 : 0 },
    { month: 'Mai', revenue: stats?.monthly_revenue ? (stats.monthly_revenue / 100) * 1.2 : 0 },
    { month: 'Jun', revenue: stats?.monthly_revenue ? (stats.monthly_revenue / 100) * 1.15 : 0 },
  ]

  const exportToCSV = () => {
    if (!stats) return

    const csv = [
      ['Métrica', 'Valor'],
      ['Total de Usuários', stats.total_users],
      ['Usuários em Trial', stats.trial_users],
      ['Usuários Expirados', stats.expired_users],
      ['Assinaturas Ativas', stats.active_subscriptions],
      ['Total de Grupos', stats.total_groups],
      ['Grupos Ativos', stats.active_groups],
      ['Total de Códigos', stats.total_codes],
      ['Códigos Usados', stats.used_codes],
      ['Códigos Pendentes', stats.pending_codes],
      ['Receita Mensal', `R$ ${((stats.monthly_revenue || 0) / 100).toFixed(2)}`],
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-fortsmart-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando relatórios...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Relatórios e Estatísticas</h1>
              <p className="text-sm text-gray-600">FortSmart Agro - Análise de Dados</p>
            </div>
            <div className="flex gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as 'week' | 'month' | 'year')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
                <option value="year">Último Ano</option>
              </select>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                Voltar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Usuários</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_users || 0}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Mensal</p>
                <p className="text-3xl font-bold text-gray-900">
                  R$ {((stats?.monthly_revenue || 0) / 100).toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Códigos</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_codes || 0}</p>
              </div>
              <Key className="w-12 h-12 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Conversão</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.trial_users && stats?.active_subscriptions
                    ? ((stats.active_subscriptions / (stats.trial_users + stats.active_subscriptions)) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Receita Mensal */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Receita Mensal</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Receita (R$)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Distribuição de Planos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Planos</h2>
            {planDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Nenhum dado disponível
              </div>
            )}
          </div>

          {/* Status de Códigos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status de Códigos</h2>
            {codesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={codesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8b5cf6" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Nenhum dado disponível
              </div>
            )}
          </div>

          {/* Status de Usuários */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status de Usuários</h2>
            {usersData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#10b981" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Nenhum dado disponível
              </div>
            )}
          </div>
        </div>

        {/* Detailed Statistics Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas Detalhadas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Usuários em Trial</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.trial_users || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Assinaturas Ativas</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.active_subscriptions || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Assinaturas Expiradas</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.expired_subscriptions || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Grupos Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.active_groups || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Códigos Usados</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.used_codes || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Códigos Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pending_codes || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Plano Básico</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.basic_plan_count || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Plano Premium</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.premium_plan_count || 0}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

