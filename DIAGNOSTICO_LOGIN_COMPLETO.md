# 🔍 Diagnóstico Completo: Por que não entra?

## 📋 Informações Fornecidas
- **Email:** fortunatojeferson003@gmail.com
- **Senha:** abcabc1234

## 🔍 Possíveis Problemas

### 1. Perfil não existe na tabela `profiles`
O usuário pode estar no `auth.users` mas não ter perfil criado.

**Solução:** Execute no Supabase SQL Editor:

```sql
-- Verificar se existe no auth.users
SELECT id, email FROM auth.users 
WHERE email = 'fortunatojeferson003@gmail.com';

-- Verificar se existe perfil
SELECT id, email, auth_uid, is_admin 
FROM public.profiles 
WHERE email = 'fortunatojeferson003@gmail.com';
```

### 2. Perfil existe mas `is_admin = false`
O usuário existe mas não está marcado como admin.

**Solução:**
```sql
UPDATE public.profiles
SET is_admin = true, status = 'active'
WHERE email = 'fortunatojeferson003@gmail.com';
```

### 3. `auth_uid` não está correto
O perfil existe mas o `auth_uid` não corresponde ao usuário do auth.

**Solução:**
```sql
-- 1. Pegar auth_uid correto
SELECT id FROM auth.users 
WHERE email = 'fortunatojeferson003@gmail.com';

-- 2. Atualizar perfil com auth_uid correto (substitua UUID_AQUI)
UPDATE public.profiles
SET auth_uid = 'UUID_AQUI'::UUID
WHERE email = 'fortunatojeferson003@gmail.com';
```

### 4. Senha incorreta
A senha pode estar errada no banco.

**Solução:** Resetar senha no Supabase Auth ou criar novo usuário.

---

## 🧪 Teste Passo a Passo

### Passo 1: Verificar Console do Navegador

1. Abra o Admin Dashboard
2. Pressione **F12** (abrir DevTools)
3. Vá na aba **Console**
4. Tente fazer login
5. **Copie TODOS os logs** que aparecerem

### Passo 2: Verificar Terminal

No terminal onde `npm run dev` está rodando, você deve ver logs como:
```
Dashboard: User found: [uuid] [email]
Dashboard: Profile found: [email] is_admin: true/false
```

### Passo 3: Executar Queries SQL

Execute no Supabase SQL Editor (uma por vez):

```sql
-- Query 1: Verificar usuário no auth
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'fortunatojeferson003@gmail.com';

-- Query 2: Verificar perfil
SELECT id, email, auth_uid, is_admin, status 
FROM public.profiles 
WHERE email = 'fortunatojeferson003@gmail.com';

-- Query 3: Comparar auth_uid
SELECT 
  u.id as auth_uid,
  p.auth_uid as profile_auth_uid,
  u.email as auth_email,
  p.email as profile_email,
  p.is_admin
FROM auth.users u
LEFT JOIN public.profiles p ON p.email = u.email
WHERE u.email = 'fortunatojeferson003@gmail.com';
```

---

## ✅ Solução Rápida (Tentativa)

Execute esta query completa no Supabase SQL Editor:

```sql
-- 1. Verificar e atualizar perfil
DO $$
DECLARE
  v_auth_uid UUID;
  v_profile_id UUID;
BEGIN
  -- Buscar auth_uid
  SELECT id INTO v_auth_uid
  FROM auth.users
  WHERE email = 'fortunatojeferson003@gmail.com';
  
  IF v_auth_uid IS NULL THEN
    RAISE NOTICE 'Usuário não encontrado no auth.users!';
    RETURN;
  END IF;
  
  -- Verificar se perfil existe
  SELECT id INTO v_profile_id
  FROM public.profiles
  WHERE email = 'fortunatojeferson003@gmail.com';
  
  IF v_profile_id IS NULL THEN
    -- Criar perfil
    INSERT INTO public.profiles (auth_uid, email, is_admin, status)
    VALUES (v_auth_uid, 'fortunatojeferson003@gmail.com', true, 'active');
    RAISE NOTICE 'Perfil criado!';
  ELSE
    -- Atualizar perfil
    UPDATE public.profiles
    SET 
      auth_uid = v_auth_uid,
      is_admin = true,
      status = 'active',
      updated_at = now()
    WHERE id = v_profile_id;
    RAISE NOTICE 'Perfil atualizado!';
  END IF;
END $$;

-- 2. Verificar resultado
SELECT 
  id,
  email,
  auth_uid,
  is_admin,
  status
FROM public.profiles
WHERE email = 'fortunatojeferson003@gmail.com';
```

---

## 📝 O Que Fazer Agora

1. **Execute a query acima** no Supabase SQL Editor
2. **Verifique o resultado** - deve mostrar `is_admin = true`
3. **Tente fazer login novamente**
4. **Abra o console do navegador (F12)** e veja os logs
5. **Me envie:**
   - Resultado da query SQL
   - Logs do console do navegador
   - Logs do terminal (npm run dev)

---

**Status:** Aguardando informações para diagnóstico completo

