# Script rápido para criar .env.local com a URL já conhecida
Write-Host "📝 Criando arquivo .env.local..." -ForegroundColor Cyan
Write-Host ""

# URL do Supabase (já conhecida)
$supabaseUrl = "https://ywkhjrpdoouxnqdmfddc.supabase.co"

Write-Host "✅ URL do Supabase: $supabaseUrl" -ForegroundColor Green
Write-Host ""

# Solicitar apenas a chave anon
Write-Host "Por favor, forneça a chave ANON do Supabase:" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Como obter:" -ForegroundColor Cyan
Write-Host "   1. Acesse: https://app.supabase.com" -ForegroundColor Gray
Write-Host "   2. Selecione seu projeto" -ForegroundColor Gray
Write-Host "   3. Vá em: Settings > API" -ForegroundColor Gray
Write-Host "   4. Copie a chave 'anon' > 'public'" -ForegroundColor Gray
Write-Host ""
Write-Host "   Exemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -ForegroundColor Gray
Write-Host ""

$supabaseKey = Read-Host "Digite a chave ANON"

# Validar chave
if (-not $supabaseKey -or $supabaseKey.Length -lt 50) {
    Write-Host ""
    Write-Host "⚠️  Chave parece muito curta ou inválida" -ForegroundColor Yellow
    $continue = Read-Host "Continuar mesmo assim? (S/N)"
    if ($continue -ne "S" -and $continue -ne "s") {
        Write-Host "❌ Operação cancelada" -ForegroundColor Red
        exit 1
    }
}

# Criar conteúdo do arquivo
$content = "NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl`nNEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseKey"

# Verificar se já existe
if (Test-Path ".env.local") {
    Write-Host ""
    Write-Host "⚠️  Arquivo .env.local já existe!" -ForegroundColor Yellow
    $overwrite = Read-Host "Deseja sobrescrever? (S/N)"
    if ($overwrite -ne "S" -and $overwrite -ne "s") {
        Write-Host "❌ Operação cancelada" -ForegroundColor Red
        exit 0
    }
}

# Salvar arquivo
try {
    $content | Out-File -FilePath ".env.local" -Encoding utf8 -NoNewline
    Write-Host ""
    Write-Host "✅ Arquivo .env.local criado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 Conteúdo do arquivo:" -ForegroundColor Cyan
    Write-Host "─────────────────────────────────────" -ForegroundColor Gray
    Write-Host $content -ForegroundColor White
    Write-Host "─────────────────────────────────────" -ForegroundColor Gray
    Write-Host ""
    Write-Host "✅ Próximos passos:" -ForegroundColor Green
    Write-Host "   1. Execute: npm run build:standalone" -ForegroundColor Yellow
    Write-Host "   2. Execute: npm run electron:build:win" -ForegroundColor Yellow
    Write-Host "   3. Teste o executável" -ForegroundColor Yellow
} catch {
    Write-Host ""
    Write-Host "❌ Erro ao criar arquivo: $_" -ForegroundColor Red
    exit 1
}

