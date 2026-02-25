// Tipos baseados nas views do Supabase

export interface UserSummary {
  id: string
  auth_uid: string
  email: string
  full_name: string | null
  phone: string | null
  profile_status: string
  trial_start: string | null
  trial_end: string | null
  trial_days: number | null
  has_used_trial: boolean
  is_admin: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  last_login_at: string | null
  subscription_id: string | null
  plan_id: string | null
  plan_name: string | null
  subscription_status: string | null
  subscription_start: string | null
  subscription_end: string | null
  price: number | null
  billing_period: string | null
  access_status: 'active' | 'trial' | 'expired' | 'trial_expired'
  days_remaining: number
  group_id: string | null
  group_name: string | null
  group_subscription_status: string | null
  group_role: string | null
}

export interface GroupSummary {
  id: string
  name: string
  cnpj: string | null
  email: string | null
  phone: string | null
  subscription_plan_id: string | null
  subscription_status: string
  max_farms: number | null
  max_users: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  member_count: number
  farm_count: number
  active_codes_count: number
  status: 'active' | 'expired' | 'canceled' | 'unknown'
  last_activity: string | null
}

export interface CodeSummary {
  id: string
  code: string
  code_type: string
  expires_at: string | null
  max_uses: number
  current_uses: number
  is_used: boolean
  is_active: boolean
  created_at: string
  used_at: string | null
  user_id: string | null
  user_email: string | null
  user_name: string | null
  group_id: string | null
  group_name: string | null
  creator_email: string | null
  creator_name: string | null
  status: 'used' | 'expired' | 'max_uses_reached' | 'pending'
  days_until_expiry: number | null
}

export interface Statistics {
  total_users: number
  trial_users: number
  expired_users: number
  active_subscriptions: number
  expired_subscriptions: number
  total_groups: number
  active_groups: number
  expired_groups: number
  total_codes: number
  used_codes: number
  pending_codes: number
  monthly_revenue: number
  basic_plan_count: number
  advanced_plan_count: number
  premium_plan_count: number
  enterprise_plan_count: number
}

export interface Alert {
  alert_type: string
  message: string
  user_id: string | null
  email: string | null
  full_name: string | null
  expiration_date: string | null
  days_until_expiry: number
}

