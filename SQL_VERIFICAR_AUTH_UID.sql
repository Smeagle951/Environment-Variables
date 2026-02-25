-- =====================================================
-- VERIFICAR SE auth_uid CORRESPONDE AO USUÁRIO NO AUTH
-- =====================================================

-- Verificar perfil
SELECT 
  p.id as profile_id,
  p.auth_uid,
  p.email as profile_email,
  p.is_admin,
  p.status,
  au.id as auth_user_id,
  au.email as auth_email,
  CASE 
    WHEN p.auth_uid = au.id THEN '✅ CORRETO'
    WHEN au.id IS NULL THEN '❌ Usuário não existe no Auth'
    ELSE '❌ DIFERENTE - Precisa atualizar'
  END as status_auth_uid
FROM public.profiles p
LEFT JOIN auth.users au ON au.id = p.auth_uid
WHERE p.email = 'fortunatojeferson003@gmail.com';

-- Se o status mostrar "DIFERENTE" ou "não existe no Auth":
-- 1. Vá em Authentication > Users no Supabase
-- 2. Encontre o usuário fortunatojeferson003@gmail.com
-- 3. Copie o UUID (ID do usuário)
-- 4. Execute:
-- UPDATE public.profiles
-- SET auth_uid = 'uuid_copiado_aqui'
-- WHERE email = 'fortunatojeferson003@gmail.com';

