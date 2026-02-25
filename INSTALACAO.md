# 🚀 Guia de Instalação - Admin Dashboard

## Passo 1: Instalar Dependências

```bash
cd admin-dashboard
npm install
```

## Passo 2: Configurar Variáveis de Ambiente

### ✅ Opção Rápida (Recomendado)

Você **já tem** as credenciais no arquivo `.env` do projeto Flutter! 

Execute o script para copiar automaticamente:

```powershell
.\copiar-env.ps1
```

### 📝 Opção Manual

Se preferir criar manualmente, veja o arquivo `COMO_CONFIGURAR_ENV.md` para instruções detalhadas.

**As credenciais são as mesmas do projeto Flutter:**
- `SUPABASE_URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Passo 3: Executar Views SQL

Execute o arquivo SQL no Supabase:

1. Acesse o **SQL Editor** no Supabase Dashboard
2. Abra o arquivo: `supabase/migrations/004_admin_dashboard_views.sql`
3. Copie e cole o conteúdo no SQL Editor
4. Clique em **Run** para executar

Isso criará as views necessárias para o dashboard funcionar.

## Passo 4: Criar Usuário Admin

Você precisa ter um usuário com `is_admin = true` na tabela `profiles`:

```sql
-- Verificar se você tem um usuário admin
SELECT id, email, is_admin 
FROM profiles 
WHERE is_admin = true;

-- Se não tiver, atualizar um usuário existente para admin
UPDATE profiles 
SET is_admin = true 
WHERE email = 'seu_email@exemplo.com';
```

## Passo 5: Iniciar o Servidor

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## ✅ Pronto!

Faça login com o email e senha do usuário admin configurado.

## 🔧 Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env` existe e está na pasta `admin-dashboard`
- Verifique se as variáveis estão corretas (sem espaços extras)

### Erro: "Acesso Negado"
- Verifique se o usuário tem `is_admin = true` na tabela `profiles`
- Execute o SQL do Passo 4 para tornar um usuário admin

### Erro: "relation does not exist"
- Execute o arquivo SQL `004_admin_dashboard_views.sql` no Supabase
- Verifique se as views foram criadas corretamente

