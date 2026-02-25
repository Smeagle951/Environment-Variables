# Script PowerShell para copiar credenciais do .env do Flutter para o Admin Dashboard

Write-Host "🔍 Procurando arquivo .env no projeto Flutter..." -ForegroundColor Cyan

$flutterEnvPath = "..\.env"
$adminEnvPath = ".\.env"

if (Test-Path $flutterEnvPath) {
    Write-Host "✅ Arquivo .env encontrado!" -ForegroundColor Green
    
    # Ler o arquivo .env do Flutter
    $envContent = Get-Content $flutterEnvPath -Raw
    
    # Extrair SUPABASE_URL e SUPABASE_ANON_KEY
    $supabaseUrl = ""
    $supabaseAnonKey = ""
    
    if ($envContent -match "SUPABASE_URL=(.+)") {
        $supabaseUrl = $matches[1].Trim()
    }
    
    if ($envContent -match "SUPABASE_ANON_KEY=(.+)") {
        $supabaseAnonKey = $matches[1].Trim()
    }
    
    if ($supabaseUrl -and $supabaseAnonKey) {
        # Criar conteúdo do .env para Next.js
        $nextEnvContent = @"
# Supabase Configuration
# Copiado automaticamente do projeto Flutter
NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseAnonKey

# Admin Configuration
ADMIN_EMAIL=admin@fortsmartagro.com
"@
        
        # Escrever no arquivo .env do admin-dashboard
        Set-Content -Path $adminEnvPath -Value $nextEnvContent -Encoding UTF8
        
        Write-Host "✅ Arquivo .env criado com sucesso em admin-dashboard/.env" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Credenciais copiadas:" -ForegroundColor Cyan
        Write-Host "   SUPABASE_URL: $supabaseUrl" -ForegroundColor Gray
        Write-Host "   SUPABASE_ANON_KEY: $($supabaseAnonKey.Substring(0, 50))..." -ForegroundColor Gray
        Write-Host ""
        Write-Host "🚀 Próximo passo: Execute 'npm install' e depois 'npm run dev'" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Não foi possível encontrar SUPABASE_URL ou SUPABASE_ANON_KEY no arquivo .env" -ForegroundColor Red
        Write-Host "   Verifique se o arquivo .env contém essas variáveis." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Arquivo .env não encontrado em: $flutterEnvPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 Crie manualmente o arquivo admin-dashboard/.env com:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co" -ForegroundColor Gray
    Write-Host "NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui" -ForegroundColor Gray
}

