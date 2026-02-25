-- =====================================================
-- VIEWS PARA APP ADMIN DASHBOARD - VERSÃO 2
-- FortSmart Agro - Views de Estatísticas e Resumos
-- =====================================================
-- 
-- Esta versão funciona mesmo se a tabela 'farms' não existir
-- 
-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard: https://app.supabase.com
-- 2. Selecione seu projeto
-- 3. Vá em "SQL Editor" (menu lateral)
-- 4. Cole este conteúdo COMPLETO abaixo
-- 5. Clique em "Run" ou pressione Ctrl+Enter
-- 
-- =====================================================

-- =====================================================
-- 1. VIEW: RESUMO DE USUÁRIOS
-- =====================================================

CREATE OR REPLACE VIEW admin_users_summary AS
SELECT 
  p.id,
  p.auth_uid,
  p.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', p.email) as full_name,
  NULL::TEXT as phone,
  p.status as profile_status,
  p.trial_start,
  p.trial_end,
  NULL::INT as trial_days,
  p.has_used_trial,
  COALESCE(p.is_admin, false) as is_admin,
  (p.status IN ('active', 'trial')) as is_active,
  p.created_at,
  p.updated_at,
  NULL::TIMESTAMPTZ as last_login_at,
  
  -- Informações de assinatura
  s.id as subscription_id,
  s.plan as plan_id,
  s.plan as plan_name,
  s.status as subscription_status,
  s.current_period_start as subscription_start,
  s.current_period_end as subscription_end,
  NULL::NUMERIC as price,
  NULL::TEXT as billing_period,
  
  -- Status de acesso calculado
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > now() THEN 'active'
    WHEN p.status = 'trial' AND p.trial_end > now() THEN 'trial'
    WHEN s.status = 'active' AND s.current_period_end <= now() THEN 'expired'
    WHEN p.status = 'trial' AND p.trial_end <= now() THEN 'trial_expired'
    ELSE 'expired'
  END as access_status,
  
  -- Dias restantes
  CASE 
    WHEN s.status = 'active' AND s.current_period_end > now() 
      THEN EXTRACT(DAY FROM s.current_period_end - now())::INT
    WHEN p.status = 'trial' AND p.trial_end > now()
      THEN EXTRACT(DAY FROM p.trial_end - now())::INT
    ELSE 0
  END as days_remaining,
  
  -- Informações de grupo
  fg.id as group_id,
  fg.name as group_name,
  fg.subscription_status as group_subscription_status,
  gm.role as group_role
  
FROM public.profiles p
LEFT JOIN auth.users au ON au.id = p.auth_uid
LEFT JOIN public.subscriptions s ON s.profile_id = p.id AND s.status = 'active'
LEFT JOIN public.group_members gm ON gm.profile_id = p.id AND gm.is_active = true
LEFT JOIN public.farm_groups fg ON fg.id = gm.group_id
ORDER BY p.created_at DESC;

-- =====================================================
-- 2. VIEW: RESUMO DE GRUPOS (SEM DEPENDÊNCIA DE FARMS)
-- =====================================================

CREATE OR REPLACE VIEW admin_groups_summary AS
SELECT 
  fg.id,
  fg.name,
  fg.cnpj,
  fg.email,
  fg.phone,
  fg.subscription_plan_id,
  fg.subscription_status,
  fg.max_farms,
  fg.max_users,
  fg.is_active,
  fg.created_at,
  fg.updated_at,
  
  -- Contadores
  COUNT(DISTINCT gm.id) FILTER (WHERE gm.is_active = true) as member_count,
  0::INT as farm_count,  -- Sempre 0 (tabela farms não existe no Supabase)
  COUNT(DISTINCT ac.id) FILTER (WHERE ac.is_active = true) as active_codes_count,
  
  -- Status calculado
  CASE 
    WHEN fg.subscription_status = 'active' THEN 'active'
    WHEN fg.subscription_status = 'expired' THEN 'expired'
    WHEN fg.subscription_status = 'canceled' THEN 'canceled'
    ELSE 'unknown'
  END as status,
  
  -- Última atividade (sem farms)
  GREATEST(
    fg.updated_at,
    MAX(gm.updated_at)
  ) as last_activity
  
