# 🔧 Diagnóstico: Erro -102

## ❌ Erro Encontrado

```
Error Code: -102
URL: http://localhost:3000/
```

## 🔍 Possíveis Causas

O erro **-102** geralmente indica:
1. **Variáveis de ambiente não configuradas**
2. **Problema de conexão com Supabase**
3. **Servidor Next.js não iniciado corretamente**
4. **Arquivo .env não carregado**

---

## ✅ Soluções

### 1. Verificar Arquivo .env

Certifique-se de que o arquivo `.env` existe em `admin-dashboard/` e contém:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### 2. Usar Script de Cópia

Execute o script para copiar as variáveis do projeto Flutter:

```powershell
cd admin-dashboard
.\copiar-env.ps1
```

### 3. Verificar se o Servidor Está Rodando

Certifique-se de que o servidor Next.js está rodando:

```bash
cd admin-dashboard
npm run dev
```

### 4. Reiniciar o Servidor

Se o servidor já estava rodando, reinicie:

1. Pare o servidor (Ctrl+C)
2. Execute novamente: `npm run dev`

### 5. Verificar Console do Navegador

Abra o console do navegador (F12) e verifique se há erros mais específicos.

### 6. Verificar Logs do Terminal

Verifique o terminal onde o `npm run dev` está rodando para ver erros específicos.

---

## 🔍 Verificação Rápida

Execute este comando para verificar se as variáveis estão configuradas:

```powershell
cd admin-dashboard
Get-Content .env | Select-String "NEXT_PUBLIC"
```

Deve mostrar:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 🛠️ Correções Aplicadas

Adicionei tratamento de erros melhor no código:
- ✅ Verificação de variáveis de ambiente
- ✅ Mensagens de erro mais claras
- ✅ Tratamento de erros no middleware
- ✅ Tratamento de erros na página inicial

---

## 📝 Próximos Passos

1. **Verifique o arquivo .env**
2. **Reinicie o servidor** (`npm run dev`)
3. **Verifique os logs** no terminal
4. **Verifique o console** do navegador

Se o erro persistir, envie:
- Mensagem de erro completa do terminal
- Mensagem de erro do console do navegador
- Conteúdo do arquivo .env (sem mostrar as chaves completas)

---

**Status:** Correções aplicadas - Reinicie o servidor e teste novamente

