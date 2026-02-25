# 🔧 Solução: Executável Não Abre

## 🔍 Diagnóstico Rápido

### 1. Verificar Qual Executável Você Está Usando

Há duas opções:

#### Opção A: Instalador (.exe)
- **Localização:** `admin-dashboard/dist/FortSmart Agro Admin Setup 1.0.0.exe`
- **Uso:** Instalar primeiro, depois abrir do menu Iniciar
- **Problema comum:** Tentar abrir o instalador como se fosse o app

#### Opção B: Executável Direto (Portátil)
- **Localização:** `admin-dashboard/dist/win-unpacked/FortSmart Agro Admin.exe`
- **Uso:** Abrir diretamente (não precisa instalar)
- **Recomendado para teste**

---

## ✅ Soluções

### Solução 1: Usar o Executável Direto (Mais Rápido)

1. **Navegue até:**
   ```
   admin-dashboard/dist/win-unpacked/
   ```

2. **Execute:**
   ```
   FortSmart Agro Admin.exe
   ```

3. **Se não abrir:**
   - Clique com botão direito → "Executar como administrador"
   - Verifique se o Windows Defender não bloqueou

---

### Solução 2: Verificar Logs de Erro

Se o executável não abrir, pode haver um erro silencioso. Para ver os logs:

1. **Abra PowerShell ou CMD**
2. **Navegue até a pasta:**
   ```powershell
   cd admin-dashboard/dist/win-unpacked
   ```
3. **Execute com logs:**
   ```powershell
   .\FortSmart Agro Admin.exe
   ```
4. **Observe os erros** que aparecem no terminal

---

### Solução 3: Verificar Se Faltam Arquivos

O executável precisa de:
- ✅ `resources/app.asar` (aplicativo empacotado)
- ✅ `resources/app.asar.unpacked/electron/main.js` (código Electron)
- ✅ Arquivos do Next.js standalone

**Verificar:**
```powershell
# Verificar se arquivos existem
Test-Path "admin-dashboard/dist/win-unpacked/resources/app.asar"
Test-Path "admin-dashboard/dist/win-unpacked/resources/app.asar.unpacked/electron/main.js"
```

**Se não existirem:** Precisa gerar o executável novamente.

---

### Solução 4: Regenerar o Executável

Se o executável estiver corrompido ou incompleto:

```powershell
cd admin-dashboard
npm run electron:build:win
```

**Aguarde:** 5-10 minutos para completar.

---

### Solução 5: Verificar Antivírus/Windows Defender

Às vezes o Windows Defender bloqueia executáveis Electron:

1. **Adicionar exceção:**
   - Windows Security → Virus & threat protection
   - Manage settings → Exclusions
   - Add exclusion → Folder
   - Selecione: `admin-dashboard/dist/`

2. **Ou desabilitar temporariamente** para testar

---

### Solução 6: Verificar Permissões

O executável pode precisar de permissões:

1. **Clique com botão direito** no executável
2. **Propriedades** → **Compatibilidade**
3. **Marque:** "Executar como administrador"
4. **Aplique** e tente novamente

---

## 🔍 Diagnóstico Avançado

### Verificar Se o Servidor Next.js Está Incluído

O executável precisa do build standalone do Next.js:

```powershell
# Verificar se build existe
Test-Path "admin-dashboard/.next/standalone/server.js"
```

**Se não existir:**
```powershell
cd admin-dashboard
npm run build:standalone
```

---

### Verificar Variáveis de Ambiente

O executável precisa do arquivo `.env.local`:

```powershell
# Verificar se existe
Test-Path "admin-dashboard/.env.local"
```

**Se não existir:** Crie com:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
```

**Importante:** O `.env.local` deve estar na pasta `admin-dashboard/` antes de gerar o executável.

---

## 🚨 Erros Comuns

### Erro: "A aplicação não pode ser iniciada"

**Causa:** Arquivos corrompidos ou faltando  
**Solução:** Regenerar executável

### Erro: "Tela branca" ou "Carregando infinitamente"

**Causa:** Servidor Next.js não inicia  
**Solução:** Verificar logs (Solução 2)

### Erro: "Porta 3000 já está em uso"

**Causa:** Outro processo usando a porta  
**Solução:** Fechar outros processos ou mudar porta

### Erro: "Cannot find module"

**Causa:** Dependências faltando no build  
**Solução:** Regenerar executável com `npm run electron:build:win`

---

## 📋 Checklist de Verificação

Antes de tentar abrir:

- [ ] Executável existe em `dist/win-unpacked/`
- [ ] Arquivo `.env.local` existe e está configurado
- [ ] Build standalone foi gerado (`npm run build:standalone`)
- [ ] Antivírus não está bloqueando
- [ ] Porta 3000 está livre
- [ ] Permissões corretas (executar como admin se necessário)

---

## 🚀 Teste Rápido

1. **Abra PowerShell**
2. **Execute:**
   ```powershell
   cd admin-dashboard/dist/win-unpacked
   .\FortSmart Agro Admin.exe
   ```
3. **Observe:**
   - Se abre uma janela
   - Se aparece erro no terminal
   - Se fica carregando

**Compartilhe o resultado** para diagnóstico mais preciso.

---

## 💡 Dica: Criar Atalho Correto

Se você criou um atalho (.lnk), verifique se aponta para:

**Caminho correto:**
```
C:\Users\fortu\fortsmart_agro_new\admin-dashboard\dist\win-unpacked\FortSmart Agro Admin.exe
```

**Não use:**
- ❌ O instalador (.exe)
- ❌ A pasta `dist/` diretamente
- ❌ O arquivo `.asar`

---

## 📞 Se Nada Funcionar

1. **Regenerar tudo do zero:**
   ```powershell
   cd admin-dashboard
   npm run build:standalone
   npm run electron:build:win
   ```

2. **Testar executável direto** (não o instalador)

3. **Verificar logs** no terminal ao executar

4. **Compartilhar:**
   - Mensagens de erro
   - Logs do terminal
   - Versão do Windows
   - Se antivírus está ativo

---

**Status:** 🔍 Diagnóstico - Siga as soluções acima na ordem

