# 🔧 Solução: Erro "app.asar is being used by another process"

## 🔍 Problema

Ao tentar gerar o executável, aparece o erro:

```
⨯ remove C:\Users\fortu\fortsmart_agro_new\admin-dashboard\dist\win-unpacked\resources\app.asar: 
The process cannot access the file because it is being used by another process.
```

**Causa:** O executável anterior está aberto ou algum processo está usando os arquivos.

---

## ✅ Solução Rápida

### Passo 1: Fechar o Executável

1. **Feche o aplicativo "FortSmart Agro Admin"** se estiver aberto
2. **Feche todas as janelas** do aplicativo
3. **Verifique no Gerenciador de Tarefas:**
   - Pressione: `Ctrl + Shift + Esc`
   - Procure por: "FortSmart Agro Admin" ou "Electron"
   - **Finalize o processo** se encontrar

---

### Passo 2: Limpar Arquivos Antigos

```powershell
cd C:\Users\fortu\fortsmart_agro_new\admin-dashboard

# Fechar processos do Electron (se houver)
Get-Process | Where-Object { $_.ProcessName -like "*electron*" -or $_.ProcessName -like "*FortSmart*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Aguardar 2 segundos
Start-Sleep -Seconds 2

# Remover pasta dist (se necessário)
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
```

---

### Passo 3: Regenerar o Executável

```powershell
cd C:\Users\fortu\fortsmart_agro_new\admin-dashboard
npm run electron:build:win
```

---

## 🔍 Verificar Processos em Uso

Para verificar se há processos usando os arquivos:

```powershell
# Ver processos do Electron
Get-Process | Where-Object { $_.ProcessName -like "*electron*" -or $_.ProcessName -like "*FortSmart*" }

# Ver processos usando arquivos na pasta dist
Get-Process | Where-Object { $_.Path -like "*fortsmart*" }
```

**Se encontrar processos:** Finalize-os antes de tentar gerar novamente.

---

## 💡 Dica: Script Automático

Criei um script que faz tudo automaticamente:

```powershell
cd C:\Users\fortu\fortsmart_agro_new\admin-dashboard
.\LIMPAR_E_GERAR.ps1
```

---

## ⚠️ Sobre os Avisos "Dynamic server usage"

Os avisos que aparecem durante o build:

```
Error in Home page: Dynamic server usage: Route / couldn't be rendered statically because it used `cookies`
```

**São apenas avisos, não erros!** 

- ✅ O build **completa com sucesso** (veja: `✓ Generating static pages (11/11)`)
- ✅ As rotas são marcadas como **dinâmicas (ƒ)** - isso é correto
- ✅ O aplicativo **funcionará normalmente**

**Por quê?** O Next.js tenta renderizar páginas estaticamente, mas como você usa cookies para autenticação, essas páginas precisam ser renderizadas dinamicamente no servidor. Isso é **esperado e correto**.

---

## 📋 Checklist Antes de Gerar

- [ ] Executável anterior está fechado
- [ ] Nenhum processo Electron está rodando
- [ ] Arquivo `.env.local` existe e está configurado
- [ ] Build standalone foi gerado (`npm run build:standalone`)

---

## 🚀 Comandos Completos

```powershell
cd C:\Users\fortu\fortsmart_agro_new\admin-dashboard

# 1. Fechar processos
Get-Process | Where-Object { $_.ProcessName -like "*electron*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. Aguardar
Start-Sleep -Seconds 2

# 3. Gerar executável
npm run electron:build:win
```

---

**Status:** 🔧 Solução - Feche o executável e tente novamente

