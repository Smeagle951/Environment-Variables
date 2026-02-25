'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Statistics } from '@/lib/types/database'
import { Users, Building2, Key, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DashboardContent() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Carregar estatísticas
      const { data: statsData, error: statsError } = await supabase
        .from('admin_statistics')
        .select('*')
        .single()

      if (statsError) {
        console.warn('Erro ao carregar estatísticas (pode ser que a view não exista ainda):', statsError.message)
        // Criar estatísticas vazias se a view não existir
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

      // Carregar alertas
      const { data: alertsData, error: alertsError } = await supabase
        .from('admin_alerts')
        .select('*')
        .limit(5)

      if (alertsError) {
        console.warn('Erro ao carregar alertas (pode ser que a view não exista ainda):', alertsError.message)
        setAlerts([])
      } else if (alertsData) {
        setAlerts(alertsData)
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados do dashboard:', error)
      // Mesmo com erro, mostrar dashboard com dados vazios
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
      setAlerts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">FortSmart Agro - Painel Administrativo</p>
            </div>
            <nav className="flex gap-4">
              <Link 
                href="/dashboard/users" 
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                Usuários
              </Link>
              <Link 
                href="/dashboard/groups" 
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                Grupos
              </Link>
              <Link 
                href="/dashboard/codes" 
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                Códigos
              </Link>
              <Link 
                href="/dashboard/reports" 
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                Relatórios
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Usuários"
            value={stats?.total_users || 0}
            subtitle={`${stats?.trial_users || 0} em trial`}
            icon={Users}
            color="blue"
            href="/dashboard/users"
          />
          <StatCard
            title="Grupos"
            value={stats?.total_groups || 0}
            subtitle={`${stats?.active_groups || 0} ativos`}
            icon={Building2}
            color="green"
            href="/dashboard/groups"
          />
          <StatCard
            title="Códigos"
            value={stats?.total_codes || 0}
            subtitle={`${stats?.pending_codes || 0} pendentes`}
            icon={Key}
            color="purple"
            href="/dashboard/codes"
          />
          <StatCard
            title="Receita Mensal"
            value={`R$ ${((stats?.monthly_revenue || 0) / 100).toFixed(2)}`}
            subtitle="Estimada"
            icon={DollarSign}
            color="yellow"
          />
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-yellow-900">Alertas Recentes</h2>
            </div>
            <ul className="space-y-2">
              {alerts.map((alert, index) => (
                <li key={index} className="text-sm text-yellow-800">
                  • {alert.message} - {alert.email}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/dashboard/codes/generate"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
            >
              <Key className="w-6 h-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Gerar Código</h3>
              <p className="text-sm text-gray-600">Criar novo código de acesso</p>
            </Link>
            <Link
              href="/dashboard/users"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
            >
              <Users className="w-6 h-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Ver Usuários</h3>
              <p className="text-sm text-gray-600">Gerenciar todos os usuários</p>
            </Link>
            <Link
              href="/dashboard/groups"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
            >
              <Building2 className="w-6 h-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Ver Grupos</h3>
              <p className="text-sm text-gray-600">Gerenciar grupos e cooperativas</p>
            </Link>
            <Link
              href="/dashboard/reports"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
            >
              <TrendingUp className="w-6 h-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Relatórios</h3>
              <p className="text-sm text-gray-600">Ver gráficos e estatísticas</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  href,
}: {
  title: string
  value: string | number
  subtitle: string
  icon: any
  color: 'blue' | 'green' | 'purple' | 'yellow'
  href?: string
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  }

  const content = (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

