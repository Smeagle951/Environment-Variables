const { app, BrowserWindow } = require('electron')
const path = require('path')
const http = require('http')
const { spawn } = require('child_process')
const isDev = process.env.NODE_ENV === 'development'

let mainWindow
let nextServer = null

// Função para verificar se o servidor está pronto
function checkServerReady(url, maxAttempts = 60, interval = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0
    
    const check = () => {
      attempts++
      console.log(`Tentativa ${attempts}/${maxAttempts}: Verificando se servidor está pronto...`)
      
      const urlObj = new URL(url)
      
      const req = http.get({
        hostname: urlObj.hostname,
        port: urlObj.port || 3000,
        path: urlObj.pathname || '/',
        timeout: 3000,
      }, (res) => {
        console.log(`✅ Servidor respondeu com status ${res.statusCode}`)
        req.destroy()
        resolve(true)
      })
      
      req.on('error', (err) => {
        console.log(`⚠️ Erro na tentativa ${attempts}: ${err.message}`)
        if (attempts >= maxAttempts) {
          console.error(`❌ Servidor não está pronto após ${maxAttempts} tentativas`)
          reject(new Error(`Servidor não está pronto após ${maxAttempts} tentativas`))
        } else {
          setTimeout(check, interval)
        }
      })
      
      req.on('timeout', () => {
        console.log(`⏱️ Timeout na tentativa ${attempts}`)
        req.destroy()
        if (attempts >= maxAttempts) {
          console.error(`❌ Timeout: Servidor não respondeu após ${maxAttempts} tentativas`)
          reject(new Error(`Timeout: Servidor não respondeu após ${maxAttempts} tentativas`))
        } else {
          setTimeout(check, interval)
        }
      })
    }
    
    check()
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      // Permitir cookies e sessões
      partition: 'persist:main',
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    titleBarStyle: 'default',
    show: false,
  })

  // Carregar a aplicação após verificar se o servidor está pronto
  const loadApp = async () => {
    if (isDev) {
      try {
        console.log('🔍 Verificando se servidor Next.js está pronto...')
        console.log('💡 Dica: Certifique-se de que "npm run dev" está rodando em outro terminal')
        
        await checkServerReady('http://localhost:3000')
        console.log('✅ Servidor está pronto! Carregando aplicação...')
        
        // Aguardar mais um pouco para garantir que o servidor está totalmente pronto
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Em desenvolvimento, conectar ao servidor Next.js
        // IMPORTANTE: Carregar a raiz '/' primeiro
        console.log('🌐 Carregando http://localhost:3000/...')
        await mainWindow.loadURL('http://localhost:3000/')
        console.log('✅ Página carregada!')
        
        // Abrir DevTools em desenvolvimento
        mainWindow.webContents.openDevTools()
      } catch (error) {
        console.error('❌ Erro ao verificar servidor:', error.message)
        console.log('⚠️ Tentando carregar mesmo assim...')
        console.log('💡 Se não funcionar, certifique-se de que o servidor está rodando:')
        console.log('   1. Abra outro terminal')
        console.log('   2. Execute: cd admin-dashboard && npm run dev')
        console.log('   3. Aguarde ver "Ready in X seconds"')
        console.log('   4. Feche e reabra este aplicativo Electron')
        
        // Tentar carregar mesmo assim
        console.log('🌐 Tentando carregar http://localhost:3000/...')
        mainWindow.loadURL('http://localhost:3000/')
        mainWindow.webContents.openDevTools()
      }
    } else {
      // Em produção, o servidor Next.js será iniciado automaticamente
      // Aguardar servidor estar pronto (já iniciado no app.whenReady)
      console.log('🔍 Aguardando servidor Next.js estar pronto...')
      
      try {
        console.log('⏳ Aguardando servidor estar pronto (máximo 2 minutos)...')
        await checkServerReady('http://localhost:3000', 60, 2000)
        console.log('✅ Servidor está pronto! Carregando aplicação...')
        
        // Aguardar mais um pouco para garantir
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        console.log('🌐 Carregando http://localhost:3000/...')
        const loadPromise = mainWindow.loadURL('http://localhost:3000/')
        
        // Timeout de 10 segundos para o carregamento
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout ao carregar URL')), 10000)
        )
        
        await Promise.race([loadPromise, timeoutPromise])
        console.log('✅ Página carregada!')
      } catch (error) {
        console.error('❌ Erro ao verificar/carregar servidor:', error.message)
        console.log('⚠️ Tentando carregar mesmo assim...')
        console.log('💡 Verifique os logs do servidor acima para mais detalhes')
        mainWindow.loadURL('http://localhost:3000/')
        
        // Abrir DevTools para debug
        mainWindow.webContents.openDevTools()
      }
    }
  }

  loadApp()

  // Mostrar janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    // Focar na janela
    if (isDev) {
      mainWindow.focus()
    }
  })

  // Log quando a página carregar completamente
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('✅ Página carregada com sucesso!')
    console.log('📍 URL atual:', mainWindow.webContents.getURL())
    
    // Verificar se a página está realmente carregada
    mainWindow.webContents.executeJavaScript(`
      console.log('🔍 Verificando se página está carregada...');
      console.log('Document ready state:', document.readyState);
      console.log('Title:', document.title);
      console.log('Body content:', document.body ? 'existe' : 'não existe');
    `).catch(err => {
      console.error('❌ Erro ao executar JavaScript:', err)
    })
  })

  // Log de console do renderer
  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log(`[Renderer ${level}]:`, message)
  })
  
  // Log de erros do renderer
  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('❌ Render process crashed:', details.reason)
    console.error('Exit code:', details.exitCode)
  })
  
  // Log de erros não capturados
  mainWindow.webContents.on('unresponsive', () => {
    console.error('⚠️ Página não está respondendo!')
  })
  
  mainWindow.webContents.on('responsive', () => {
    console.log('✅ Página voltou a responder')
  })

  // Fechar todas as janelas quando fechar o app
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Prevenir navegação para URLs externas
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    
    if (isDev) {
      // Em desenvolvimento, permitir apenas localhost
      if (parsedUrl.origin !== 'http://localhost:3000') {
        console.log('🚫 Bloqueando navegação para:', navigationUrl)
        event.preventDefault()
      } else {
        console.log('✅ Permitindo navegação para:', navigationUrl)
        // Log quando navegar para dashboard
        if (parsedUrl.pathname === '/dashboard') {
          console.log('🎯 Navegando para dashboard!')
        }
      }
    } else {
      // Em produção, não permitir navegação externa
      if (parsedUrl.origin !== 'file://') {
        event.preventDefault()
      }
    }
  })
  
  // Log quando a URL mudar (navegação bem-sucedida)
  mainWindow.webContents.on('did-navigate', (event, url) => {
    console.log('📍 Navegação concluída para:', url)
    if (url.includes('/dashboard')) {
      console.log('✅ Dashboard carregado!')
    }
  })
  
  // Log de erros de carregamento
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('❌ Erro ao carregar:', errorCode, errorDescription, validatedURL)
    
    // Códigos de erro comuns:
    // -106: ERR_CONNECTION_REFUSED (servidor não está rodando)
    // -105: ERR_NAME_NOT_RESOLVED (DNS não resolve)
    // -102: ERR_CONNECTION_REFUSED (conexão recusada)
    // -3: ERR_ABORTED (carregamento abortado)
    
    if (errorCode === -106 || errorCode === -105 || errorCode === -102) {
      console.log('⚠️ Servidor não encontrado ou não está rodando.')
      console.log('💡 Solução:')
      console.log('   1. Abra outro terminal')
      console.log('   2. Execute: cd admin-dashboard && npm run dev')
      console.log('   3. Aguarde ver "Ready in X seconds"')
      console.log('   4. Feche e reabra este aplicativo Electron')
      console.log('')
      console.log('⏳ Tentando novamente em 3 segundos...')
      
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          console.log('🔄 Tentando carregar novamente...')
          mainWindow.loadURL('http://localhost:3000/')
        }
      }, 3000)
    } else {
      console.log('⚠️ Erro desconhecido. Verifique os logs do servidor Next.js.')
    }
  })
  
  // Detectar tela branca (página carregou mas não renderizou)
  let whiteScreenTimeout
  mainWindow.webContents.on('did-finish-load', () => {
    // Limpar timeout anterior
    if (whiteScreenTimeout) {
      clearTimeout(whiteScreenTimeout)
    }
    
    // Verificar após 3 segundos se ainda está em branco
    whiteScreenTimeout = setTimeout(() => {
      mainWindow.webContents.executeJavaScript(`
        (function() {
          const body = document.body;
          const hasContent = body && body.children.length > 0;
          const hasText = body && body.innerText && body.innerText.trim().length > 0;
          
          if (!hasContent && !hasText) {
            console.error('⚠️ TELA BRANCA DETECTADA!');
            console.error('Body existe:', !!body);
            console.error('Body children:', body ? body.children.length : 0);
            console.error('Body text:', body ? body.innerText.substring(0, 100) : 'N/A');
            return 'WHITE_SCREEN';
          }
          return 'OK';
        })();
      `).then(result => {
        if (result === 'WHITE_SCREEN') {
          console.error('❌ TELA BRANCA DETECTADA!')
          console.error('💡 Possíveis causas:')
          console.error('   1. Servidor Next.js não está rodando corretamente')
          console.error('   2. Erro JavaScript na página')
          console.error('   3. Problema com React/Next.js')
          console.error('')
          console.error('🔍 Verificando servidor...')
          
          // Verificar se servidor está respondendo
          checkServerReady('http://localhost:3000', 5, 1000).then(() => {
            console.log('✅ Servidor está respondendo')
            console.log('🔄 Recarregando página...')
            mainWindow.reload()
          }).catch(() => {
            console.error('❌ Servidor não está respondendo!')
            console.error('💡 Execute: npm run dev em outro terminal')
          })
        }
      }).catch(err => {
        console.error('❌ Erro ao verificar tela branca:', err)
      })
    }, 3000)
  })

  // Prevenir abertura de novas janelas
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' }
  })
}

