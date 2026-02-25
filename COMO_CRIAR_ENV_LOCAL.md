# 📝 Como Criar o Arquivo .env.local - Passo a Passo

## 🎯 Objetivo

Criar o arquivo `.env.local` com as configurações do Supabase para o Admin Dashboard funcionar.

---

## 📋 PARTE 1: Obter as Chaves do Supabase

### Passo 1: Acessar o Supabase

1. **Abra seu navegador** (Chrome, Edge, Firefox, etc.)
2. **Acesse:** https://app.supabase.com
3. **Faça login** com sua conta

---

### Passo 2: Selecionar o Projeto

1. **Na lista de projetos**, clique no projeto do **FortSmart Agro**
2. Aguarde carregar o dashboard

---

### Passo 3: Acessar as Configurações da API

1. **No menu lateral esquerdo**, procure por **"Settings"** (Configurações)
2. **Clique em "Settings"**
3. **No submenu**, clique em **"API"**

---

### Passo 4: Copiar as Chaves

Você verá uma página com várias informações. Procure por:

#### 🔑 Project URL (URL do Projeto)

- **Localização:** Seção "Project URL" ou "URL do Projeto"
- **Formato:** `https://xxxxxxxxxxxxx.supabase.co`
- **Ação:** **Copie todo o texto** (Ctrl+C)

**Exemplo:**
```
https://abcdefghijklmnop.supabase.co
```

#### 🔑 anon public key (Chave Pública Anônima)

- **Localização:** Seção "Project API keys" → "anon" → "public"
- **Formato:** Uma string longa começando com `eyJ...`
- **Ação:** **Clique no ícone de copiar** (📋) ou selecione e copie (Ctrl+C)

**Exemplo:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **IMPORTANTE:** Use a chave **"anon"** (pública), NÃO a chave **"service_role"** (privada)!

---

## 📋 PARTE 2: Criar o Arquivo .env.local

### Opção A: Usando Bloco de Notas (Mais Fácil)

#### Passo 1: Abrir Bloco de Notas

1. **Pressione:** `Windows + R`
2. **Digite:** `notepad`
3. **Pressione:** Enter

#### Passo 2: Escrever o Conteúdo

**Cole exatamente isto** (substitua pelos seus valores):

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_URL_AQUI.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3a2hqcnBkb291eG5xZG1mZGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTY3NjQsImV4cCI6MjA3ODk5Mjc2NH0.MFlizYqg0dfJMDGPXq3TbmaZMyHwOvKupEaKLvjaJ84
```

**Exemplo real:**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **IMPORTANTE:**
- **NÃO** deixe espaços antes ou depois do `=`
- **NÃO** use aspas (`"` ou `'`)
- **NÃO** adicione linhas em branco extras
- **SIM**, use exatamente como mostrado acima

#### Passo 3: Salvar o Arquivo

1. **Clique em:** Arquivo → Salvar Como (ou `Ctrl+Shift+S`)
2. **Navegue até:** `C:\Users\fortu\fortsmart_agro_new\admin-dashboard\`
3. **No campo "Nome do arquivo":**
   - **Digite:** `.env.local` (com o ponto no início!)
   - **IMPORTANTE:** Se não aparecer, mude o tipo de arquivo para "Todos os arquivos (*.*)"
4. **Clique em:** Salvar

⚠️ **Se aparecer aviso sobre extensão:** Clique em "Sim" para confirmar.

---

### Opção B: Usando PowerShell (Alternativa)

#### Passo 1: Abrir PowerShell

1. **Pressione:** `Windows + X`
2. **Clique em:** "Windows PowerShell" ou "Terminal"

#### Passo 2: Navegar até a Pasta

```powershell
cd C:\Users\fortu\fortsmart_agro_new\admin-dashboard
```

#### Passo 3: Criar o Arquivo

**Substitua pelos seus valores:**

```powershell
@"
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_URL_AQUI.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_AQUI
"@ | Out-File -FilePath ".env.local" -Encoding utf8
```

**Exemplo real:**
```powershell
@"
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
"@ | Out-File -FilePath ".env.local" -Encoding utf8
```

#### Passo 4: Verificar se Foi Criado

```powershell
Test-Path ".env.local"
```

**Deve retornar:** `True`

---

## ✅ Verificação

### Verificar se o Arquivo Foi Criado Corretamente

1. **Navegue até:** `C:\Users\fortu\fortsmart_agro_new\admin-dashboard\`
2. **Procure por:** `.env.local`
3. **Abra o arquivo** e verifique:
   - ✅ Tem 2 linhas
   - ✅ Primeira linha começa com `NEXT_PUBLIC_SUPABASE_URL=`
   - ✅ Segunda linha começa com `NEXT_PUBLIC_SUPABASE_ANON_KEY=`
   - ✅ Não tem espaços antes ou depois do `=`
   - ✅ Não tem aspas

---

## 🚨 Problemas Comuns

### Problema 1: Arquivo Salvo como ".env.local.txt"

**Sintoma:** Arquivo aparece como `.env.local.txt` no Windows Explorer

**Solução:**
1. **Renomeie o arquivo:**
   - Clique com botão direito → Renomear
   - Remova o `.txt` do final
   - Pressione Enter
2. **Se não funcionar:**
   - Abra PowerShell
   - Execute: `Rename-Item ".env.local.txt" ".env.local"`

---

### Problema 2: Não Consigo Ver o Arquivo

**Sintoma:** Arquivo não aparece no Windows Explorer

**Causa:** Arquivos que começam com ponto (`.`) são ocultos por padrão

**Solução:**
1. **No Windows Explorer:**
   - Vá em: Visualizar → Mostrar → Itens ocultos
2. **Ou use PowerShell:**
   ```powershell
   Get-ChildItem -Force | Where-Object { $_.Name -eq ".env.local" }
   ```

---

### Problema 3: Erro ao Salvar

**Sintoma:** Bloco de Notas não deixa salvar

**Solução:**
1. **Mude o tipo de arquivo** para "Todos os arquivos (*.*)"
2. **Ou use PowerShell** (Opção B acima)

---

## 📋 Checklist Final

Antes de continuar, verifique:

- [ ] Arquivo `.env.local` existe em `admin-dashboard/`
- [ ] Arquivo tem exatamente 2 linhas
- [ ] `NEXT_PUBLIC_SUPABASE_URL` tem a URL completa do Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` tem a chave anon (não service_role)
- [ ] Não há espaços antes ou depois do `=`
- [ ] Não há aspas nas linhas
- [ ] Arquivo não tem extensão `.txt`

---

## 🚀 Próximo Passo

Após criar o arquivo `.env.local`:

1. **Regenerar o executável:**
   ```powershell
   cd admin-dashboard
   npm run build:standalone
   npm run electron:build:win
   ```

2. **Testar o executável:**
   ```powershell
   cd dist\win-unpacked
   .\FortSmart Agro Admin.exe
   ```

---

## 💡 Dica: Verificar Conteúdo do Arquivo

Para verificar se o arquivo está correto:

```powershell
cd admin-dashboard
Get-Content ".env.local"
```

**Deve mostrar:**
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

**Status:** 📝 Guia Completo - Siga os passos acima

