# Script de Verificação de Configuração - Admin Dashboard
Write-Host "🔍 Verificando configuração do Admin Dashboard..." -ForegroundColor Cyan
Write-Host ""

# Verificar se .env existe
$envPath = Join-Path $PSScriptRoot ".env"
if (Test-Path $envPath) {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
    
    # Verificar variáveis
    $envContent = Get-Content $envPath -Raw
    
    $hasUrl = $envContent -match "NEXT_PUBLIC_SUPABASE_URL"
    $hasKey = $envContent -match "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    
    if ($hasUrl) {
        $urlMatch = [regex]::Match($envContent, "NEXT_PUBLIC_SUPABASE_URL=(.+)")
        if ($urlMatch.Success) {
            $url = $urlMatch.Groups[1].Value.Trim()
            Write-Host "✅ NEXT_PUBLIC_SUPABASE_URL configurado" -ForegroundColor Green
            Write-Host "   URL: $url" -ForegroundColor Gray
        } else {
            Write-Host "❌ NEXT_PUBLIC_SUPABASE_URL não encontrado ou vazio" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ NEXT_PUBLIC_SUPABASE_URL não encontrado" -ForegroundColor Red
    }
    
    if ($hasKey) {
        $keyMatch = [regex]::Match($envContent, "NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)")
        if ($keyMatch.Success) {
            $key = $keyMatch.Groups[1].Value.Trim()
            if ($key.Length -gt 20) {
                Write-Host "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configurado" -ForegroundColor Green
                Write-Host "   Key: $($key.Substring(0, 20))..." -ForegroundColor Gray
            } else {
                Write-Host "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY parece estar vazio ou inválido" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrado ou vazio" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrado" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Arquivo .env NÃO encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Execute o script copiar-env.ps1 para criar o arquivo .env" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Se houver erros, execute: .\copiar-env.ps1" -ForegroundColor White
Write-Host "2. Reinicie o servidor: npm run dev" -ForegroundColor White
Write-Host "3. Acesse: http://localhost:3000" -ForegroundColor White

