# Script para testar e diagnosticar o executável
Write-Host "🔍 Diagnosticando Executável FortSmart Agro Admin..." -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se executável existe
$exePath = "dist\win-unpacked\FortSmart Agro Admin.exe"
if (Test-Path $exePath) {
    Write-Host "✅ Executável encontrado: $exePath" -ForegroundColor Green
} else {
    Write-Host "❌ Executável NÃO encontrado em: $exePath" -ForegroundColor Red
    Write-Host "   Execute: npm run electron:build:win" -ForegroundColor Yellow
    exit 1
}

# 2. Verificar build standalone
$standalonePath = ".next\standalone\server.js"
if (Test-Path $standalonePath) {
    Write-Host "✅ Build standalone encontrado: $standalonePath" -ForegroundColor Green
} else {
    Write-Host "⚠️  Build standalone NÃO encontrado: $standalonePath" -ForegroundColor Yellow
    Write-Host "   Execute: npm run build:standalone" -ForegroundColor Yellow
}

# 3. Verificar .env.local
$envPath = ".env.local"
if (Test-Path $envPath) {
    Write-Host "✅ Arquivo .env.local encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Arquivo .env.local NÃO encontrado" -ForegroundColor Red
    Write-Host "   Crie o arquivo .env.local com:" -ForegroundColor Yellow
    Write-Host "   NEXT_PUBLIC_SUPABASE_URL=sua_url" -ForegroundColor Yellow
    Write-Host "   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave" -ForegroundColor Yellow
}

# 4. Verificar recursos do Electron
$asarPath = "dist\win-unpacked\resources\app.asar"
if (Test-Path $asarPath) {
    Write-Host "✅ Arquivo app.asar encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Arquivo app.asar NÃO encontrado" -ForegroundColor Red
    Write-Host "   Execute: npm run electron:build:win" -ForegroundColor Yellow
}

# 5. Verificar porta 3000
$portInUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  Porta 3000 está em uso!" -ForegroundColor Yellow
    Write-Host "   Feche outros processos que usam a porta 3000" -ForegroundColor Yellow
} else {
    Write-Host "✅ Porta 3000 está livre" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Tentando executar o aplicativo..." -ForegroundColor Cyan
Write-Host "   (Observe os erros que aparecem)" -ForegroundColor Gray
Write-Host ""

# Executar o aplicativo
Start-Process -FilePath $exePath -NoNewWindow -Wait

Write-Host ""
Write-Host "✅ Teste concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "Se o aplicativo não abriu ou ficou com tela branca:" -ForegroundColor Yellow
Write-Host "1. Verifique os erros acima" -ForegroundColor Yellow
Write-Host "2. Execute: npm run build:standalone" -ForegroundColor Yellow
Write-Host "3. Execute: npm run electron:build:win" -ForegroundColor Yellow
Write-Host "4. Verifique se o Windows Defender não está bloqueando" -ForegroundColor Yellow

