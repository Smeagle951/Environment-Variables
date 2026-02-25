-- =====================================================
-- VERIFICAR RLS (Row Level Security) NA TABELA PROFILES
-- =====================================================
-- Se RLS estiver bloqueando, precisamos criar políticas
-- =====================================================

-- 1. Verificar se RLS está ativo
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename = 'profiles';

-- 2. Verificar políticas existentes
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- 3. Se não houver política para SELECT, criar:
-- =====================================================
-- CRIAR POLÍTICA PARA PERMITIR LEITURA DE PERFIS
-- =====================================================

-- Política para admins lerem todos os perfis
CREATE POLICY IF NOT EXISTS "Admins can read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.auth_uid = auth.uid()
    AND p.is_admin = true
  )
);

-- Política para usuários lerem seu próprio perfil
CREATE POLICY IF NOT EXISTS "Users can read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth_uid = auth.uid());

-- =====================================================
-- VERIFICAR SE FUNCIONOU
-- =====================================================
SELECT * FROM pg_policies WHERE tablename = 'profiles';

