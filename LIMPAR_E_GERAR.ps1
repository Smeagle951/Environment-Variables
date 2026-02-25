# Script para limpar processos e gerar executável
Write-Host "🧹 Limpando processos e gerando executável..." -ForegroundColor Cyan
Write-Host ""

# 1. Fechar processos do Electron e Node.js relacionados (método 1: Stop-Process)
Write-Host "1️⃣ Fechando processos do Electron/Node.js..." -ForegroundColor Yellow
$processes = Get-Process | Where-Object { 
    $_.ProcessName -like "*electron*" -or 
    $_.ProcessName -like "*FortSmart*" -or
    $_.ProcessName -like "*node*" -or
    $_.Path -like "*fortsmart*admin*" -or
    $_.Path -like "*electron-builder*"
}

if ($processes) {
    Write-Host "   Encontrados $($processes.Count) processo(s)" -ForegroundColor Yellow
    $processes | ForEach-Object {
        try {
            Write-Host "   - Finalizando: $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Host "   ⚠️  Erro ao fechar $($_.ProcessName): $_" -ForegroundColor Yellow
        }
    }
    Write-Host "   ✅ Processos finalizados (método 1)" -ForegroundColor Green
} else {
    Write-Host "   ✅ Nenhum processo encontrado" -ForegroundColor Green
}

# 1.5. Fechar processos usando taskkill (método 2: mais agressivo)
Write-Host ""
Write-Host "1.5️⃣ Fechando processos usando taskkill (método agressivo)..." -ForegroundColor Yellow
try {
    # Fechar processos Node.js relacionados ao projeto
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
        $_.Path -like "*fortsmart*" -or $_.Path -like "*admin-dashboard*"
    }
    if ($nodeProcesses) {
        $nodeProcesses | ForEach-Object {
            Write-Host "   - Finalizando Node.js: PID $($_.Id)" -ForegroundColor Gray
            taskkill /F /PID $_.Id 2>$null
        }
    }
    
    # Fechar processos Electron
    taskkill /F /IM "electron.exe" 2>$null | Out-Null
    taskkill /F /IM "FortSmart Agro Admin.exe" 2>$null | Out-Null
    
    Write-Host "   ✅ Processos finalizados (método 2)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Erro ao usar taskkill: $_" -ForegroundColor Yellow
}

# 2. Aguardar mais tempo para garantir que processos foram fechados
Write-Host ""
Write-Host "2️⃣ Aguardando 10 segundos para garantir que processos foram fechados..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 2.5. Remover pasta dist se existir (com múltiplas tentativas)
Write-Host ""
Write-Host "2.5️⃣ Removendo pasta dist (se existir)..." -ForegroundColor Yellow
if (Test-Path "dist") {
    $removed = $false
    $maxAttempts = 3
    
    for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
        Write-Host "   🗑️  Tentativa $attempt de $maxAttempts para remover pasta dist..." -ForegroundColor Gray
        
        try {
            # Tentativa 1: Remover arquivo específico app.asar primeiro
            $asarPath = "dist\win-unpacked\resources\app.asar"
            if (Test-Path $asarPath) {
                Write-Host "   - Tentando remover app.asar primeiro..." -ForegroundColor Gray
                Remove-Item -Force $asarPath -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 2
            }
            
            # Tentativa 2: Remover pasta resources
            $resourcesPath = "dist\win-unpacked\resources"
            if (Test-Path $resourcesPath) {
                Write-Host "   - Tentando remover pasta resources..." -ForegroundColor Gray
                Remove-Item -Recurse -Force $resourcesPath -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 2
            }
            
            # Tentativa 3: Remover pasta inteira
            Write-Host "   - Tentando remover pasta dist completa..." -ForegroundColor Gray
            Remove-Item -Recurse -Force "dist" -ErrorAction Stop
            Write-Host "   ✅ Pasta dist removida com sucesso!" -ForegroundColor Green
            $removed = $true
            break
        } catch {
            if ($attempt -lt $maxAttempts) {
                Write-Host "   ⚠️  Tentativa $attempt falhou, aguardando 5 segundos..." -ForegroundColor Yellow
                Start-Sleep -Seconds 5
                
                # Tentar fechar processos novamente
                Get-Process | Where-Object { 
                    $_.ProcessName -like "*node*" -or 
                    $_.ProcessName -like "*electron*" 
                } | Stop-Process -Force -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 3
            } else {
                Write-Host "   ❌ Não foi possível remover pasta dist após $maxAttempts tentativas" -ForegroundColor Red
                Write-Host "   💡 Tentando renomear pasta dist como workaround..." -ForegroundColor Yellow
                
                # Workaround: Renomear a pasta em vez de remover
                try {
                    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
                    $newName = "dist_backup_$timestamp"
                    Rename-Item -Path "dist" -NewName $newName -ErrorAction Stop
                    Write-Host "   ✅ Pasta dist renomeada para: $newName" -ForegroundColor Green
                    Write-Host "   💡 Você pode removê-la manualmente depois" -ForegroundColor Yellow
                    $removed = $true
                } catch {
                    Write-Host "   ❌ Também não foi possível renomear: $_" -ForegroundColor Red
                    Write-Host ""
                    Write-Host "   💡 SOLUÇÕES MANUAIS:" -ForegroundColor Yellow
                    Write-Host "   1. Feche TODOS os aplicativos relacionados" -ForegroundColor Gray
                    Write-Host "   2. Abra o Gerenciador de Tarefas (Ctrl+Shift+Esc)" -ForegroundColor Gray
                    Write-Host "   3. Finalize processos: Node.js, Electron, FortSmart Agro Admin" -ForegroundColor Gray
                    Write-Host "   4. Reinicie o computador e tente novamente" -ForegroundColor Gray
                    Write-Host "   5. Ou remova manualmente a pasta dist e execute novamente" -ForegroundColor Gray
                    exit 1
                }
            }
        }
    }
    
    if (-not $removed) {
        exit 1
    }
} else {
    Write-Host "   ✅ Pasta dist não existe" -ForegroundColor Green
}