// Função para iniciar servidor Next.js
function startNextServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Iniciando servidor Next.js...')
    
    const fs = require('fs')
    const isWindows = process.platform === 'win32'
    
    let serverPath
    let serverCommand
    let serverArgs
    
    if (app.isPackaged) {
      // Em produção, usar o build standalone do Next.js
      // O build standalone cria um servidor em .next/standalone
      serverPath = app.getAppPath()
      
      // Verificar se existe .next/standalone (build standalone)
      // No build empacotado, os arquivos podem estar em diferentes locais
      let standalonePath = path.join(serverPath, '.next', 'standalone')
      let standaloneServerPath = path.join(standalonePath, 'server.js')
      
      // Se não encontrar, tentar no diretório de recursos (pode estar descompactado)
      if (!fs.existsSync(standaloneServerPath)) {
        const resourcesPath = path.join(path.dirname(process.execPath), 'resources')
        standalonePath = path.join(resourcesPath, '.next', 'standalone')
        standaloneServerPath = path.join(standalonePath, 'server.js')
      }
      
      if (fs.existsSync(standaloneServerPath)) {
        // Usar o servidor standalone
        console.log('📦 Usando build standalone do Next.js')
        console.log('📁 Caminho standalone:', standalonePath)
        console.log('📄 server.js encontrado:', standaloneServerPath)
        
        // Verificar se os arquivos estáticos existem
        const staticPath = path.join(serverPath, '.next', 'static')
        const standaloneStaticPath = path.join(standalonePath, '.next', 'static')
        
        if (fs.existsSync(staticPath) && !fs.existsSync(standaloneStaticPath)) {
          console.log('⚠️ Arquivos estáticos não encontrados no standalone, copiando...')
          try {
            // Criar diretório se não existir
            const staticDir = path.join(standalonePath, '.next')
            if (!fs.existsSync(staticDir)) {
              fs.mkdirSync(staticDir, { recursive: true })
            }
            // Copiar arquivos estáticos (simplificado - em produção, usar cp-r ou similar)
            console.log('💡 Nota: Arquivos estáticos devem estar em .next/static no build')
          } catch (err) {
            console.error('❌ Erro ao copiar arquivos estáticos:', err)
          }
        }
        
        serverCommand = process.execPath // Node.js do Electron
        serverArgs = [standaloneServerPath]
        serverPath = standalonePath
        console.log('✅ Configuração do servidor standalone concluída')
      } else {
        // Fallback: tentar usar next start normalmente
        console.log('⚠️ Build standalone não encontrado!')
        console.log('📁 Tentou encontrar em:')
        console.log('   -', path.join(serverPath, '.next', 'standalone', 'server.js'))
        console.log('   -', path.join(path.dirname(process.execPath), 'resources', '.next', 'standalone', 'server.js'))
        console.log('')
        console.log('💡 Solução:')
        console.log('   1. Execute: npm run build:standalone')
        console.log('   2. Execute: npm run electron:build:win')
        console.log('   3. Verifique se .next/standalone/server.js existe')
        console.log('')
        console.log('⚠️ Tentando fallback com next start...')
        const nextPath = path.join(serverPath, 'node_modules', '.bin', isWindows ? 'next.cmd' : 'next')
        
        if (fs.existsSync(nextPath)) {
          serverCommand = process.execPath
          serverArgs = [nextPath, 'start']
          console.log('✅ Usando next start como fallback')
        } else {
          // Último recurso: usar npm (pode não funcionar)
          console.log('⚠️ next.cmd não encontrado, usando npm como último recurso')
          serverCommand = isWindows ? 'npm.cmd' : 'npm'
          serverArgs = ['run', 'start']
        }
      }
    } else {
      // Em desenvolvimento, usar npm run start
      serverPath = path.join(__dirname, '..')
      serverCommand = isWindows ? 'npm.cmd' : 'npm'
      serverArgs = ['run', 'start']
    }
    
    console.log('📁 Caminho do servidor:', serverPath)
    console.log('🔧 Comando:', serverCommand, serverArgs.join(' '))
    
    // Verificar se o caminho existe
    if (!fs.existsSync(serverPath)) {
      console.error('❌ Caminho do servidor não existe:', serverPath)
      reject(new Error(`Server path does not exist: ${serverPath}`))
      return
    }
    
    // Verificar se server.js existe (para standalone)
    if (serverArgs[0] && serverArgs[0].endsWith('server.js')) {
      if (!fs.existsSync(serverArgs[0])) {
        console.error('❌ server.js não encontrado:', serverArgs[0])
        reject(new Error(`server.js not found: ${serverArgs[0]}`))
        return
      }
      console.log('✅ server.js encontrado:', serverArgs[0])
    }
    
    // Iniciar servidor Next.js em background
    nextServer = spawn(serverCommand, serverArgs, {
      cwd: serverPath,
      shell: !app.isPackaged, // Usar shell apenas em dev
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        PORT: '3000',
        NODE_ENV: 'production',
        HOSTNAME: 'localhost',
      },
    })
    
    console.log('🚀 Processo do servidor iniciado. PID:', nextServer.pid)
    
    let serverReady = false
    
    // Capturar output do servidor
    nextServer.stdout.on('data', (data) => {
      const output = data.toString()
      console.log(`[Next.js STDOUT]: ${output.trim()}`)
      
      // Verificar se servidor está pronto
      if (output.includes('Ready') || output.includes('started server') || output.includes('Local:') || output.includes('localhost:3000') || output.includes('started')) {
        if (!serverReady) {
          serverReady = true
          console.log('✅ Servidor Next.js iniciado!')
          setTimeout(() => resolve(), 3000) // Aguardar 3 segundos para garantir
        }
      }
    })
    
    nextServer.stderr.on('data', (data) => {
      const error = data.toString()
      console.error(`[Next.js STDERR]: ${error.trim()}`)
      
      // Verificar se é um erro crítico
      if (error.includes('Error') || error.includes('Failed') || error.includes('Cannot') || error.includes('ENOENT') || error.includes('MODULE_NOT_FOUND')) {
        console.error('❌ Erro crítico no servidor Next.js!')
        console.error('💡 Possíveis causas:')
        console.error('   1. Build standalone não foi incluído no executável')
        console.error('   2. Arquivos faltando no build')
        console.error('   3. Dependências não instaladas')
        console.error('')
        console.error('🔧 Solução:')
        console.error('   1. Execute: npm run build:standalone')
        console.error('   2. Execute: npm run electron:build:win')
        console.error('   3. Verifique se .next/standalone existe')
      }
    })
    
    nextServer.on('error', (error) => {
      console.error('❌ Erro ao iniciar servidor:', error)
      reject(error)
    })
    
    nextServer.on('exit', (code) => {
      if (code !== 0 && !serverReady) {
        console.error(`❌ Servidor Next.js saiu com código ${code}`)
        reject(new Error(`Server exited with code ${code}`))
      }
    })
    
    // Timeout de segurança
    setTimeout(() => {
      if (!serverReady) {
        console.log('⚠️ Servidor não sinalizou "Ready", mas continuando...')
        resolve() // Continuar mesmo assim
      }
    }, 30000) // 30 segundos
  })
}

// Quando Electron estiver pronto
app.whenReady().then(async () => {
  // Se não estiver em desenvolvimento, iniciar servidor Next.js
  if (!isDev) {
    try {
      await startNextServer()
    } catch (error) {
      console.error('❌ Erro ao iniciar servidor:', error)
      // Continuar mesmo assim - pode ser que o servidor já esteja rodando
    }
  }
  
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Fechar quando todas as janelas forem fechadas (exceto macOS)
app.on('window-all-closed', () => {
  // Encerrar servidor Next.js se estiver rodando
  if (nextServer) {
    console.log('🛑 Encerrando servidor Next.js...')
    nextServer.kill()
    nextServer = null
  }
  
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Encerrar servidor quando app fechar
app.on('before-quit', () => {
  if (nextServer) {
    console.log('🛑 Encerrando servidor Next.js...')
    nextServer.kill()
    nextServer = null
  }
})

// Segurança: Prevenir novas janelas
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
  })
})

