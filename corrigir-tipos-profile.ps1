# Script para corrigir tipos de profile em todos os arquivos
$files = @(
    "app\dashboard\page.tsx",
    "app\dashboard\codes\page.tsx",
    "app\dashboard\codes\generate\page.tsx",
    "app\dashboard\codes\[id]\page.tsx",
    "app\dashboard\groups\page.tsx",
    "app\dashboard\groups\[id]\page.tsx",
    "app\dashboard\users\page.tsx",
    "app\dashboard\users\[id]\page.tsx",
    "app\dashboard\users\[id]\edit\page.tsx",
    "app\dashboard\reports\page.tsx"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PWD $file
    if (Test-Path $fullPath) {
        Write-Host "Corrigindo: $file" -ForegroundColor Yellow
        $content = Get-Content $fullPath -Raw
        
        # Substituir let profile = null por versão tipada
        $content = $content -replace 'let profile = null', "type ProfileType = { is_admin: boolean; email: string; auth_uid: string } | null`r`n  let profile: ProfileType = null"
        
        # Substituir profile = profileByEmail por versão com type assertion
        $content = $content -replace 'profile = profileByEmail', 'profile = profileByEmail as ProfileType'
        
        # Substituir profile = profileByUid por versão com type assertion
        $content = $content -replace 'profile = profileByUid', 'profile = profileByUid as ProfileType'
        
        Set-Content $fullPath $content -NoNewline
        Write-Host "✅ Corrigido: $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Arquivo não encontrado: $file" -ForegroundColor Red
    }
}

Write-Host "`n✅ Todos os arquivos corrigidos!" -ForegroundColor Green

