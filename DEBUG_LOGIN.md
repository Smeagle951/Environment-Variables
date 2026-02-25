# 🔍 Debug: Problema de Login

## ❌ Problema

Após fazer login, fica preso na tela de login e não entra no dashboard.

## 🔍 Possíveis Causas

1. **Sessão não está sendo salva** após o login
2. **Verificação de admin falhando** no servidor
3. **Redirecionamento não está funcionando**
4. **Cookies não estão sendo salvos**

## ✅ Correções Aplicadas

1. ✅ Adicionado delay para garantir que sessão seja salva
2. ✅ Verificação de sessão antes de redirecionar
3. ✅ Logs de debug melhorados

## 🧪 Como Testar

### 1. Abrir Console do Navegador

Pressione **F12** e vá na aba **Console**

### 2. Fazer Login

Digite email e senha e clique em "Entrar"

### 3. Verificar Logs

Você deve ver no console:
```
🔍 Iniciando login...
✅ Usuário autenticado: [uuid]
📧 Email: [seu-email]
🔍 Buscando perfil por auth_uid...
✅ Perfil encontrado por auth_uid
🔑 is_admin: true
✅ Login autorizado! Salvando sessão...
✅ Sessão confirmada!
🔄 Redirecionando para dashboard...
```

### 4. Se Não Funcionar

Verifique:
- ✅ Se `is_admin: true` aparece nos logs
- ✅ Se `Sessão confirmada!` aparece
- ✅ Se há algum erro no console

## 🔧 Verificações Adicionais

### Verificar se Usuário é Admin

Execute no Supabase SQL Editor:

```sql
SELECT 
  id,
  email,
  auth_uid,
  is_admin,
  status
FROM public.profiles
WHERE email = 'seu-email@exemplo.com';
```

**Deve retornar:**
- `is_admin = true`
- `status = 'active'` (ou não NULL)

### Se is_admin = false

Execute:

```sql
UPDATE public.profiles
SET is_admin = true, status = 'active'
WHERE email = 'seu-email@exemplo.com';
```

## 🚀 Próximos Passos

1. **Teste novamente** com os logs de debug
2. **Verifique o console** do navegador (F12)
3. **Envie os logs** se ainda não funcionar

---

**Status:** Correções aplicadas - Teste e verifique os logs no console!