# 3. Verificar se arquivo .env.local existe
Write-Host ""
Write-Host "3️⃣ Verificando arquivo .env.local..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "   ✅ Arquivo .env.local encontrado" -ForegroundColor Green
    $envContent = Get-Content ".env.local"
    if ($envContent -match "SUA_CHAVE_ANON_AQUI") {
        Write-Host "   ⚠️  ATENÇÃO: Arquivo ainda tem 'SUA_CHAVE_ANON_AQUI'" -ForegroundColor Red
        Write-Host "   ⚠️  Você precisa editar o arquivo e adicionar sua chave real!" -ForegroundColor Red
        Write-Host ""
        $continue = Read-Host "   Continuar mesmo assim? (S/N)"
        if ($continue -ne "S" -and $continue -ne "s") {
            Write-Host "   ❌ Operação cancelada" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "   ✅ Arquivo parece estar configurado corretamente" -ForegroundColor Green
    }
} else {
    Write-Host "   ❌ Arquivo .env.local NÃO encontrado!" -ForegroundColor Red
    Write-Host "   Execute: .\CRIAR_ENV_LOCAL_RAPIDO.ps1" -ForegroundColor Yellow
    exit 1
}

# 4. Gerar executável
Write-Host ""
Write-Host "4️⃣ Gerando executável..." -ForegroundColor Yellow
Write-Host "   Isso pode levar 5-10 minutos..." -ForegroundColor Gray
Write-Host ""

$buildSuccess = $false
try {
    npm run electron:build:win
    if ($LASTEXITCODE -eq 0) {
        $buildSuccess = $true
    }
} catch {
    Write-Host ""
    Write-Host "❌ Erro durante o build: $_" -ForegroundColor Red
}

if ($buildSuccess) {
    Write-Host ""
    Write-Host "✅ Executável gerado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 Localização:" -ForegroundColor Cyan
    Write-Host "   dist\win-unpacked\FortSmart Agro Admin.exe" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🚀 Próximo passo: Teste o executável!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Erro ao gerar executável" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Possíveis causas:" -ForegroundColor Yellow
    Write-Host "   1. Executável anterior ainda está aberto" -ForegroundColor Gray
    Write-Host "   2. Arquivo .env.local não está configurado" -ForegroundColor Gray
    Write-Host "   3. Build standalone não foi gerado" -ForegroundColor Gray
    Write-Host "   4. Arquivo app.asar está bloqueado por outro processo" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Soluções:" -ForegroundColor Yellow
    Write-Host "   - Feche TODOS os aplicativos relacionados" -ForegroundColor Gray
    Write-Host "   - Reinicie o computador e tente novamente" -ForegroundColor Gray
    Write-Host "   - Execute este script novamente" -ForegroundColor Gray
    exit 1
}

