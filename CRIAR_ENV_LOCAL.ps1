# Script para criar arquivo .env.local automaticamente
Write-Host "📝 Criando arquivo .env.local..." -ForegroundColor Cyan
Write-Host ""

# Verificar se já existe
if (Test-Path ".env.local") {
    Write-Host "⚠️  Arquivo .env.local já existe!" -ForegroundColor Yellow
    $overwrite = Read-Host "Deseja sobrescrever? (S/N)"
    if ($overwrite -ne "S" -and $overwrite -ne "s") {
        Write-Host "❌ Operação cancelada" -ForegroundColor Red
        exit 0
    }
}

Write-Host "Por favor, forneça as informações do Supabase:" -ForegroundColor Yellow
Write-Host ""

# Solicitar URL do Supabase
Write-Host "1️⃣ URL do Projeto Supabase" -ForegroundColor Cyan
Write-Host "   Exemplo: https://abcdefghijklmnop.supabase.co" -ForegroundColor Gray
$supabaseUrl = Read-Host "   Digite a URL"

# Validar URL
if (-not $supabaseUrl -or -not $supabaseUrl.StartsWith("https://")) {
    Write-Host "❌ URL inválida! Deve começar com https://" -ForegroundColor Red
    exit 1
}

# Solicitar chave anon
Write-Host ""
Write-Host "2️⃣ Chave Anon (anon public key)" -ForegroundColor Cyan
Write-Host "   Exemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -ForegroundColor Gray
Write-Host "   (Encontre em: Supabase Dashboard > Settings > API > anon > public)" -ForegroundColor Gray
$supabaseKey = Read-Host "   Digite a chave"

# Validar chave
if (-not $supabaseKey -or -not $supabaseKey.StartsWith("eyJ")) {
    Write-Host "⚠️  Chave parece inválida (deve começar com 'eyJ')" -ForegroundColor Yellow
    $continue = Read-Host "   Continuar mesmo assim? (S/N)"
    if ($continue -ne "S" -and $continue -ne "s") {
        Write-Host "❌ Operação cancelada" -ForegroundColor Red
        exit 1
    }
}

# Criar conteúdo do arquivo
$content = @"
NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseKey
"@

# Salvar arquivo
try {
    $content | Out-File -FilePath ".env.local" -Encoding utf8 -NoNewline
    Write-Host ""
    Write-Host "✅ Arquivo .env.local criado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 Conteúdo do arquivo:" -ForegroundColor Cyan
    Write-Host $content -ForegroundColor Gray
    Write-Host ""
    Write-Host "✅ Pronto! Agora você pode:" -ForegroundColor Green
    Write-Host "   1. Executar: npm run build:standalone" -ForegroundColor Yellow
    Write-Host "   2. Executar: npm run electron:build:win" -ForegroundColor Yellow
    Write-Host "   3. Testar o executável" -ForegroundColor Yellow
} catch {
    Write-Host ""
    Write-Host "❌ Erro ao criar arquivo: $_" -ForegroundColor Red
    exit 1
}

