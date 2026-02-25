# 🔧 Solução: Erro ECONNREFUSED - Servidor Não Inicia

## 🔍 Problema

O executável tenta conectar ao servidor Next.js na porta 3000, mas o servidor não está iniciando:

```
⚠️ Erro na tentativa X: connect ECONNREFUSED ::1:3000
```

**Causa:** O servidor Next.js standalone não está sendo iniciado corretamente dentro do executável Electron.

---

## ✅ Soluções

### Solução 1: Regenerar Build Standalone e Executável

O build standalone pode estar incompleto ou corrompido:

```powershell
cd admin-dashboard

# 1. Limpar builds anteriores
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# 2. Gerar build standalone
npm run build:standalone

# 3. Verificar se server.js foi criado
Test-Path ".next\standalone\server.js"

# 4. Gerar executável
npm run electron:build:win
```

**Aguarde:** 5-10 minutos para completar.

---

### Solução 2: Verificar Se .env.local Existe

O servidor precisa do arquivo `.env.local`:

```powershell
cd admin-dashboard

# Verificar se existe
Test-Path ".env.local"
```

**Se não existir, crie:**

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

**Importante:** O `.env.local` deve estar na pasta `admin-dashboard/` **ANTES** de gerar o executável.

---

### Solução 3: Verificar Logs do Servidor

Ao executar o aplicativo, observe os logs no terminal:

1. **Abra PowerShell**
2. **Execute:**
   ```powershell
   cd admin-dashboard\dist\win-unpacked
   .\FortSmart Agro Admin.exe
   ```
3. **Observe os logs:**
   - `🚀 Iniciando servidor Next.js...`
   - `📦 Usando build standalone do Next.js`
   - `[Next.js STDOUT]: ...`
   - `[Next.js STDERR]: ...`

**Procure por:**
- ✅ `✅ Servidor Next.js iniciado!` - Servidor iniciou com sucesso
- ❌ `❌ Erro crítico no servidor Next.js!` - Erro ao iniciar
- ❌ `❌ server.js não encontrado` - Build standalone não foi incluído

---

### Solução 4: Verificar Se Build Standalone Foi Incluído

O executável precisa incluir o build standalone:

```powershell
cd admin-dashboard

# Verificar se build standalone existe
Test-Path ".next\standalone\server.js"

# Verificar se foi incluído no executável
Test-Path "dist\win-unpacked\resources\app.asar.unpacked\.next\standalone\server.js"
```

**Se o segundo retornar `False`:**
- O build standalone não foi incluído no executável
- Regenerar executável (Solução 1)

---

### Solução 5: Verificar package.json build Config

O `package.json` deve incluir `.next/standalone/**/*` nos arquivos:

```json
"files": [
  "package.json",
  "electron/**/*",
  ".next/standalone/**/*",  // ← Deve estar aqui
  ".next/static/**/*",
  "public/**/*",
  ".env.local",
  "!node_modules/**/*"
],
"asarUnpack": [
  "electron/**/*",
  ".next/standalone/**/*"  // ← E aqui também
]
```

---

## 🔍 Diagnóstico Avançado

### Verificar Onde o Servidor Está Tentando Iniciar

O código do Electron procura o servidor em:

1. `app.getAppPath()/.next/standalone/server.js`
2. `resources/.next/standalone/server.js` (fallback)

**Para verificar:**

```powershell
# Verificar caminho 1
$appPath = "C:\Users\fortu\fortsmart_agro_new\admin-dashboard\dist\win-unpacked\resources\app.asar"
# (não é possível verificar diretamente, mas está empacotado)

# Verificar caminho 2 (descompactado)
Test-Path "dist\win-unpacked\resources\app.asar.unpacked\.next\standalone\server.js"
```

---

## 🚨 Erros Comuns e Soluções

### Erro: "server.js não encontrado"

**Causa:** Build standalone não foi incluído  
**Solução:** Regenerar build e executável (Solução 1)

### Erro: "Cannot find module"

**Causa:** Dependências faltando no build standalone  
**Solução:** 
```powershell
npm run build:standalone
# Verificar se .next/standalone/node_modules existe
```

### Erro: "Port 3000 already in use"

**Causa:** Outro processo usando a porta  
**Solução:** Fechar outros processos ou mudar porta no código

### Erro: "ENOENT: no such file or directory"

**Causa:** Arquivo ou diretório não encontrado  
**Solução:** Verificar se todos os arquivos foram incluídos no build

---

## 📋 Checklist de Verificação

Antes de tentar abrir o executável:

- [ ] Build standalone foi gerado (`npm run build:standalone`)
- [ ] Arquivo `.next/standalone/server.js` existe
- [ ] Arquivo `.env.local` existe e está configurado
- [ ] Executável foi regenerado (`npm run electron:build:win`)
- [ ] Build standalone foi incluído no executável
- [ ] Porta 3000 está livre
- [ ] Logs mostram que servidor está tentando iniciar

---

## 🚀 Teste Rápido

1. **Regenerar tudo:**
   ```powershell
   cd admin-dashboard
   npm run build:standalone
   npm run electron:build:win
   ```

2. **Executar e observar logs:**
   ```powershell
   cd dist\win-unpacked
   .\FortSmart Agro Admin.exe
   ```

3. **Procurar por:**
   - `✅ Servidor Next.js iniciado!` - Sucesso
   - `❌ Erro crítico` - Falha (verificar logs)

---

## 💡 Dica: Abrir DevTools para Ver Erros

Se o aplicativo abrir mas ficar em branco:

1. **Pressione:** `Ctrl+Shift+I` (ou `F12`)
2. **Vá em:** Console
3. **Procure por erros** JavaScript
4. **Compartilhe os erros** para diagnóstico

---

**Status:** 🔍 Diagnóstico - Siga as soluções acima na ordem

