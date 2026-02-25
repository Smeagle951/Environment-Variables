# 🖥️ Como Usar o Aplicativo Desktop

## ✅ Status: Estrutura Criada!

A estrutura do aplicativo desktop foi criada. Agora você pode transformar o Admin Dashboard em um aplicativo nativo.

---

## 🚀 Passo a Passo

### 1. Instalar Dependências

Execute o script automático:

```powershell
cd admin-dashboard
.\criar-aplicativo-desktop.ps1
```

Ou manualmente:

```powershell
cd admin-dashboard
npm install electron electron-builder concurrently wait-on --save-dev
```

### 2. Testar em Desenvolvimento

```powershell
npm run electron:dev
```

Isso vai:
1. ✅ Iniciar o servidor Next.js (`npm run dev`)
2. ✅ Aguardar o servidor estar pronto
3. ✅ Abrir o aplicativo Electron
4. ✅ Conectar ao `http://localhost:3000`

**Você verá o Admin Dashboard em uma janela de aplicativo desktop!**

### 3. Gerar Executável

#### Windows:
```powershell
npm run electron:build:win
```

#### Mac:
```powershell
npm run electron:build:mac
```

#### Linux:
```powershell
npm run electron:build:linux
```

O executável será gerado em `admin-dashboard/dist/`

---

## 📋 O Que Foi Criado

### ✅ Estrutura Electron
- `electron/main.js` - Processo principal do Electron
- `electron/preload.js` - Script de segurança
- `electron/package.json` - Configuração do Electron

### ✅ Scripts no package.json
- `npm run electron:dev` - Desenvolvimento
- `npm run electron:build:win` - Build Windows
- `npm run electron:build:mac` - Build Mac
- `npm run electron:build:linux` - Build Linux

### ✅ Configuração
- `next.config.js` - Configurado para Electron
- `package.json` - Scripts e configuração de build

---

## 🎯 Como Funciona

### Em Desenvolvimento:
- Aplicativo conecta ao `http://localhost:3000`
- Requer que `npm run dev` esteja rodando
- DevTools aberto automaticamente

### Em Produção:
- Aplicativo pode conectar ao servidor de produção
- Ou usar build estático (requer configuração adicional)
- Executável standalone

---

## ⚠️ Importante

### Para Gerar Executável:

O aplicativo em produção pode funcionar de duas formas:

**Opção 1: Conectar ao Servidor (Recomendado)**
- Aplicativo conecta ao servidor Next.js em produção
- Todas as funcionalidades funcionam
- Requer servidor rodando

**Opção 2: Build Estático**
- Aplicativo funciona offline
- Requer adaptações (API routes não funcionam)
- Mais complexo de configurar

**Por enquanto, vamos usar a Opção 1 (conectar ao servidor).**

---

## 🔧 Configuração do Servidor de Produção

Para usar em produção, você precisa:

1. **Fazer deploy do Next.js** em um servidor (Vercel, Railway, etc.)
2. **Atualizar `electron/main.js`** para apontar para o servidor:

```javascript
// Em produção, mudar para:
mainWindow.loadURL('https://seu-dominio.com')
```

---

## 📝 Próximos Passos

1. ✅ **Instalar dependências** - `npm install`
2. ✅ **Testar em dev** - `npm run electron:dev`
3. ⚠️ **Gerar executável** - `npm run electron:build:win`
4. ⚠️ **Fazer deploy do servidor** (se quiser usar em produção)
5. ⚠️ **Atualizar URL de produção** no `electron/main.js`

---

## 🎉 Vantagens do Aplicativo Desktop

- ✅ **Não precisa abrir navegador** - Abre como aplicativo nativo
- ✅ **Ícone na área de trabalho** - Acesso rápido
- ✅ **Melhor experiência** - Janela dedicada
- ✅ **Pode funcionar offline** (com cache)
- ✅ **Notificações do sistema** (futuro)

---

**Status:** ✅ Estrutura criada - Pronto para testar!

