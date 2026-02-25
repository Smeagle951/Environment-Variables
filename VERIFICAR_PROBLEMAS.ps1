# Script de Diagnóstico Completo
Write-Host "🔍 Verificando problemas no Admin Dashboard..." -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se está no diretório correto
Write-Host "1. Verificando diretório..." -ForegroundColor Yellow
if (Test-Path package.json) {
    Write-Host "   ✅ package.json encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ package.json NÃO encontrado!" -ForegroundColor Red
    Write-Host "   Execute: cd admin-dashboard" -ForegroundColor Yellow
    exit
}

# 2. Verificar .env
Write-Host ""
Write-Host "2. Verificando arquivo .env..." -ForegroundColor Yellow
if (Test-Path .env) {
    Write-Host "   ✅ .env encontrado" -ForegroundColor Green
    
    $envContent = Get-Content .env -Raw
    $hasUrl = $envContent -match "NEXT_PUBLIC_SUPABASE_URL"
    $hasKey = $envContent -match "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    
    if ($hasUrl -and $hasKey) {
        Write-Host "   ✅ Variáveis configuradas" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Variáveis faltando!" -ForegroundColor Red
        Write-Host "   Execute: .\copiar-env.ps1" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ .env NÃO encontrado!" -ForegroundColor Red
    Write-Host "   Execute: .\copiar-env.ps1" -ForegroundColor Yellow
}

# 3. Verificar node_modules
Write-Host ""
Write-Host "3. Verificando dependências..." -ForegroundColor Yellow
if (Test-Path node_modules) {
    Write-Host "   ✅ node_modules encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ node_modules NÃO encontrado!" -ForegroundColor Red
    Write-Host "   Execute: npm install" -ForegroundColor Yellow
}

# 4. Verificar processos Node
Write-Host ""
Write-Host "4. Verificando processos Node..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   ⚠️  Processos Node rodando:" -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object {
        Write-Host "      - PID: $($_.Id) (Iniciado: $($_.StartTime))" -ForegroundColor Gray
    }
    Write-Host "   💡 Pare o servidor (Ctrl+C) antes de reiniciar" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Nenhum processo Node rodando" -ForegroundColor Green
}

# 5. Verificar cache
Write-Host ""
Write-Host "5. Verificando cache..." -ForegroundColor Yellow
if (Test-Path .next) {
    Write-Host "   ⚠️  Cache encontrado (.next)" -ForegroundColor Yellow
    Write-Host "   💡 Se houver problemas, limpe: Remove-Item -Recurse -Force .next" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Cache limpo" -ForegroundColor Green
}

# 6. Verificar erros de sintaxe
Write-Host ""
Write-Host "6. Verificando erros de sintaxe..." -ForegroundColor Yellow
try {
    $buildOutput = npm run build 2>&1 | Out-String
    if ($buildOutput -match "Compiled successfully") {
        Write-Host "   ✅ Build bem-sucedido - Sem erros de sintaxe" -ForegroundColor Green
    } elseif ($buildOutput -match "error|Error|ERROR") {
        Write-Host "   ❌ Erros encontrados no build!" -ForegroundColor Red
        Write-Host "   Verifique a saída acima" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Não foi possível verificar build" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Verificação concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Se houver problemas, execute: .\limpar-e-reiniciar.ps1" -ForegroundColor White
Write-Host "   2. Ou manualmente: Remove-Item -Recurse -Force .next && npm run dev" -ForegroundColor White