FROM public.farm_groups fg
LEFT JOIN public.group_members gm ON gm.group_id = fg.id
LEFT JOIN public.access_codes ac ON ac.group_id = fg.id
GROUP BY fg.id, fg.name, fg.cnpj, fg.email, fg.phone, 
         fg.subscription_plan_id, fg.subscription_status,
         fg.max_farms, fg.max_users, fg.is_active,
         fg.created_at, fg.updated_at
ORDER BY fg.created_at DESC;

-- =====================================================
-- 3. VIEW: RESUMO DE CÓDIGOS
-- =====================================================

CREATE OR REPLACE VIEW admin_codes_summary AS
SELECT 
  ac.id,
  ac.code,
  ac.code_type,
  ac.expires_at,
  ac.max_uses,
  ac.current_uses,
  ac.is_used,
  ac.is_active,
  ac.created_at,
  ac.used_at,
  
  -- Informações do usuário
  p.id as user_id,
  p.email as user_email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', p.email) as user_name,
  
  -- Informações do grupo
  fg.id as group_id,
  fg.name as group_name,
  
  -- Criador
  creator.email as creator_email,
  COALESCE(creator_au.raw_user_meta_data->>'full_name', creator_au.raw_user_meta_data->>'name', creator.email) as creator_name,
  
  -- Status calculado
  CASE 
    WHEN ac.is_used THEN 'used'
    WHEN ac.expires_at IS NOT NULL AND ac.expires_at < now() THEN 'expired'
    WHEN ac.current_uses >= ac.max_uses THEN 'max_uses_reached'
    ELSE 'pending'
  END as status,
  
  -- Dias até expirar
  CASE 
    WHEN ac.expires_at IS NOT NULL AND ac.expires_at > now()
      THEN EXTRACT(DAY FROM ac.expires_at - now())::INT
    ELSE NULL
  END as days_until_expiry
  
FROM public.access_codes ac
LEFT JOIN public.profiles p ON p.id = ac.profile_id
LEFT JOIN auth.users au ON au.id = p.auth_uid
LEFT JOIN public.farm_groups fg ON fg.id = ac.group_id
LEFT JOIN public.profiles creator ON creator.id = ac.created_by
LEFT JOIN auth.users creator_au ON creator_au.id = creator.auth_uid
ORDER BY ac.created_at DESC;

-- =====================================================
-- 4. VIEW: ESTATÍSTICAS GERAIS
-- =====================================================

CREATE OR REPLACE VIEW admin_statistics AS
SELECT 
  -- Usuários
  (SELECT COUNT(*) FROM public.profiles WHERE status IN ('active', 'trial')) as total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE status = 'trial' AND trial_end > now()) as trial_users,
  (SELECT COUNT(*) FROM public.profiles WHERE status = 'active' OR (status = 'trial' AND trial_end <= now())) as expired_users,
  
  -- Assinaturas
  (SELECT COUNT(*) FROM public.subscriptions WHERE status = 'active' AND current_period_end > now()) as active_subscriptions,
  (SELECT COUNT(*) FROM public.subscriptions WHERE status = 'active' AND current_period_end <= now()) as expired_subscriptions,
  
  -- Grupos
  (SELECT COUNT(*) FROM public.farm_groups WHERE is_active = true) as total_groups,
  (SELECT COUNT(*) FROM public.farm_groups WHERE subscription_status = 'active') as active_groups,
  (SELECT COUNT(*) FROM public.farm_groups WHERE subscription_status = 'expired') as expired_groups,
  
  -- Códigos
  (SELECT COUNT(*) FROM public.access_codes WHERE is_active = true) as total_codes,
  (SELECT COUNT(*) FROM public.access_codes WHERE is_used = true) as used_codes,
  (SELECT COUNT(*) FROM public.access_codes WHERE is_used = false AND (expires_at IS NULL OR expires_at > now())) as pending_codes,
  
  -- Receita (estimada)
  (SELECT 0) as monthly_revenue,  -- Não há coluna price na tabela subscriptions
  
  -- Planos
  (SELECT COUNT(*) FROM public.subscriptions WHERE plan = 'basic' AND status = 'active') as basic_plan_count,
  (SELECT COUNT(*) FROM public.subscriptions WHERE plan = 'advanced' AND status = 'active') as advanced_plan_count,
  (SELECT COUNT(*) FROM public.subscriptions WHERE plan = 'premium' AND status = 'active') as premium_plan_count,
  (SELECT COUNT(*) FROM public.subscriptions WHERE plan = 'enterprise' AND status = 'active') as enterprise_plan_count;

