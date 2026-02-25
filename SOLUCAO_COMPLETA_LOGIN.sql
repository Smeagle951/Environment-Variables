-- =====================================================
-- SOLUÇÃO COMPLETA: Configurar Admin e Corrigir Login
-- =====================================================
-- Execute esta query COMPLETA no Supabase SQL Editor
-- =====================================================

DO $$
DECLARE
  v_auth_uid UUID;
  v_profile_id UUID;
  v_email TEXT := 'fortunatojeferson003@gmail.com';
BEGIN
  RAISE NOTICE '=== INICIANDO CONFIGURAÇÃO ===';
  
  -- 1. Verificar se usuário existe no auth.users
  SELECT id INTO v_auth_uid
  FROM auth.users
  WHERE email = v_email;
  
  IF v_auth_uid IS NULL THEN
    RAISE NOTICE '❌ ERRO: Usuário não encontrado no auth.users!';
    RAISE NOTICE '   Você precisa criar o usuário primeiro no Supabase Auth.';
    RETURN;
  ELSE
    RAISE NOTICE '✅ Usuário encontrado no auth.users: %', v_auth_uid;
  END IF;
  
  -- 2. Verificar se perfil existe
  SELECT id INTO v_profile_id
  FROM public.profiles
  WHERE email = v_email;
  
  IF v_profile_id IS NULL THEN
    -- Criar perfil
    RAISE NOTICE '📝 Criando perfil...';
    INSERT INTO public.profiles (auth_uid, email, is_admin, status)
    VALUES (v_auth_uid, v_email, true, 'active')
    RETURNING id INTO v_profile_id;
    RAISE NOTICE '✅ Perfil criado com sucesso!';
  ELSE
    -- Atualizar perfil existente
    RAISE NOTICE '📝 Atualizando perfil existente...';
    UPDATE public.profiles
    SET 
      auth_uid = v_auth_uid,
      is_admin = true,
      status = 'active',
      updated_at = now()
    WHERE id = v_profile_id;
    RAISE NOTICE '✅ Perfil atualizado com sucesso!';
  END IF;
  
  RAISE NOTICE '=== CONFIGURAÇÃO CONCLUÍDA ===';
END $$;

-- 3. Verificar resultado final
SELECT 
  '=== RESULTADO FINAL ===' as info;

SELECT 
  p.id,
  p.email,
  p.auth_uid,
  p.is_admin,
  p.status,
  CASE 
    WHEN p.auth_uid = u.id THEN '✅ Correto'
    ELSE '❌ Diferente'
  END as auth_uid_match
FROM public.profiles p
LEFT JOIN auth.users u ON u.email = p.email
WHERE p.email = 'fortunatojeferson003@gmail.com';

-- =====================================================
-- Se ainda não funcionar, execute também:
-- =====================================================

-- Verificar se há algum problema com RLS
SELECT 
  '=== VERIFICAR RLS ===' as info;

SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles';

