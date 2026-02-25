# 🚀 Como Executar o Admin Dashboard

## ❌ Erro Comum

Se você ver este erro:
```
npm error enoent Could not read package.json
```

**Causa:** Você está no diretório errado!

---

## ✅ Solução Correta

### Passo 1: Entrar no Diretório Correto

```powershell
cd admin-dashboard
```

**OU** se estiver na raiz do projeto:

```powershell
cd C:\Users\fortu\fortsmart_agro_new\admin-dashboard
```

### Passo 2: Verificar se Está no Diretório Correto

```powershell
# Deve mostrar: True
Test-Path package.json
```

### Passo 3: Executar o Servidor

```powershell
npm run dev
```

---

## 📁 Estrutura de Diretórios

```
fortsmart_agro_new/              ← Diretório raiz (NÃO tem package.json do Next.js)
├── lib/                          ← Código Flutter
├── android/                      ← Código Android
└── admin-dashboard/              ← ✅ AQUI está o projeto Next.js
    ├── package.json              ← ✅ Este arquivo precisa existir
    ├── app/
    ├── components/
    └── ...
```

---

## ✅ Comandos Corretos

### Opção 1: A partir da raiz do projeto
```powershell
cd admin-dashboard
npm run dev
```

### Opção 2: Direto no diretório
```powershell
cd C:\Users\fortu\fortsmart_agro_new\admin-dashboard
npm run dev
```

---

## 🔍 Verificação Rápida

Antes de executar `npm run dev`, verifique:

```powershell
# 1. Verificar diretório atual
pwd

# 2. Verificar se package.json existe
Test-Path package.json

# 3. Se retornar False, você está no diretório errado!
```

---

## 📝 Resumo

- ❌ **ERRADO:** `npm run dev` na raiz do projeto
- ✅ **CORRETO:** `npm run dev` dentro de `admin-dashboard/`

---

**Status:** Servidor iniciado! Acesse: `http://localhost:3000`

