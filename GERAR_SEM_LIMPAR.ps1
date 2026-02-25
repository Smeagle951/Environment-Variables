# Script ALTERNATIVO: Gera executável SEM remover pasta dist
# Este script simplesmente ignora a pasta dist antiga e cria uma nova
# O electron-builder geralmente consegue sobrescrever mesmo com arquivos bloqueados

Write-Host "🚀 Gerando executável (sem limpar pasta dist)..." -ForegroundColor Cyan
Write-Host "💡 Este método ignora a pasta dist antiga e tenta criar uma nova" -ForegroundColor Yellow
Write-Host ""

# 1. Fechar processos (opcional, mas recomendado)
Write-Host "1️⃣ Fechando processos Node.js/Electron..." -ForegroundColor Yellow
Get-Process | Where-Object { 
    ($_.ProcessName -like "*node*" -and $_.Path -notlike "*cursor*") -or
    $_.ProcessName -like "*electron*" -or
    $_.ProcessName -like "*FortSmart*"
} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
Write-Host "   ✅ Processos fechados" -ForegroundColor Green

# 2. Verificar .env.local
Write-Host ""
Write-Host "2️⃣ Verificando arquivo .env.local..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local")) {
    Write-Host "   ❌ Arquivo .env.local NÃO encontrado!" -ForegroundColor Red
    Write-Host "   Execute: .\CRIAR_ENV_LOCAL_RAPIDO.ps1" -ForegroundColor Yellow
    exit 1
}
Write-Host "   ✅ Arquivo .env.local encontrado" -ForegroundColor Green

# 3. Gerar executável (electron-builder geralmente consegue sobrescrever)
Write-Host ""
Write-Host "3️⃣ Gerando executável..." -ForegroundColor Yellow
Write-Host "   Isso pode levar 5-10 minutos..." -ForegroundColor Gray
Write-Host "   ⚠️  Se der erro de arquivo bloqueado, tente:" -ForegroundColor Yellow
Write-Host "      1. Reiniciar o computador" -ForegroundColor Gray
Write-Host "      2. Executar .\LIMPAR_E_GERAR_FORCE.ps1 como Administrador" -ForegroundColor Gray
Write-Host ""

npm run electron:build:win

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Executável gerado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 Localização:" -ForegroundColor Cyan
    Write-Host "   dist\win-unpacked\FortSmart Agro Admin.exe" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "❌ Erro ao gerar executável" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Se o erro foi de arquivo bloqueado, tente:" -ForegroundColor Yellow
    Write-Host "   1. Reiniciar o computador" -ForegroundColor Gray
    Write-Host "   2. Executar .\LIMPAR_E_GERAR_FORCE.ps1 como Administrador" -ForegroundColor Gray
    exit 1
}

