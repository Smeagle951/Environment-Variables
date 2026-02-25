# 🔧 Como Configurar Usuário como Admin

## ❌ Erro Encontrado

Você tentou executar uma consulta SQL com erro de sintaxe. A consulta correta está abaixo.

---

## ✅ Consulta SQL Correta

### Passo 1: Verificar Usuário

Execute esta query no Supabase SQL Editor:

```sql
SELECT 
  id,
  email,
  auth_uid,
  is_admin,
  status,
  full_name
FROM public.profiles
WHERE email = 'fortunatojeferson003@gmail.com';
```

### Passo 2: Configurar como Admin

Se `is_admin` for `false` ou `NULL`, execute:

```sql
UPDATE public.profiles
SET 
  is_admin = true,
  status = 'active',
  updated_at = now()
WHERE email = 'fortunatojeferson003@gmail.com';
```

### Passo 3: Verificar se Funcionou

Execute novamente a query do Passo 1 para confirmar que `is_admin = true`.

---

## ⚠️ Erro que Você Teve

**ERRADO:**
```sql
WHERE email = 'fortunatojeferson003@gmail.com limite 100;
```

**CORRETO:**
```sql
WHERE email = 'fortunatojeferson003@gmail.com'
LIMIT 100;
```

**OU (sem LIMIT):**
```sql
WHERE email = 'fortunatojeferson003@gmail.com';
```

---

## 📝 Regras de Sintaxe SQL

1. **Aspas simples** para strings: `'texto'`
2. **Ponto e vírgula** no final: `;`
3. **LIMIT** vem DEPOIS do WHERE, não dentro das aspas
4. **Espaços** entre palavras-chave

---

## 🚀 Próximos Passos

1. Execute a query do **Passo 1** para verificar
2. Se `is_admin = false`, execute a query do **Passo 2**
3. Execute novamente a query do **Passo 1** para confirmar
4. Tente fazer login novamente no Admin Dashboard

---

**Status:** Consultas SQL corretas fornecidas - Execute no Supabase SQL Editor!

