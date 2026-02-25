# 🔧 Solução Completa: Erro "Failed to fetch"

## ❌ Erro Encontrado

```
TypeError: Failed to fetch
LoginPage.tsx:17 🔍 ❌ Erro de autenticação: Failed to fetch
```

## ✅ Diagnóstico

✅ **Conexão TCP:** OK (porta 443 acessível)  
✅ **Variáveis de ambiente:** Configuradas no `.env`  
⚠️ **Problema:** Variáveis podem não estar carregadas no cliente

---

## 🔍 Causas Possíveis

1. **Servidor não reiniciado** após alterar `.env`
2. **Variáveis não expostas** no cliente Next.js
3. **Problema de CORS** (menos provável com Supabase)
4. **Cache do navegador** com configuração antiga

---

## ✅ Solução Passo a Passo

### 1. **PARAR o servidor** (se estiver rodando)

Pressione **Ctrl+C** no terminal onde o servidor está rodando.

### 2. **Limpar cache do Next.js**

```powershell
cd admin-dashboard
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Write-Host "Cache limpo!" -ForegroundColor Green
```

### 3. **Verificar variáveis de ambiente**

```powershell
Get-Content .env | Select-String "NEXT_PUBLIC_SUPABASE"
```

Deve mostrar:
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. **Reiniciar servidor**

```powershell
npm run dev
```

**IMPORTANTE:** Aguarde o servidor iniciar completamente antes de testar!

### 5. **Limpar cache do navegador**

1. Pressione **Ctrl+Shift+Delete**
2. Selecione **"Imagens e arquivos em cache"**
3. Clique em **"Limpar dados"**
4. **Recarregue a página** (F5)

### 6. **Testar login novamente**

---

## 🔍 Verificação Adicional

### Verificar Console do Navegador

1. Pressione **F12**
2. Vá na aba **Console**
3. Procure por mensagens de erro
4. Verifique se aparece:
   ```
   🔍 🔗 URL Supabase: https://ywkhjrpdoouxnqdmfddc...
   ```

Se **NÃO aparecer** a URL, as variáveis não estão carregadas!

### Verificar Network Tab

1. Pressione **F12**
2. Vá na aba **Network**
3. Tente fazer login
4. Procure por requisições para `supabase.co`
5. Clique na requisição e veja:
   - **Status:** Deve ser 200 ou 400 (não 0 ou Failed)
   - **Headers:** Verifique se a URL está correta

---

## 🚨 Se Ainda Não Funcionar

### Opção 1: Verificar se `.env` está no lugar certo

O arquivo `.env` deve estar em:
```
admin-dashboard/.env
```

**NÃO** em:
```
fortsmart_agro_new/.env
```

### Opção 2: Testar conexão manualmente

Execute:
```powershell
.\testar-conexao.ps1
```

### Opção 3: Verificar se Supabase está acessível

Abra no navegador:
```
https://ywkhjrpdoouxnqdmfddc.supabase.co
```

Deve carregar normalmente.

---

## 📝 Checklist Final

- [ ] Servidor foi **parado** e **reiniciado**
- [ ] Cache `.next` foi **limpo**
- [ ] Variáveis estão no `.env` correto
- [ ] Cache do navegador foi **limpo**
- [ ] Console mostra URL do Supabase
- [ ] Network tab mostra requisições

---

**Status:** Siga os passos acima e teste novamente!

