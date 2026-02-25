# ✅ Passo a Passo Final - Admin Dashboard

## Status Atual

- ✅ **npm install** - Concluído
- ⏳ **Arquivo .env** - Verificando...
- ⏳ **SQL Views** - Pronto para executar
- ⏳ **Usuário Admin** - Pronto para criar
- ⏳ **Testar** - Aguardando configurações

---

## 📋 Passos Restantes

### 1. ✅ Instalar Dependências (CONCLUÍDO)
```bash
cd admin-dashboard
npm install
```
**Status:** ✅ Concluído com sucesso

---

### 2. ⏳ Criar Arquivo .env

**Opção A: Usar Script (Recomendado)**
```powershell
cd admin-dashboard
.\copiar-env.ps1
```

**Opção B: Criar Manualmente**
Crie o arquivo `admin-dashboard/.env` com:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ywkhjrpdoouxnqdmfddc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3a2hqcnBkb291eG5xZG1mZGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTY3NjQsImV4cCI6MjA3ODk5Mjc2NH0.MFlizYqg0dfJMDGPXq3TbmaZMyHwOvKupEaKLvjaJ84

ADMIN_EMAIL=admin@fortsmartagro.com
```

---

### 3. ⏳ Executar SQL no Supabase

1. **Acesse:** https://app.supabase.com
2. **Selecione** seu projeto
3. **Vá em:** SQL Editor (menu lateral)
4. **Abra o arquivo:** `admin-dashboard/SQL_EXECUTAR_SUPABASE.sql`
5. **Copie** todo o conteúdo
6. **Cole** no SQL Editor
7. **Execute** (botão "Run" ou Ctrl+Enter)

**Verificar se funcionou:**
```sql
SELECT * FROM admin_statistics;
```
Se retornar dados (mesmo que vazios), está funcionando! ✅

---

### 4. ⏳ Criar Usuário Admin

1. **Acesse:** Supabase Dashboard > SQL Editor
2. **Abra o arquivo:** `admin-dashboard/SQL_CRIAR_USUARIO_ADMIN.sql`
3. **Substitua** `'seu_email@exemplo.com'` pelo seu email
4. **Execute** o SQL

**Ou execute diretamente:**
```sql
UPDATE public.profiles 
SET is_admin = true,
    status = 'active',
    updated_at = now()
WHERE email = 'seu_email@exemplo.com';
```

**Verificar:**
```sql
SELECT email, is_admin, status 
FROM profiles 
WHERE email = 'seu_email@exemplo.com';
```

---

### 5. ⏳ Testar o Dashboard

```bash
cd admin-dashboard
npm run dev
```

**Acesse:** http://localhost:3000

**Faça login** com o email e senha do usuário admin configurado.

**Se tudo estiver correto, você verá:**
- ✅ Tela de login
- ✅ Após login, dashboard principal
- ✅ Cards com estatísticas
- ✅ Navegação funcionando

---

## 🐛 Troubleshooting

### Erro: "Missing Supabase environment variables"
- **Causa:** Arquivo .env não existe ou está incorreto
- **Solução:** Verificar se o arquivo `.env` existe e tem as variáveis corretas

### Erro: "Acesso Negado"
- **Causa:** Usuário não tem `is_admin = true`
- **Solução:** Executar SQL do passo 4

### Erro: "relation does not exist"
- **Causa:** Views SQL não foram executadas
- **Solução:** Executar SQL do passo 3

### Erro: "Module not found: @supabase/ssr"
- **Causa:** Dependências não instaladas
- **Solução:** Executar `npm install` novamente

---

## 📁 Arquivos Criados

1. ✅ `admin-dashboard/SQL_EXECUTAR_SUPABASE.sql` - SQL completo para views
2. ✅ `admin-dashboard/SQL_CRIAR_USUARIO_ADMIN.sql` - SQL para criar admin
3. ✅ `admin-dashboard/PASSO_A_PASSO_FINAL.md` - Este arquivo

---

## ✅ Checklist Final

- [x] npm install executado
- [ ] Arquivo .env criado
- [ ] SQL views executado no Supabase
- [ ] Usuário admin criado
- [ ] Dashboard testado e funcionando

---

**Próximo passo:** Execute os passos 2, 3, 4 e 5 acima! 🚀

