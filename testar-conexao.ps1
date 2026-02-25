# Script para testar conexão com Supabase
Write-Host "=== Testando Conexão com Supabase ===" -ForegroundColor Cyan

# Carregar variáveis de ambiente
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$supabaseAnonKey = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY

Write-Host ""
Write-Host "1. Verificando variáveis de ambiente:" -ForegroundColor Yellow
if ($supabaseUrl) {
    Write-Host "   ✅ NEXT_PUBLIC_SUPABASE_URL: $($supabaseUrl.Substring(0, [Math]::Min(50, $supabaseUrl.Length)))..." -ForegroundColor Green
} else {
    Write-Host "   ❌ NEXT_PUBLIC_SUPABASE_URL: NÃO CONFIGURADO" -ForegroundColor Red
}

if ($supabaseAnonKey) {
    Write-Host "   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: $($supabaseAnonKey.Substring(0, [Math]::Min(30, $supabaseAnonKey.Length)))..." -ForegroundColor Green
} else {
    Write-Host "   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY: NÃO CONFIGURADO" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Testando conectividade com Supabase:" -ForegroundColor Yellow

if ($supabaseUrl) {
    $uri = [System.Uri]::new($supabaseUrl)
    $hostname = $uri.Host
    
    Write-Host "   Testando conexão com: $hostname" -ForegroundColor Cyan
    
    try {
        $test = Test-NetConnection -ComputerName $hostname -Port 443 -WarningAction SilentlyContinue -ErrorAction Stop
        if ($test.TcpTestSucceeded) {
            Write-Host "   ✅ Conexão TCP bem-sucedida na porta 443" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Falha na conexão TCP" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ❌ Erro ao testar conexão: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "3. Testando requisição HTTP:" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "$supabaseUrl/rest/v1/" -Method GET -TimeoutSec 10 -ErrorAction Stop
        Write-Host "   ✅ Resposta HTTP: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Erro na requisição HTTP: $_" -ForegroundColor Red
        Write-Host "   💡 Isso pode ser normal se o endpoint requer autenticação" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== Teste Concluído ===" -ForegroundColor Cyan

