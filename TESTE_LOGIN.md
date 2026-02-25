# ✅ Teste de Login - Passo a Passo

## Status Atual
- ✅ Perfil encontrado no banco
- ✅ `is_admin = true`
- ✅ `auth_uid` preenchido: `8d5ac928-917a-4cdf-8369-833e13bb8c37`

## Próximos Passos

### 1. Verificar se auth_uid corresponde ao usuário no Auth

Execute no Supabase SQL Editor:

```sql
SELECT 
  p.auth_uid,
  p.email,
  p.is_admin,
  au.id as auth_user_id,
  au.email as auth_email
FROM public.profiles p
LEFT JOIN auth.users au ON au.id = p.auth_uid
WHERE p.email = 'fortunatojeferson003@gmail.com';
```

**Se `auth_user_id` for NULL:**
- O `auth_uid` não corresponde ao ID do usuário no Supabase Auth
- Vá em **Authentication > Users**
- Encontre o usuário e copie o UUID
- Execute:
```sql
UPDATE public.profiles
SET auth_uid = 'uuid_copiado_aqui'
WHERE email = 'fortunatojeferson003@gmail.com';
```

### 2. Testar Login no Navegador

1. **Abra o Console do Navegador** (F12 > Console)
2. **Acesse:** http://localhost:3000
3. **Faça login** com:
   - Email: `fortunatojeferson003@gmail.com`
   - Senha: (sua senha no Supabase Auth)
4. **Observe o console** - você deve ver:
   ```
   🔍 Debug Login:
   - User ID: ...
   - Email: ...
   - Profile encontrado: ...
   - is_admin: true
   - ✅ Login autorizado, redirecionando...
   ```

### 3. Se ainda não funcionar

**Verifique no console:**
- Há algum erro em vermelho?
- O que aparece após "Profile encontrado"?
- Aparece "Login autorizado"?

**Possíveis problemas:**
1. **auth_uid não corresponde** - Veja passo 1
2. **RLS bloqueando** - Verifique políticas na tabela profiles
3. **Senha incorreta** - Verifique em Authentication > Users

### 4. Verificar RLS (Row Level Security)

Se ainda não funcionar, pode ser RLS bloqueando:

```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Se não houver política para leitura, criar:
CREATE POLICY "Users can read own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = auth_uid OR auth.uid() IN (
  SELECT auth_uid FROM public.profiles WHERE is_admin = true
));
```

---

**Teste e me diga o que aparece no console!** 🔍

