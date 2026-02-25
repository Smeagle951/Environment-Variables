# Script simples para fechar processos e gerar executável
Write-Host "🔍 Fechando processos do Electron..." -ForegroundColor Cyan

# Fechar processos
Get-Process | Where-Object { 
    $_.ProcessName -like "*electron*" -or 
    $_.Path -like "*FortSmart*" 
} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 3

Write-Host "✅ Processos fechados" -ForegroundColor Green
Write-Host ""
Write-Host "🧹 Removendo pasta dist..." -ForegroundColor Cyan
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Write-Host "✅ Pasta dist removida" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Gerando executável..." -ForegroundColor Cyan
Write-Host "   Isso pode levar 5-10 minutos..." -ForegroundColor Gray
Write-Host ""

npm run electron:build:win

