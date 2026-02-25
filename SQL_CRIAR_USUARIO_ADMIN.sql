-- =====================================================
-- CRIAR USUÁRIO ADMIN
-- =====================================================
-- 
-- INSTRUÇÕES:
-- 1. Substitua 'seu_email@exemplo.com' pelo email do usuário
-- 2. Execute este SQL no Supabase SQL Editor
-- 3. O usuário precisa já estar cadastrado no sistema
-- 
-- =====================================================

-- Tornar um usuário admin (substitua o email)
UPDATE public.profiles 
SET is_admin = true,
    status = 'active',  -- Status ativo para admin
    updated_at = now()
WHERE email = 'seu_email@exemplo.com';

-- Verificar se foi atualizado
SELECT 
  id,
  email,
  is_admin,
  status,
  created_at
FROM public.profiles
WHERE email = 'seu_email@exemplo.com';

-- =====================================================
-- Se o usuário não existir, você pode criar um perfil manualmente:
-- =====================================================
-- 
-- 1. Primeiro, crie o usuário no Supabase Auth (Authentication > Users)
-- 2. Depois, execute este SQL (substitua o auth_uid):
-- 
-- INSERT INTO public.profiles (
--   auth_uid,
--   email,
--   is_admin,
--   status,
--   created_at,
--   updated_at
-- ) VALUES (
--   'uuid_do_usuario_aqui',  -- UUID do usuário criado no Auth
--   'admin@fortsmartagro.com',
--   true,
--   'active',
--   now(),
--   now()
-- );

