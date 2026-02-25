// Preload script para Electron
// Este arquivo é executado antes do conteúdo da página

const { contextBridge } = require('electron')

// Expor APIs seguras para o renderer
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
})

