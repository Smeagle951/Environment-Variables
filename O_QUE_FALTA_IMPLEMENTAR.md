# 📋 O que Falta Implementar no Admin Dashboard

**Data:** 2025-12-05  
**Status Atual:** Base funcional completa + Módulo de Usuários parcial

---

## ✅ O que JÁ ESTÁ PRONTO

### 1. Estrutura Base ✅
- ✅ Projeto Next.js 14 configurado
- ✅ TypeScript configurado
- ✅ Tailwind CSS configurado
- ✅ Supabase integrado (client + server)
- ✅ Autenticação e verificação de admin
- ✅ Proteção de rotas

### 2. Backend SQL ✅
- ✅ Views SQL criadas e funcionando:
  - `admin_users_summary`
  - `admin_groups_summary`
  - `admin_codes_summary`
  - `admin_statistics`
  - `admin_alerts`
  - `admin_access_history`

### 3. Dashboard Principal ✅
- ✅ Tela principal com estatísticas
- ✅ Cards de resumo (usuários, grupos, códigos, receita)
- ✅ Sistema de alertas
- ✅ Navegação básica

### 4. Módulo de Usuários ✅ (Parcial)
- ✅ Lista de usuários (`/dashboard/users`)
- ✅ Detalhes do usuário (`/dashboard/users/[id]`)
- ✅ Busca e filtros básicos
- ⚠️ **FALTA:** Edição de usuário
- ⚠️ **FALTA:** Geração de código para usuário específico
- ⚠️ **FALTA:** Histórico de acessos do usuário

---

## ❌ O que FALTA IMPLEMENTAR

### 🔴 FASE 1: Completar Módulo de Usuários

#### 1.1 Edição de Usuário
- [ ] Tela de edição (`/dashboard/users/[id]/edit`)
- [ ] Formulário para editar:
  - Nome completo
  - Email
  - Status (ativo/inativo)
  - Plano de assinatura
  - Data de expiração
- [ ] Validações
- [ ] Feedback de sucesso/erro

#### 1.2 Geração de Código para Usuário
- [ ] Botão "Gerar Código" na tela de detalhes
- [ ] Modal/formulário para gerar código:
  - Tipo de código (trial, premium, etc.)
  - Validade
  - Quantidade de usos
- [ ] Integração com função RPC `generate_access_code`
- [ ] Exibir código gerado
- [ ] Opção de copiar código
- [ ] Opção de enviar por email

#### 1.3 Histórico de Acessos do Usuário
- [ ] Seção na tela de detalhes do usuário
- [ ] Lista de acessos usando `admin_access_history`
- [ ] Filtros por data
- [ ] Informações: data, IP, dispositivo, código usado

---

### 🔴 FASE 2: Módulo de Grupos (0% completo)

#### 2.1 Lista de Grupos
- [ ] Rota `/dashboard/groups`
- [ ] Componente `GroupsListContent.tsx`
- [ ] Listar todos os grupos usando `admin_groups_summary`
- [ ] Cards com informações:
  - Nome do grupo
  - CNPJ
  - Número de membros
  - Número de fazendas
  - Status da assinatura
  - Data de criação
- [ ] Busca por nome/CNPJ
- [ ] Filtros por status
- [ ] Paginação

#### 2.2 Detalhes do Grupo
- [ ] Rota `/dashboard/groups/[id]`
- [ ] Componente `GroupDetailsContent.tsx`
- [ ] Informações completas:
  - Dados do grupo (nome, CNPJ, email, telefone, endereço)
  - Lista de membros com roles
  - Lista de fazendas (se houver)
  - Status da assinatura
  - Histórico de atividades
- [ ] Ações:
  - Editar grupo
  - Adicionar membro
  - Remover membro
  - Gerar código para grupo
  - Ver histórico

#### 2.3 Edição de Grupo
- [ ] Rota `/dashboard/groups/[id]/edit`
- [ ] Formulário para editar:
  - Nome
  - CNPJ
  - Email
  - Telefone
  - Endereço completo
  - Status da assinatura
  - Limites (max_farms, max_users)

#### 2.4 Gerenciamento de Membros
- [ ] Modal para adicionar membro
- [ ] Buscar usuário por email
- [ ] Selecionar role (admin, supervisor, manager, etc.)
- [ ] Lista de membros com ações:
  - Editar role
  - Remover do grupo
  - Ver perfil do membro

#### 2.5 Geração de Código para Grupo
- [ ] Botão "Gerar Código" na tela de detalhes
- [ ] Modal para gerar código específico do grupo
- [ ] Integração com função RPC

---

### 🔴 FASE 3: Módulo de Códigos (0% completo)

#### 3.1 Lista de Códigos
- [ ] Rota `/dashboard/codes`
- [ ] Componente `CodesListContent.tsx`
- [ ] Listar todos os códigos usando `admin_codes_summary`
- [ ] Informações:
  - Código
  - Tipo (trial, premium, etc.)
  - Status (usado, pendente, expirado)
  - Usuário/Grupo associado
  - Data de criação
  - Data de uso (se usado)
  - Validade
- [ ] Busca por código
- [ ] Filtros:
  - Por status
  - Por tipo
  - Por usuário/grupo
  - Por data
- [ ] Paginação

#### 3.2 Detalhes do Código
- [ ] Rota `/dashboard/codes/[id]`
- [ ] Componente `CodeDetailsContent.tsx`
- [ ] Informações completas:
  - Código completo
  - Tipo e status
  - Usuário/Grupo associado
  - Histórico de uso
  - Data de criação e expiração
  - Limites (quantidade de usos)
