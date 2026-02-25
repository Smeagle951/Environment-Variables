# 🎛️ FortSmart Agro - Admin Dashboard

Painel administrativo completo para gerenciamento de usuários, grupos e códigos de acesso do FortSmart Agro.

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Backend e autenticação
- **React Query** - Gerenciamento de estado e cache

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Supabase configurada
- Usuário admin no banco de dados

## 🔧 Instalação

1. **Instalar dependências:**
```bash
npm install
# ou
yarn install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
```

3. **Executar views SQL no Supabase:**
Execute o arquivo `supabase/migrations/004_admin_dashboard_views.sql` no SQL Editor do Supabase para criar as views necessárias.

4. **Iniciar servidor de desenvolvimento:**
```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🔐 Autenticação

O dashboard requer que o usuário:
1. Esteja autenticado no Supabase
2. Tenha `is_admin = true` na tabela `profiles`

## 📁 Estrutura do Projeto

```
admin-dashboard/
├── app/                    # Rotas Next.js
│   ├── dashboard/         # Páginas do dashboard
│   └── layout.tsx         # Layout principal
├── components/            # Componentes React
│   ├── auth/              # Autenticação
│   └── dashboard/         # Componentes do dashboard
├── lib/                   # Utilitários
│   ├── supabase/          # Cliente Supabase
│   └── types/             # Tipos TypeScript
└── public/                # Arquivos estáticos
```

## 🎯 Funcionalidades

### ✅ Implementado
- [x] Autenticação e verificação de admin
- [x] Dashboard principal com estatísticas
- [x] Estrutura base do projeto

### 🚧 Em Desenvolvimento
- [ ] Gerenciamento de usuários
- [ ] Gerenciamento de grupos
- [ ] Gerenciamento de códigos
- [ ] Relatórios e gráficos
- [ ] Exportação de dados

## 📝 Próximos Passos

1. Criar tela de listagem de usuários
2. Criar tela de detalhes do usuário
3. Criar tela de geração de códigos
4. Implementar gráficos e relatórios
5. Adicionar exportação PDF/Excel

## 🔒 Segurança

- Todas as rotas são protegidas por verificação de admin
- RLS (Row Level Security) do Supabase está ativo
- Tokens de autenticação são gerenciados automaticamente

## 📚 Documentação

Consulte `docs/ESPECIFICACAO_APP_ADMIN_DASHBOARD.md` para a especificação completa do sistema.

