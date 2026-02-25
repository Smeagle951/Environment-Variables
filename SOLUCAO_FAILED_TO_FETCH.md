# 🔧 Solução: Erro "Failed to fetch"

## ❌ Erro Encontrado

```
❌ Erro de autenticação: Failed to fetch
```

## 🔍 Causas Possíveis

1. **Variáveis de ambiente não carregadas** no cliente
2. **URL do Supabase incorreta** ou inacessível
3. **Problema de rede** ou CORS
4. **Servidor Supabase offline**

---

## ✅ Solução

### 1. Verificar Variáveis de Ambiente

Execute no terminal:

```powershell
cd admin-dashboard
Get-Content .env | Select-String "NEXT_PUBLIC_SUPABASE"
```

Deve mostrar:
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 2. Se Não Estiverem Configuradas

Execute o script para copiar:

```powershell
.\copiar-env.ps1
```

### 3. Reiniciar Servidor

**IMPORTANTE:** Após alterar `.env`, você DEVE reiniciar o servidor:

```powershell
# Parar servidor (Ctrl+C)
npm run dev
```

---

## 🔍 Verificação Adicional

### Verificar se Supabase Está Acessível

Abra no navegador:
```
https://seu-projeto.supabase.co
```

Deve carregar normalmente.

### Verificar Console do Navegador

1. Pressione **F12**
2. Vá na aba **Network**
3. Tente fazer login
4. Procure por requisições falhadas (vermelho)
5. Clique na requisição e veja o erro

---

## 🚀 Próximos Passos

1. **Verifique as variáveis** de ambiente
2. **Reinicie o servidor** se necessário
3. **Tente fazer login** novamente
4. **Verifique o console** (F12) para mais detalhes

---

**Status:** Verifique variáveis de ambiente e reinicie o servidor!

