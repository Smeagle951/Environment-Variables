# 🔧 Como Resolver: Carregamento Infinito no Electron

## ❌ Problema

```
❌ Tela infinita de carregamento no login
❌ Dashboard não abre
❌ Electron fica travado
```

---

## ✅ Soluções Aplicadas

### 1. **Verificação do Servidor Antes de Carregar**

O Electron agora verifica se o servidor Next.js está pronto antes de tentar carregar a página.

**O que foi feito:**
- ✅ Função `checkServerReady()` que verifica se `http://localhost:3000` está respondendo
- ✅ Aguarda até 30 segundos (30 tentativas de 1 segundo)
- ✅ Só carrega a página quando o servidor está pronto

### 2. **Tratamento de Erros de Carregamento**

Se o servidor não estiver pronto, o Electron:
- ✅ Tenta carregar mesmo assim (pode funcionar se o servidor iniciar logo depois)
- ✅ Se falhar com erro -106 ou -105, tenta novamente após 2 segundos
- ✅ Logs detalhados para debug

### 3. **Ajuste no Redirecionamento**

O LoginPage agora detecta se está rodando no Electron e usa `window.location.href` em vez de `replace`, que funciona melhor no Electron.

---

## 🚀 Como Usar Agora

### Opção 1: Usar Script Automático (Recomendado)

```powershell
cd admin-dashboard
.\testar-electron.ps1
```

Este script:
1. ✅ Verifica se o servidor está rodando
2. ✅ Inicia o servidor se necessário
3. ✅ Aguarda o servidor estar pronto
4. ✅ Abre o Electron

### Opção 2: Manual (2 Terminais)

**Terminal 1 - Servidor:**
```powershell
cd admin-dashboard
npm run dev
```

**Aguarde ver:**
```
✓ Ready in X seconds
```

**Terminal 2 - Electron:**
```powershell
cd admin-dashboard
npm run electron
```

### Opção 3: Tudo em Um (Desenvolvimento)

```powershell
cd admin-dashboard
npm run electron:dev
```

Este comando:
1. ✅ Inicia o servidor Next.js
2. ✅ Aguarda `http://localhost:3000` estar disponível
3. ✅ Abre o Electron

---

## 🔍 Verificação

### No Terminal do Electron

Você deve ver:
```
Verificando se servidor Next.js está pronto...
✅ Servidor está pronto! Carregando aplicação...
Página carregada com sucesso!
```

### No DevTools do Electron

1. DevTools deve abrir automaticamente
2. Vá na aba **Console**
3. Você deve ver os logs do login:
   ```
   🔍 Iniciando login...
   🔍 ✅ Usuário autenticado: ...
   🔍 🔄 Redirecionando para /dashboard...
   ```

---

## ⚠️ Se Ainda Não Funcionar

### 1. Verificar se Servidor Está Rodando

```powershell
# Verificar porta 3000
netstat -ano | findstr :3000
```

Se não houver resultado, o servidor não está rodando.

**Solução:** Execute `npm run dev` primeiro.

### 2. Verificar Logs do Electron

No terminal onde você executou o Electron, procure por:
- `Verificando se servidor Next.js está pronto...`
- `✅ Servidor está pronto!` ou `❌ Erro ao verificar servidor:`
- `Página carregada com sucesso!` ou `❌ Erro ao carregar:`

### 3. Verificar Variáveis de Ambiente

```powershell
Get-Content .env | Select-String "NEXT_PUBLIC_SUPABASE"
```

Deve mostrar:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 4. Limpar Cache do Electron

O Electron salva cache. Para limpar:

```powershell
# Fechar todos os processos Electron
Get-Process | Where-Object {$_.ProcessName -like "*electron*"} | Stop-Process -Force

# Limpar cache (opcional)
Remove-Item -Recurse -Force "$env:APPDATA\fortsmart-agro-admin-electron" -ErrorAction SilentlyContinue
```

---

## 📝 Checklist

Antes de abrir o Electron:

- [ ] Servidor Next.js está rodando (`npm run dev`)
- [ ] Servidor mostra "Ready in X seconds"
- [ ] Porta 3000 está livre
- [ ] Arquivo `.env` está configurado
- [ ] Variáveis `NEXT_PUBLIC_SUPABASE_*` estão definidas

Ao abrir o Electron:

- [ ] Terminal mostra "Servidor está pronto!"
- [ ] Terminal mostra "Página carregada com sucesso!"
- [ ] Janela do Electron abre
- [ ] DevTools abre automaticamente
- [ ] Página de login aparece

Ao fazer login:

- [ ] Login funciona
- [ ] Redireciona para `/dashboard`
- [ ] Dashboard carrega corretamente

---

## 🎯 Resumo das Mudanças

1. ✅ **Electron verifica servidor antes de carregar**
2. ✅ **Tratamento de erros melhorado**
3. ✅ **Logs detalhados para debug**
4. ✅ **Redirecionamento ajustado para Electron**
5. ✅ **Script de teste automático criado**

---

**Status:** ✅ Correções aplicadas - Teste seguindo os passos acima!

