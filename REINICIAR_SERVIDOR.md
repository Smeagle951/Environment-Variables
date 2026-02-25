# 🔄 Reiniciar Servidor - Solução "Failed to fetch"

## ⚠️ Problema

O erro "Failed to fetch" geralmente ocorre quando:
- Variáveis de ambiente não foram carregadas
- Servidor precisa ser reiniciado após mudanças no `.env`
- Múltiplos processos Node conflitando

---

## ✅ Solução Rápida

### Opção 1: Script Automático (Recomendado)

```powershell
cd admin-dashboard
.\limpar-e-reiniciar.ps1
```

Este script:
1. ✅ Para todos os processos Node
2. ✅ Limpa cache do Next.js (`.next`)
3. ✅ Reinicia o servidor

### Opção 2: Manual

1. **Parar servidor:**
   - Pressione **Ctrl+C** no terminal onde está rodando
   - Ou execute: `Get-Process -Name node | Stop-Process -Force`

2. **Limpar cache:**
   ```powershell
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   ```

3. **Reiniciar:**
   ```powershell
   npm run dev
   ```

---

## 🔍 Verificação

Após reiniciar, verifique:

1. **Console do navegador (F12):**
   - Não deve mostrar erros sobre variáveis faltando
   - Deve mostrar: `🔗 URL Supabase: https://...`

2. **Tente fazer login:**
   - Se ainda der "Failed to fetch", limpe o cache do navegador (Ctrl+Shift+Delete)

---

**Status:** Execute o script e aguarde o servidor iniciar!

