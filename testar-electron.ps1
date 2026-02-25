# Script para testar Electron corretamente
Write-Host "=== Testando Electron ===" -ForegroundColor Cyan

# Verificar se está no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script na pasta admin-dashboard" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "1. Verificando se servidor Next.js está rodando..." -ForegroundColor Yellow

# Verificar se há processo na porta 3000
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if (-not $port3000) {
    Write-Host "⚠️ Servidor Next.js não está rodando na porta 3000" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Iniciando servidor Next.js em background..." -ForegroundColor Yellow
    
    # Iniciar servidor em background
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Minimized
    
    Write-Host "⏳ Aguardando servidor iniciar (15 segundos)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
    
    # Verificar novamente
    $port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if (-not $port3000) {
        Write-Host "❌ Servidor não iniciou. Execute manualmente: npm run dev" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Servidor iniciado!" -ForegroundColor Green
} else {
    Write-Host "✅ Servidor já está rodando!" -ForegroundColor Green
}

Write-Host ""
Write-Host "2. Testando conexão com servidor..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ Servidor respondeu com status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao conectar ao servidor: $_" -ForegroundColor Red
    Write-Host "   Certifique-se de que 'npm run dev' está rodando" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "3. Abrindo Electron..." -ForegroundColor Yellow
Write-Host ""

# Executar Electron
npm run electron

Write-Host ""
Write-Host "=== Electron encerrado ===" -ForegroundColor Cyan