-- =====================================================
-- 5. VIEW: ALERTAS E NOTIFICAÇÕES
-- =====================================================

CREATE OR REPLACE VIEW admin_alerts AS
SELECT 
  'subscription_expiring' as alert_type,
  'Assinatura expirando em 7 dias' as message,
  p.id as user_id,
  p.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', p.email) as full_name,
  s.current_period_end as expiration_date,
  EXTRACT(DAY FROM s.current_period_end - now())::INT as days_until_expiry
FROM public.subscriptions s
JOIN public.profiles p ON p.id = s.profile_id
LEFT JOIN auth.users au ON au.id = p.auth_uid
WHERE s.status = 'active'
  AND s.current_period_end > now()
  AND s.current_period_end <= now() + INTERVAL '7 days'

UNION ALL

SELECT 
  'trial_expiring' as alert_type,
  'Trial expirando em 3 dias' as message,
  p.id as user_id,
  p.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', p.email) as full_name,
  p.trial_end as expiration_date,
  EXTRACT(DAY FROM p.trial_end - now())::INT as days_until_expiry
FROM public.profiles p
LEFT JOIN auth.users au ON au.id = p.auth_uid
WHERE p.status = 'trial'
  AND p.trial_end > now()
  AND p.trial_end <= now() + INTERVAL '3 days'

UNION ALL

SELECT 
  'group_expired' as alert_type,
  'Grupo sem assinatura ativa' as message,
  NULL::UUID as user_id,
  fg.email,
  fg.name as full_name,
  NULL::TIMESTAMPTZ as expiration_date,
  0 as days_until_expiry
FROM public.farm_groups fg
WHERE fg.subscription_status != 'active'
  AND fg.is_active = true

UNION ALL

SELECT 
  'code_expiring' as alert_type,
  'Código expirando em 1 dia' as message,
  ac.profile_id as user_id,
  COALESCE(p.email, fg.email) as email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', p.email, fg.name) as full_name,
  ac.expires_at as expiration_date,
  EXTRACT(DAY FROM ac.expires_at - now())::INT as days_until_expiry
FROM public.access_codes ac
LEFT JOIN public.profiles p ON p.id = ac.profile_id
LEFT JOIN auth.users au ON au.id = p.auth_uid
LEFT JOIN public.farm_groups fg ON fg.id = ac.group_id
WHERE ac.is_active = true
  AND ac.is_used = false
  AND ac.expires_at IS NOT NULL
  AND ac.expires_at > now()
  AND ac.expires_at <= now() + INTERVAL '1 day';

-- =====================================================
-- 6. VIEW: HISTÓRICO DE ACESSOS
-- =====================================================

CREATE OR REPLACE VIEW admin_access_history AS
SELECT 
  al.id,
  al.profile_id,
  p.email as user_email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', p.email) as user_name,
  al.group_id,
  fg.name as group_name,
  al.access_type,
  al.success,
  al.reason,
  al.ip_address,
  al.device_id,
  al.access_code_id,
  ac.code as access_code,
  al.created_at
FROM public.access_logs al
LEFT JOIN public.profiles p ON p.id = al.profile_id
LEFT JOIN auth.users au ON au.id = p.auth_uid
LEFT JOIN public.farm_groups fg ON fg.id = al.group_id
LEFT JOIN public.access_codes ac ON ac.id = al.access_code_id
ORDER BY al.created_at DESC;

-- =====================================================
-- FIM
-- =====================================================

-- Comentários
COMMENT ON VIEW admin_users_summary IS 'Resumo completo de todos os usuários para dashboard admin';
COMMENT ON VIEW admin_groups_summary IS 'Resumo completo de todos os grupos para dashboard admin (sem dependência de farms)';
COMMENT ON VIEW admin_codes_summary IS 'Resumo completo de todos os códigos para dashboard admin';
COMMENT ON VIEW admin_statistics IS 'Estatísticas gerais do sistema para dashboard admin';
COMMENT ON VIEW admin_alerts IS 'Alertas e notificações para dashboard admin';
COMMENT ON VIEW admin_access_history IS 'Histórico completo de acessos para dashboard admin';