- [ ] Ações:
  - Copiar código
  - Enviar por email/WhatsApp
  - Desativar código
  - Ver histórico completo

#### 3.3 Geração de Código
- [ ] Rota `/dashboard/codes/generate`
- [ ] Componente `GenerateCodeContent.tsx`
- [ ] Formulário para gerar código:
  - Tipo de código (trial, premium, etc.)
  - Associar a usuário específico (opcional)
  - Associar a grupo específico (opcional)
  - Validade (dias)
  - Quantidade de usos permitidos
  - Plano associado
- [ ] Validações
- [ ] Integração com função RPC `generate_access_code`
- [ ] Exibir código gerado
- [ ] Opções:
  - Copiar código
  - Enviar por email
  - Gerar outro código

#### 3.4 Histórico de Uso
- [ ] Seção na tela de detalhes do código
- [ ] Lista de usos usando `admin_access_history`
- [ ] Informações: data, usuário, IP, dispositivo
- [ ] Filtros por data

---

### 🔴 FASE 4: Relatórios e Gráficos (0% completo)

#### 4.1 Tela de Relatórios
- [ ] Rota `/dashboard/reports`
- [ ] Componente `ReportsContent.tsx`
- [ ] Menu de relatórios disponíveis

#### 4.2 Gráficos
- [ ] Instalar biblioteca de gráficos (ex: `recharts` ou `chart.js`)
- [ ] Gráfico de Receita Mensal/Anual
  - Linha do tempo
  - Filtros por período
- [ ] Gráfico de Usuários por Plano
  - Pizza ou barras
  - Mostrar distribuição
- [ ] Gráfico de Conversão Trial → Pago
  - Taxa de conversão
  - Período de tempo
- [ ] Gráfico de Churn Rate
  - Usuários que cancelaram
  - Tendência
- [ ] Gráfico de Códigos Gerados vs Usados
  - Comparação temporal

#### 4.3 Exportação
- [ ] Exportar relatórios em PDF
  - Usar biblioteca (ex: `jspdf` ou `react-pdf`)
  - Template de relatório
- [ ] Exportar dados em Excel
  - Usar biblioteca (ex: `xlsx`)
  - Exportar tabelas completas
- [ ] Exportar gráficos como imagem
  - PNG ou SVG

---

### 🔴 FASE 5: Melhorias e Funcionalidades Extras

#### 5.1 Navegação e Layout
- [ ] Sidebar de navegação fixa
- [ ] Menu responsivo (mobile)
- [ ] Breadcrumbs
- [ ] Atalhos de teclado

#### 5.2 Busca Avançada
- [ ] Busca global (todos os módulos)
- [ ] Filtros avançados
- [ ] Salvar filtros favoritos

#### 5.3 Notificações
- [ ] Sistema de notificações
- [ ] Alertas em tempo real
- [ ] Notificações de ações importantes

#### 5.4 Auditoria
- [ ] Log de ações do admin
- [ ] Histórico de mudanças
- [ ] Quem fez o quê e quando

#### 5.5 Configurações
- [ ] Tela de configurações
- [ ] Preferências do admin
- [ ] Configurações de notificações

---

## 📊 Progresso Geral

| Módulo | Status | Progresso |
|--------|--------|-----------|
| **Estrutura Base** | ✅ Completo | 100% |
| **Backend SQL** | ✅ Completo | 100% |
| **Dashboard Principal** | ✅ Completo | 100% |
| **Módulo de Usuários** | 🟡 Parcial | 60% |
| **Módulo de Grupos** | ❌ Não iniciado | 0% |
| **Módulo de Códigos** | ❌ Não iniciado | 0% |
| **Relatórios** | ❌ Não iniciado | 0% |
| **Melhorias** | ❌ Não iniciado | 0% |
| **TOTAL** | 🟡 Em desenvolvimento | **~35%** |

---

## 🎯 Prioridade de Implementação

### Prioridade ALTA (Essencial)
1. ✅ Completar Módulo de Usuários (edição, geração de código)
2. 🔴 Módulo de Grupos completo
3. 🔴 Módulo de Códigos completo

### Prioridade MÉDIA (Importante)
4. 🔴 Relatórios básicos
5. 🔴 Gráficos principais

### Prioridade BAIXA (Melhorias)
6. 🔴 Exportação PDF/Excel
7. 🔴 Funcionalidades extras

---

## 🚀 Próximos Passos Recomendados

### Passo 1: Completar Módulo de Usuários
- Implementar edição de usuário
- Implementar geração de código
- Implementar histórico de acessos

### Passo 2: Implementar Módulo de Grupos
- Criar todas as telas e componentes
- Integrar com views SQL
- Testar funcionalidades

### Passo 3: Implementar Módulo de Códigos
- Criar todas as telas e componentes
- Integrar com views SQL
- Testar funcionalidades

### Passo 4: Adicionar Relatórios
- Instalar biblioteca de gráficos
- Criar gráficos principais
- Implementar exportação básica

---

## 📝 Notas

- Todas as views SQL já estão criadas e funcionando
- A estrutura base está sólida
- Foco agora é criar os componentes e telas faltantes
- Cada módulo pode ser implementado independentemente

---

**Status:** 🟡 ~35% completo  
**Próxima Ação:** Completar Módulo de Usuários ou iniciar Módulo de Grupos

