# ⚡ Solução Rápida: Tela Branca no Executável

## 🔍 Problema Identificado

O executável existe, mas **falta o arquivo `.env.local`** que contém as configurações do Supabase.

---

## ✅ Solução em 3 Passos

### Passo 1: Criar Arquivo `.env.local`

1. **Navegue até:** `admin-dashboard/`
2. **Crie um arquivo** chamado `.env.local`
3. **Adicione o conteúdo:**

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

**Onde encontrar:**
- Acesse: https://app.supabase.com
- Seu projeto → Settings → API
- Copie:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### Passo 2: Regenerar o Executável

O `.env.local` precisa estar presente **ANTES** de gerar o executável:

```powershell
cd admin-dashboard
npm run build:standalone
npm run electron:build:win
```

**Aguarde:** 5-10 minutos

---

### Passo 3: Testar o Executável

1. **Navegue até:**
   ```
   admin-dashboard/dist/win-unpacked/
   ```

2. **Execute:**
   ```
   FortSmart Agro Admin.exe
   ```

3. **Se ainda não abrir:**
   - Execute como administrador (botão direito)
   - Verifique se o Windows Defender não bloqueou

---

## 🚀 Teste Rápido (Script Automático)

Execute no PowerShell:

```powershell
cd admin-dashboard
.\TESTAR_EXECUTAVEL.ps1
```

Este script vai:
- ✅ Verificar se tudo está correto
- ✅ Mostrar o que está faltando
- ✅ Tentar executar o aplicativo
- ✅ Mostrar erros se houver

---

## 🔧 Se o Atalho Está Errado

Se você criou um atalho na área de trabalho:

1. **Clique com botão direito** no atalho
2. **Propriedades**
3. **Verifique o caminho:**
   ```
   C:\Users\fortu\fortsmart_agro_new\admin-dashboard\dist\win-unpacked\FortSmart Agro Admin.exe
   ```

4. **Se estiver errado:**
   - Clique em "Localizar destino"
   - Navegue até: `admin-dashboard/dist/win-unpacked/`
   - Selecione: `FortSmart Agro Admin.exe`

---

## 📋 Checklist Rápido

Antes de tentar abrir:

- [ ] Arquivo `.env.local` existe em `admin-dashboard/`
- [ ] `.env.local` tem `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Build standalone foi gerado (`npm run build:standalone`)
- [ ] Executável foi regenerado (`npm run electron:build:win`)
- [ ] Atalho aponta para `dist/win-unpacked/FortSmart Agro Admin.exe` (não o instalador)

---

## 🚨 Erro Comum: Atalho Aponta para Instalador

**❌ ERRADO:**
```
dist/FortSmart Agro Admin Setup 1.0.0.exe
```

**✅ CORRETO:**
```
dist/win-unpacked/FortSmart Agro Admin.exe
```

---

## 💡 Dica: Criar Novo Atalho

1. **Navegue até:** `admin-dashboard/dist/win-unpacked/`
2. **Clique com botão direito** em `FortSmart Agro Admin.exe`
3. **Enviar para** → **Área de trabalho (criar atalho)**
4. **Renomeie** para "FortSmart Agro Admin"

---

**Status:** ⚡ Solução Rápida - Siga os 3 passos acima

