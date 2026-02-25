# Script para limpar cache e reiniciar servidor
Write-Host "🧹 Limpando e reiniciando Admin Dashboard..." -ForegroundColor Cyan
Write-Host ""

# 1. Parar TODOS os processos Node
Write-Host "1. Parando processos Node..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $count = ($nodeProcesses | Measure-Object).Count
    Write-Host "   Encontrados $count processos Node" -ForegroundColor Gray
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    Write-Host "   ✅ Processos parados" -ForegroundColor Green
} else {
    Write-Host "   ✅ Nenhum processo Node rodando" -ForegroundColor Green
}

# 2. Limpar cache
Write-Host ""
Write-Host "2. Limpando cache..." -ForegroundColor Yellow
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Write-Host "   ✅ Cache limpo!" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Cache não encontrado (já estava limpo)" -ForegroundColor Yellow
}

# 3. Verificar configuração
Write-Host ""
Write-Host "3. Verificando configuração..." -ForegroundColor Yellow
if (Test-Path .env) {
    Write-Host "   ✅ .env encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ .env NÃO encontrado!" -ForegroundColor Red
    Write-Host "   Execute: .\copiar-env.ps1" -ForegroundColor Yellow
    exit
}

# 4. Iniciar servidor
Write-Host ""
Write-Host "4. Iniciando servidor..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Servidor iniciando em http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Aguarde até aparecer 'Ready' no terminal" -ForegroundColor Gray
Write-Host ""

# Iniciar servidor
npm run dev

