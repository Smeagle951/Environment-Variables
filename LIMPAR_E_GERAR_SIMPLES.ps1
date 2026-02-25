# Script SIMPLES: Renomeia pasta dist e gera executável
Write-Host "🧹 Limpando e gerando executável (método simples)..." -ForegroundColor Cyan
Write-Host ""

# 1. Fechar processos
Write-Host "1️⃣ Fechando processos..." -ForegroundColor Yellow
Get-Process | Where-Object { 
    $_.ProcessName -like "*electron*" -or 
    $_.ProcessName -like "*FortSmart*" -or
    $_.ProcessName -like "*node*"
} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 5
Write-Host "   ✅ Processos fechados" -ForegroundColor Green

# 2. Renomear pasta dist (workaround)
Write-Host ""
Write-Host "2️⃣ Renomeando pasta dist (se existir)..." -ForegroundColor Yellow
if (Test-Path "dist") {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $newName = "dist_backup_$timestamp"
    try {
        Rename-Item -Path "dist" -NewName $newName -ErrorAction Stop
        Write-Host "   ✅ Pasta dist renomeada para: $newName" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Não foi possível renomear: $_" -ForegroundColor Red
        Write-Host "   💡 Feche manualmente o aplicativo e tente novamente" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "   ✅ Pasta dist não existe" -ForegroundColor Green
}

# 3. Verificar .env.local
Write-Host ""
Write-Host "3️⃣ Verificando arquivo .env.local..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local")) {
    Write-Host "   ❌ Arquivo .env.local NÃO encontrado!" -ForegroundColor Red
    Write-Host "   Execute: .\CRIAR_ENV_LOCAL_RAPIDO.ps1" -ForegroundColor Yellow
    exit 1
}
Write-Host "   ✅ Arquivo .env.local encontrado" -ForegroundColor Green

# 4. Gerar executável
Write-Host ""
Write-Host "4️⃣ Gerando executável..." -ForegroundColor Yellow
Write-Host "   Isso pode levar 5-10 minutos..." -ForegroundColor Gray
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
    exit 1
}

