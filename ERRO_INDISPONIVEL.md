# 🔧 Erro "Indisponível" - Solução Rápida

## ❌ Problema

A página mostra "indisponível" e o Fast Refresh fica recarregando.

## ✅ Solução Rápida

### Opção 1: Usar Script Automático

```powershell
cd admin-dashboard
.\limpar-e-reiniciar.ps1
```

### Opção 2: Manual

```powershell
# 1. Parar servidor (Ctrl+C)

# 2. Limpar cache
cd admin-dashboard
Remove-Item -Recurse -Force .next

# 3. Reiniciar
npm run dev
```

---

## 🔍 O Que Fazer

1. **Pare o servidor** (Ctrl+C)
2. **Execute o script:** `.\limpar-e-reiniciar.ps1`
3. **Aguarde** até aparecer "Ready" no terminal
4. **Acesse:** `http://localhost:3000`

---

## 📝 Se Ainda Não Funcionar

Verifique:
- ✅ Erros no terminal (npm run dev)
- ✅ Erros no console do navegador (F12)
- ✅ Se o servidor está rodando na porta 3000

---

**Status:** Execute o script para limpar cache e reiniciar!

