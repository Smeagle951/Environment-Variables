# Script FORÇADO: Tenta identificar e fechar processos bloqueando arquivos
# ⚠️ RECOMENDADO: Execute como Administrador (botão direito > Executar como administrador)

Write-Host "🔧 Limpeza FORÇADA e geração de executável..." -ForegroundColor Cyan
Write-Host "⚠️  Se este script falhar, execute como Administrador!" -ForegroundColor Yellow
Write-Host ""

# Verificar se está executando como Administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  AVISO: Não está executando como Administrador" -ForegroundColor Yellow
    Write-Host "   Algumas operações podem falhar" -ForegroundColor Yellow
    Write-Host ""
}

# 1. Fechar TODOS os processos Node.js e Electron (exceto Cursor)
Write-Host "1️⃣ Fechando processos Node.js/Electron..." -ForegroundColor Yellow
$allNodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -notlike "*cursor*" -and $_.Path -notlike "*vscode*"
}
$electronProcesses = Get-Process -Name "electron" -ErrorAction SilentlyContinue
$fortsmartProcesses = Get-Process | Where-Object { $_.ProcessName -like "*FortSmart*" }

$totalProcesses = $allNodeProcesses.Count + $electronProcesses.Count + $fortsmartProcesses.Count

if ($totalProcesses -gt 0) {
    Write-Host "   Encontrados $totalProcesses processo(s)" -ForegroundColor Yellow
    
    $allNodeProcesses | ForEach-Object {
        Write-Host "   - Finalizando Node.js: PID $($_.Id)" -ForegroundColor Gray
        taskkill /F /PID $_.Id 2>$null | Out-Null
    }
    
    $electronProcesses | ForEach-Object {
        Write-Host "   - Finalizando Electron: PID $($_.Id)" -ForegroundColor Gray
        taskkill /F /PID $_.Id 2>$null | Out-Null
    }
    
    $fortsmartProcesses | ForEach-Object {
        Write-Host "   - Finalizando FortSmart: PID $($_.Id)" -ForegroundColor Gray
        taskkill /F /PID $_.Id 2>$null | Out-Null
    }
    
    Start-Sleep -Seconds 3
    Write-Host "   ✅ Processos finalizados" -ForegroundColor Green
} else {
    Write-Host "   ✅ Nenhum processo encontrado" -ForegroundColor Green
}

# 2. Tentar identificar qual processo está usando arquivos na pasta dist
Write-Host ""
Write-Host "2️⃣ Verificando processos usando arquivos em dist..." -ForegroundColor Yellow
if (Test-Path "dist") {
    # Tentar usar handle.exe se disponível (Sysinternals)
    $handlePath = "$env:ProgramFiles\Sysinternals\handle.exe"
    if (Test-Path $handlePath) {
        Write-Host "   Usando handle.exe para identificar processos..." -ForegroundColor Gray
        $distPath = (Resolve-Path "dist").Path
        $handles = & $handlePath -a -p $distPath 2>$null
        if ($handles) {
            Write-Host "   ⚠️  Processos encontrados usando arquivos:" -ForegroundColor Yellow
            $handles | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
        }
    } else {
        Write-Host "   ℹ️  handle.exe não encontrado (opcional)" -ForegroundColor Gray
    }
}

# 3. Aguardar
Write-Host ""
Write-Host "3️⃣ Aguardando 10 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 4. Tentar remover/renomear pasta dist
Write-Host ""
Write-Host "4️⃣ Tentando remover/renomear pasta dist..." -ForegroundColor Yellow
if (Test-Path "dist") {
    $success = $false
    
    # Estratégia 1: Renomear (geralmente funciona mesmo com arquivos bloqueados)
    Write-Host "   📝 Tentativa 1: Renomear pasta..." -ForegroundColor Gray
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $newName = "dist_OLD_$timestamp"
    
    try {
        Rename-Item -Path "dist" -NewName $newName -ErrorAction Stop
        Write-Host "   ✅ Pasta renomeada para: $newName" -ForegroundColor Green
        $success = $true
    } catch {
        Write-Host "   ⚠️  Renomear falhou: $_" -ForegroundColor Yellow
        
        # Estratégia 2: Mover arquivos individuais
        Write-Host "   📝 Tentativa 2: Mover arquivos individuais..." -ForegroundColor Gray
        try {
            $backupDir = "dist_backup_$timestamp"
            New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
            
            # Mover apenas o que conseguir
            Get-ChildItem "dist" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
                try {
                    $relativePath = $_.FullName.Substring((Resolve-Path "dist").Path.Length + 1)
                    $destPath = Join-Path $backupDir $relativePath
                    $destDir = Split-Path $destPath -Parent
                    if (-not (Test-Path $destDir)) {
                        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
                    }
                    Move-Item -Path $_.FullName -Destination $destPath -Force -ErrorAction SilentlyContinue
                } catch {
                    # Ignorar arquivos que não podem ser movidos
                }
            }
            
            # Tentar remover pasta dist vazia
            Start-Sleep -Seconds 2
            Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "   ✅ Arquivos movidos para: $backupDir" -ForegroundColor Green
            $success = $true
        } catch {
            Write-Host "   ⚠️  Mover arquivos falhou: $_" -ForegroundColor Yellow
        }
    }
    
    if (-not $success) {
        Write-Host ""
        Write-Host "   ❌ Não foi possível remover/renomear pasta dist" -ForegroundColor Red
        Write-Host ""
        Write-Host "   💡 SOLUÇÕES:" -ForegroundColor Yellow
        Write-Host "   1. Execute este script como Administrador (botão direito > Executar como administrador)" -ForegroundColor Gray
        Write-Host "   2. Feche manualmente o Gerenciador de Tarefas e finalize processos Node.js/Electron" -ForegroundColor Gray
        Write-Host "   3. Reinicie o computador" -ForegroundColor Gray
        Write-Host "   4. Ou simplesmente ignore e continue - o build criará uma nova pasta dist" -ForegroundColor Gray
        Write-Host ""
        $continue = Read-Host "   Continuar mesmo assim? (S/N)"
        if ($continue -ne "S" -and $continue -ne "s") {
            exit 1
        }
    }
} else {
    Write-Host "   ✅ Pasta dist não existe" -ForegroundColor Green
}

# 5. Verificar .env.local
Write-Host ""
Write-Host "5️⃣ Verificando arquivo .env.local..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local")) {
    Write-Host "   ❌ Arquivo .env.local NÃO encontrado!" -ForegroundColor Red
    Write-Host "   Execute: .\CRIAR_ENV_LOCAL_RAPIDO.ps1" -ForegroundColor Yellow
    exit 1
}
Write-Host "   ✅ Arquivo .env.local encontrado" -ForegroundColor Green

# 6. Gerar executável
Write-Host ""
Write-Host "6️⃣ Gerando executável..." -ForegroundColor Yellow
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

