# ⚠️ IMPORTANTE - Como Executar o SQL

## ❌ ERRO COMUM

Você está tentando executar o arquivo **`.md`** (markdown) no SQL Editor!

**Isso NÃO funciona!** O SQL Editor só aceita código SQL, não arquivos de documentação.

## ✅ SOLUÇÃO CORRETA

### Passo 1: Abrir o arquivo SQL correto

**NÃO execute:** `RELATORIO_FALTANTE_ADMIN_DASHBOARD.md` ❌  
**Execute:** `SQL_FINAL_EXECUTAR.sql` ✅

### Passo 2: Copiar apenas o código SQL

1. Abra o arquivo: `admin-dashboard/SQL_FINAL_EXECUTAR.sql`
2. **Copie TODO o conteúdo** (do `--` até o final)
3. **NÃO copie** comentários markdown como `#` ou `##`

### Passo 3: Colar no Supabase SQL Editor

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em: **SQL Editor** (menu lateral)
4. **Cole** o código SQL copiado
5. Clique em **"Run"** ou pressione **Ctrl+Enter**

## 📋 Checklist

- [ ] Abri o arquivo `.sql` (não o `.md`)
- [ ] Copiei TODO o conteúdo SQL
- [ ] Colei no SQL Editor do Supabase
- [ ] Executei e não deu erro

## 🐛 Se ainda der erro

**Erro:** "a relação 'public.farms' não existe"

**Solução:** Use o arquivo `SQL_FINAL_EXECUTAR.sql` que **NÃO** referencia farms.

---

**Arquivo correto para executar:** `admin-dashboard/SQL_FINAL_EXECUTAR.sql`

