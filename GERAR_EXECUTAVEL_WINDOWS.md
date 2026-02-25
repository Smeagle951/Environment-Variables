# 🪟 Como Gerar Executável Windows (.exe)

## 🎯 Objetivo

Gerar um aplicativo Windows standalone (.exe) do Admin Dashboard.

---

## ✅ O Que Já Temos

- ✅ Estrutura Electron configurada
- ✅ Scripts de build prontos
- ✅ Configuração do electron-builder

---

## 🚀 Passo a Passo

### Passo 1: Verificar Dependências

```powershell
cd admin-dashboard
npm list electron electron-builder
```

**Se não estiver instalado:**
```powershell
npm install electron electron-builder --save-dev
```

### Passo 2: Gerar Executável

```powershell
npm run electron:build:win
```

**Isso vai:**
1. ✅ Fazer build do Next.js
2. ✅ Empacotar com Electron
3. ✅ Gerar instalador Windows (.exe)
4. ✅ Salvar em `admin-dashboard/dist/`

### Passo 3: Encontrar o Executável

O executável estará em:
```
admin-dashboard/dist/
├── FortSmart Agro Admin Setup X.X.X.exe  ← Instalador
└── win-unpacked/                          ← Versão não instalada
```

---

## 📦 O Que Será Gerado

### Instalador (.exe)
- **Nome:** `FortSmart Agro Admin Setup X.X.X.exe`
- **Tamanho:** ~150-200 MB
- **Uso:** Instalar no Windows
- **Localização:** `admin-dashboard/dist/`

### Versão Portátil (opcional)
- **Pasta:** `win-unpacked/`
- **Uso:** Executar sem instalar
- **Arquivo:** `FortSmart Agro Admin.exe`

---

## 🎯 Como Usar o Executável

### Opção 1: Instalar

1. Execute `FortSmart Agro Admin Setup X.X.X.exe`
2. Siga o assistente de instalação
3. Abra o aplicativo do menu Iniciar

### Opção 2: Portátil

1. Abra a pasta `win-unpacked/`
2. Execute `FortSmart Agro Admin.exe`
3. Não precisa instalar

---

## ⚙️ Configuração

### Modo de Conexão

O aplicativo pode funcionar de duas formas:

**Opção 1: Servidor Local (Desenvolvimento)**
- Aplicativo conecta ao `http://localhost:3000`
- Requer servidor Next.js rodando

**Opção 2: Servidor Remoto (Produção)**
- Aplicativo conecta ao servidor de produção
- Não precisa de servidor local

**Para mudar:**
Edite `electron/main.js` e altere a URL em produção.

---

## 🔧 Personalização

### Ícone do Aplicativo

Coloque o ícone em:
```
admin-dashboard/assets/
├── icon.ico  ← Windows (já configurado)
```

**Se não tiver ícone:**
- O aplicativo funcionará sem ícone
- Ou use um gerador online de .ico

### Nome do Aplicativo

Já configurado em `package.json`:
```json
{
  "build": {
    "productName": "FortSmart Agro Admin"
  }
}
```

---

## 📝 Checklist

Antes de gerar:

- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor Next.js funciona (`npm run dev`)
- [ ] Electron funciona (`npm run electron`)
- [ ] Variáveis de ambiente configuradas (`.env`)

Para gerar:

- [ ] Executar `npm run electron:build:win`
- [ ] Aguardar build completar (5-10 minutos)
- [ ] Verificar arquivo em `dist/`

Para testar:

- [ ] Executar o .exe gerado
- [ ] Verificar se instala corretamente
- [ ] Testar login
- [ ] Testar funcionalidades

---

## ⚠️ Notas Importantes

### Tamanho do Executável

O .exe será grande (~150-200 MB) porque inclui:
- ✅ Node.js runtime
- ✅ Chromium (navegador)
- ✅ Next.js build
- ✅ Todas as dependências

**Isso é normal para aplicativos Electron.**

### Primeira Execução

Na primeira execução:
- ✅ Pode demorar alguns segundos para abrir
- ✅ Windows pode pedir permissão
- ✅ Antivírus pode alertar (falso positivo comum)

### Servidor Necessário

**IMPORTANTE:** O aplicativo precisa de um servidor Next.js rodando:
- ✅ Em desenvolvimento: `http://localhost:3000`
- ✅ Em produção: Servidor remoto configurado

**Para funcionar offline completamente:**
- Precisa adaptar para build estático
- Mais complexo de implementar

---

## 🚀 Próximos Passos

1. ✅ Gerar executável: `npm run electron:build:win`
2. ✅ Testar instalação
3. ✅ Testar funcionalidades
4. ✅ Distribuir para usuários

---

**Status:** ✅ Pronto para gerar executável!

