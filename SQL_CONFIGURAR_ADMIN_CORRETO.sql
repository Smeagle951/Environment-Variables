-- =====================================================
-- CONFIGURAR USUÁRIO COMO ADMIN - VERSÃO CORRETA
-- =====================================================
-- Execute no Supabase SQL Editor
-- =====================================================

-- 1. Verificar se usuário existe
SELECT 
  id,
  email,
  auth_uid,
  is_admin,
  status,
  created_at
FROM public.profiles
WHERE email = 'fortunatojeferson003@gmail.com';

-- 2. Se não retornar nada, o perfil não existe!
-- Nesse caso, você precisa criar o perfil primeiro

-- 3. Configurar como admin (execute apenas se o perfil existir)
UPDATE public.profiles
SET 
  is_admin = true,
  status = 'active',
  updated_at = now()
WHERE email = 'fortunatojeferson003@gmail.com';

-- 4. Verificar se foi atualizado
SELECT 
  id,
  email,
  auth_uid,
  is_admin,
  status
FROM public.profiles
WHERE email = 'fortunatojeferson003@gmail.com';

-- =====================================================
-- Se o perfil não existir, execute isto primeiro:
-- =====================================================

-- Buscar auth_uid do usuário
SELECT 
  id as auth_uid,
  email,
  created_at
FROM auth.users
WHERE email = 'fortunatojeferson003@gmail.com';

-- Depois, criar o perfil (substitua AUTH_UID_AQUI pelo UUID retornado acima)
-- INSERT INTO public.profiles (auth_uid, email, is_admin, status)
-- VALUES ('AUTH_UID_AQUI', 'fortunatojeferson003@gmail.com', true, 'active');

