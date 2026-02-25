-- =====================================================
-- VERIFICAR E CONFIGURAR USUÁRIO COMO ADMIN
-- =====================================================

-- 1. Verificar usuário atual
SELECT 
  id,
  email,
  auth_uid,
  is_admin,
  status,
  created_at
FROM public.profiles
WHERE email = 'fortunatojeferson003@gmail.com';

-- 2. Se is_admin = false ou NULL, atualizar para admin
UPDATE public.profiles
SET 
  is_admin = true,
  status = 'active',
  updated_at = now()
WHERE email = 'fortunatojeferson003@gmail.com';

-- 3. Verificar se foi atualizado corretamente
SELECT 
  id,
  email,
  auth_uid,
  is_admin,
  status
FROM public.profiles
WHERE email = 'fortunatojeferson003@gmail.com';

-- =====================================================
-- NOTA: Execute cada query separadamente!
-- =====================================================

