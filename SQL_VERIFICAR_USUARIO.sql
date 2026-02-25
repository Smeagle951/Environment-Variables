-- =====================================================
-- VERIFICAR USUÁRIO E ADMIN
-- =====================================================
-- Execute este SQL para verificar se o usuário está configurado corretamente
-- =====================================================

-- Verificar perfil pelo email
SELECT 
  id,
  auth_uid,
  email,
  is_admin,
  status,
  created_at
FROM public.profiles
WHERE email = 'fortunatojeferson003@gmail.com';

-- Verificar se o auth_uid está correto
-- (Compare com o ID do usuário em Authentication > Users no Supabase)
SELECT 
  p.id as profile_id,
  p.auth_uid,
  p.email,
  p.is_admin,
  au.id as auth_user_id,
  au.email as auth_email
FROM public.profiles p
LEFT JOIN auth.users au ON au.id = p.auth_uid
WHERE p.email = 'fortunatojeferson003@gmail.com';

-- Se o auth_uid estiver NULL ou incorreto, atualize:
-- UPDATE public.profiles
-- SET auth_uid = 'uuid_do_usuario_aqui'  -- UUID do usuário em Authentication > Users
-- WHERE email = 'fortunatojeferson003@gmail.com';

