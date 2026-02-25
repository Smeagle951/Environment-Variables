# 🖥️ Guia: Transformar Admin Dashboard em Aplicativo Desktop

## 🎯 Objetivo

Transformar o Admin Dashboard (atualmente acessível via `http://localhost:3000`) em um **aplicativo desktop standalone** usando Electron.

---

## ✅ O Que Foi Implementado

### 1. **Estrutura Electron**
- ✅ `electron/main.js` - Processo principal do Electron
- ✅ `electron/preload.js` - Script de preload para segurança
- ✅ Configuração do `package.json` para Electron
- ✅ Scripts de build para Windows, Mac e Linux

### 2. **Configuração Next.js**
- ✅ Suporte para exportação estática
- ✅ Configuração para funcionar com Electron

---

## 🚀 Como Usar

### Opção 1: Desenvolvimento (Recomendado para testar)

```powershell
cd admin-dashboard
npm install
npm run electron:dev
```

Isso vai:
1. Iniciar o servidor Next.js (`npm run dev`)
2. Aguardar o servidor estar pronto
3. Abrir o aplicativo Electron conectado ao `localhost:3000`

### Opção 2: Build e Executar

```powershell
cd admin-dashboard
npm install
npm run build
npm run electron
```

### Opção 3: Gerar Executável

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

## 📦 Instalação de Dependências

Primeiro, instale as novas dependências:

```powershell
cd admin-dashboard
npm install electron electron-builder concurrently wait-on --save-dev
```

---

## 🔧 Configuração

### Variáveis de Ambiente

O aplicativo usa as mesmas variáveis de ambiente do Next.js:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Elas devem estar no arquivo `.env` na raiz do projeto.

### Ícone do Aplicativo

Crie os ícones em `admin-dashboard/assets/`:
- `icon.ico` (Windows)
- `icon.icns` (Mac)
- `icon.png` (Linux/geral)

**Se não tiver ícones, o aplicativo funcionará sem eles.**

---

## 🎨 Funcionalidades do Aplicativo Desktop

### ✅ Implementado
- ✅ Janela principal com tamanho otimizado
- ✅ Prevenção de navegação externa
- ✅ Prevenção de abertura de novas janelas
- ✅ DevTools em desenvolvimento
- ✅ Fechar corretamente ao sair

### 🔄 Melhorias Futuras (Opcional)
- [ ] Menu de aplicativo (File, Edit, View, etc.)
- [ ] Atalhos de teclado
- [ ] Notificações do sistema
- [ ] Atualização automática
- [ ] Tray icon (ícone na bandeja do sistema)

---

## 📝 Estrutura de Arquivos

```
admin-dashboard/
├── electron/
│   ├── main.js          ✅ Processo principal
│   ├── preload.js       ✅ Script de preload
│   └── package.json     ✅ Config do Electron
├── assets/              ⚠️ Criar pasta e adicionar ícones
│   ├── icon.ico         (Windows)
│   ├── icon.icns        (Mac)
│   └── icon.png         (Linux)
├── dist/                ✅ Executáveis gerados aqui
├── package.json         ✅ Atualizado com scripts Electron
└── next.config.js       ✅ Configurado para exportação
```

---

## 🚀 Próximos Passos

### 1. Instalar Dependências

```powershell
cd admin-dashboard
npm install
```

### 2. Testar em Desenvolvimento

```powershell
npm run electron:dev
```

### 3. Gerar Executável

```powershell
npm run electron:build:win
```

O executável estará em `admin-dashboard/dist/`

---

## ⚠️ Notas Importantes

### Desenvolvimento vs Produção

**Em Desenvolvimento:**
- Aplica conecta ao `http://localhost:3000`
- Requer que `npm run dev` esteja rodando
- DevTools aberto automaticamente

**Em Produção:**
- Aplicativo standalone
- Não precisa de servidor Next.js rodando
- Build estático incluído no executável

### Build Estático

Para gerar executável, o Next.js precisa fazer export estático. Isso significa:
- Algumas funcionalidades server-side podem não funcionar
- API routes precisam ser adaptadas
- Imagens precisam ser otimizadas manualmente

**Solução:** O aplicativo pode funcionar em modo híbrido:
- Em desenvolvimento: conecta ao servidor local
- Em produção: pode conectar ao servidor de produção ou usar build estático

---

## 🔍 Troubleshooting

### Erro: "Cannot find module 'electron'"
```powershell
npm install electron --save-dev
```

### Erro: "wait-on não encontrado"
```powershell
npm install wait-on concurrently --save-dev
```

### Aplicativo não abre
- Verifique se o servidor Next.js está rodando (em dev)
- Verifique se a porta 3000 está livre
- Verifique os logs no terminal

### Build falha
- Verifique se todas as dependências estão instaladas
- Verifique se o Next.js build funciona: `npm run build`
- Verifique se há erros no console

---

## 📊 Status

| Funcionalidade | Status |
|----------------|--------|
| Estrutura Electron | ✅ Completo |
| Scripts de build | ✅ Completo |
| Configuração Next.js | ✅ Completo |
| Executável Windows | ⚠️ Precisa testar |
| Executável Mac | ⚠️ Precisa testar |
| Executável Linux | ⚠️ Precisa testar |

---

**Status:** ✅ Estrutura criada - Pronto para testar!

