-- =====================================================
-- VERIFICAR SE TABELAS EXISTEM
-- =====================================================
-- Execute este SQL antes de executar as views
-- para verificar quais tabelas existem no seu banco
-- =====================================================

-- Verificar tabelas principais
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('profiles', 'subscriptions', 'farm_groups', 'group_members', 
                        'access_codes', 'access_logs', 'farms') 
    THEN '✅ Existe'
    ELSE '❌ Não existe'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'subscriptions', 'farm_groups', 'group_members', 
                     'access_codes', 'access_logs', 'farms')
ORDER BY table_name;

-- Verificar se a tabela farms existe especificamente
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'farms'
    ) 
    THEN '✅ Tabela farms EXISTE'
    ELSE '❌ Tabela farms NÃO EXISTE'
  END as farms_status;

-- Se farms não existir, você pode criar uma tabela vazia temporária:
-- (Isso é opcional, as views funcionarão mesmo sem farms)
-- 
-- CREATE TABLE IF NOT EXISTS public.farms (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   group_id UUID REFERENCES public.farm_groups(id) ON DELETE SET NULL,
--   name TEXT,
--   is_active BOOLEAN DEFAULT true,
--   created_at TIMESTAMPTZ DEFAULT now(),
--   updated_at TIMESTAMPTZ DEFAULT now()
-- );

