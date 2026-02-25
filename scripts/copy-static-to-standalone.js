const fs = require('fs')
const path = require('path')

// Script para copiar arquivos estáticos para o build standalone
// O Next.js standalone não copia automaticamente os arquivos estáticos

const staticSource = path.join(__dirname, '..', '.next', 'static')
const standaloneStaticDest = path.join(__dirname, '..', '.next', 'standalone', '.next', 'static')
const publicSource = path.join(__dirname, '..', 'public')
const standalonePublicDest = path.join(__dirname, '..', '.next', 'standalone', 'public')

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⚠️ Origem não existe: ${src}`)
    return false
  }

  // Criar diretório de destino se não existir
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
    console.log(`📁 Criado diretório: ${dest}`)
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }

  return true
}

console.log('🔄 Copiando arquivos estáticos para standalone...')

// Copiar arquivos estáticos
if (fs.existsSync(staticSource)) {
  console.log(`📦 Copiando ${staticSource} -> ${standaloneStaticDest}`)
  if (copyRecursive(staticSource, standaloneStaticDest)) {
    console.log('✅ Arquivos estáticos copiados com sucesso!')
  } else {
    console.error('❌ Erro ao copiar arquivos estáticos')
    process.exit(1)
  }
} else {
  console.error(`❌ Arquivos estáticos não encontrados em: ${staticSource}`)
  console.error('💡 Execute "npm run build" primeiro')
  process.exit(1)
}

// Copiar arquivos públicos
if (fs.existsSync(publicSource)) {
  console.log(`📦 Copiando ${publicSource} -> ${standalonePublicDest}`)
  if (copyRecursive(publicSource, standalonePublicDest)) {
    console.log('✅ Arquivos públicos copiados com sucesso!')
  } else {
    console.warn('⚠️ Erro ao copiar arquivos públicos (pode não ser crítico)')
  }
} else {
  console.warn('⚠️ Diretório public não encontrado (pode não ser crítico)')
}

console.log('✅ Cópia concluída!')

