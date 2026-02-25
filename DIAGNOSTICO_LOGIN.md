# 🔍 Diagnóstico - Problema de Login

## Problema Reportado
Usuário faz login mas não consegue acessar o dashboard.

## Possíveis Causas

### 1. RLS (Row Level Security) Bloqueando

**Sintoma:** Login funciona, mas não consegue buscar o perfil.

**Solução:**
Execute o SQL: `admin-dashboard/SQL_VERIFICAR_RLS.sql`

Isso criará políticas para permitir que admins leiam perfis.

### 2. auth_uid não corresponde

**Sintoma:** Perfil não encontrado mesmo existindo.

**Solução:**
```sql
-- Verificar
SELECT 
  p.auth_uid,
  p.email,
  p.is_admin,
  au.id as auth_user_id
FROM public.profiles p
LEFT JOIN auth.users au ON au.id = p.auth_uid
WHERE p.email = 'fortunatojeferson003@gmail.com';

-- Se auth_user_id for NULL, atualizar:
UPDATE public.profiles
SET auth_uid = 'uuid_do_usuario_no_auth'
WHERE email = 'fortunatojeferson003@gmail.com';
```

### 3. Sessão não está sendo salva

**Sintoma:** Redireciona mas volta para login.

**Solução:** O código agora usa `window.location.href` para forçar navegação.

### 4. Erro no console do navegador

**Ação:** Abra F12 > Console e veja os logs de debug.

---

## Teste Passo a Passo

1. **Abra o Console** (F12 > Console)
2. **Limpe o cache** (Ctrl+Shift+Delete)
3. **Acesse:** http://localhost:3000
4. **Faça login**
5. **Observe os logs** no console
6. **Me diga o que aparece**

---

## Correções Aplicadas

1. ✅ Adicionado logs de debug detalhados
2. ✅ Usa `window.location.href` para forçar navegação
3. ✅ Busca por auth_uid E email
4. ✅ Mensagens de erro mais claras
5. ✅ Debug visível na tela

---

**Teste e me diga o que aparece no console!** 🔍
