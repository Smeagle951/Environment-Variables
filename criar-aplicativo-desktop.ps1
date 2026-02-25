# Script para criar aplicativo desktop do Admin Dashboard
Write-Host "=== Criando Aplicativo Desktop ===" -ForegroundColor Cyan

# Verificar se está no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script na pasta admin-dashboard" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "1. Instalando dependências do Electron..." -ForegroundColor Yellow
npm install electron electron-builder concurrently wait-on --save-dev

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependências instaladas!" -ForegroundColor Green

Write-Host ""
Write-Host "2. Verificando estrutura Electron..." -ForegroundColor Yellow

if (-not (Test-Path "electron/main.js")) {
    Write-Host "❌ Erro: electron/main.js não encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Estrutura Electron encontrada!" -ForegroundColor Green

Write-Host ""
Write-Host "3. Verificando variáveis de ambiente..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    Write-Host "⚠️ Aviso: Arquivo .env não encontrado" -ForegroundColor Yellow
    Write-Host "   Execute: .\copiar-env.ps1" -ForegroundColor Yellow
} else {
    $envContent = Get-Content .env
    $hasSupabaseUrl = $envContent | Select-String "NEXT_PUBLIC_SUPABASE_URL"
    $hasSupabaseKey = $envContent | Select-String "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    
    if (-not $hasSupabaseUrl -or -not $hasSupabaseKey) {
        Write-Host "⚠️ Aviso: Variáveis de ambiente podem estar incompletas" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Variáveis de ambiente configuradas!" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=== Configuração Concluída ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Testar em desenvolvimento:" -ForegroundColor White
Write-Host "   npm run electron:dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Gerar executável Windows:" -ForegroundColor White
Write-Host "   npm run electron:build:win" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Gerar executável Mac:" -ForegroundColor White
Write-Host "   npm run electron:build:mac" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Gerar executável Linux:" -ForegroundColor White
Write-Host "   npm run electron:build:linux" -ForegroundColor Cyan
Write-Host ""

