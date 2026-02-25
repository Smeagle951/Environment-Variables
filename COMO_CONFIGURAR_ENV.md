# 🔧 Como Configurar o .env do Admin Dashboard

## ✅ Boa Notícia!

Você **já tem** as credenciais do Supabase no arquivo `.env` do projeto Flutter!

## 🚀 Opção 1: Copiar Automaticamente (Recomendado)

Execute o script PowerShell na pasta `admin-dashboard`:

```powershell
cd admin-dashboard
.\copiar-env.ps1
```

O script vai:
1. ✅ Ler o arquivo `.env` do projeto Flutter
2. ✅ Extrair `SUPABASE_URL` e `SUPABASE_ANON_KEY`
3. ✅ Criar o arquivo `.env` no admin-dashboard com os nomes corretos para Next.js

## 📝 Opção 2: Criar Manualmente

Se preferir criar manualmente:

1. **Crie o arquivo** `admin-dashboard/.env`

2. **Copie este conteúdo** (substitua pelos valores do seu `.env` do Flutter):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ywkhjrpdoouxnqdmfddc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3a2hqcnBkb291eG5xZG1mZGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTY3NjQsImV4cCI6MjA3ODk5Mjc2NH0.MFlizYqg0dfJMDGPXq3TbmaZMyHwOvKupEaKLvjaJ84

# Admin Configuration
ADMIN_EMAIL=admin@fortsmartagro.com
```

**⚠️ IMPORTANTE:**
- No Next.js, as variáveis precisam começar com `NEXT_PUBLIC_` para serem acessíveis no browser
- Use os **mesmos valores** do arquivo `.env` do Flutter
- Não adicione aspas ou espaços extras

## 🔍 Onde Encontrar as Credenciais

Se você não tiver o arquivo `.env` do Flutter, encontre as credenciais no Supabase Dashboard:

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings** (⚙️) > **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** (clique no 👁️) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ✅ Verificar se Funcionou

Após criar o arquivo, execute:

```bash
npm run dev
```

Se não houver erros sobre "Missing Supabase environment variables", está tudo certo! 🎉

