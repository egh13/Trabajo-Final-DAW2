# =============================================================================
# start.ps1 - Lanza SecureTenis completo (BD + Backend en Docker, Frontend local)
# Uso: .\start.ps1           -> arranque normal
#      .\start.ps1 -Seed     -> arranque + poblar BD (primer uso)
# =============================================================================
# Si PowerShell bloquea el script, ejecuta primero:
#   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
# =============================================================================

param(
    [switch]$Seed
)

$ErrorActionPreference = "Stop"

function log  { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function info { param($msg) Write-Host " ->  $msg" -ForegroundColor Cyan }
function warn { param($msg) Write-Host "[!]  $msg" -ForegroundColor Yellow }
function fail { param($msg) Write-Host "[X]  $msg" -ForegroundColor Red; exit 1 }

# ---------------------------------------------------------------------------
# 1. Requisitos
# ---------------------------------------------------------------------------
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    fail "Docker no encontrado. Instalalo desde https://docs.docker.com/get-docker/"
}
docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    fail "El demonio de Docker no esta en marcha. Arranca Docker Desktop y vuelve a intentarlo."
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    fail "Node.js no encontrado. Instalalo desde https://nodejs.org/"
}

# ---------------------------------------------------------------------------
# 2. Crear backend\.env si no existe
# ---------------------------------------------------------------------------
if (-not (Test-Path "backend\.env")) {
    if (-not (Test-Path "backend\.env.example")) {
        fail "No existe backend\.env.example. No se puede crear la configuracion."
    }
    info "Creando backend\.env desde .env.example..."
    Copy-Item "backend\.env.example" "backend\.env"

    # Generar JWT_SECRET aleatorio (48 caracteres alfanumericos)
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'
    $jwtSecret = -join ((1..48) | ForEach-Object { $chars[(Get-Random -Maximum $chars.Length)] })

    $content = Get-Content "backend\.env" -Raw
    $content = $content -replace 'cambia_este_secreto_en_produccion', $jwtSecret
    Set-Content "backend\.env" $content -NoNewline

    warn "backend\.env creado con JWT_SECRET aleatorio."
    warn "Editalo si necesitas configurar SMTP u otras variables."
    Write-Host ""
} else {
    log "backend\.env ya existe, omitiendo creacion."
}

# ---------------------------------------------------------------------------
# 3. Instalar dependencias del frontend si falta node_modules
# ---------------------------------------------------------------------------
if (-not (Test-Path "secure-tenis\node_modules")) {
    info "Instalando dependencias del frontend (primera vez)..."
    npm install --prefix secure-tenis --silent
    if ($LASTEXITCODE -ne 0) { fail "Fallo al instalar dependencias del frontend." }
    log "Dependencias instaladas."
}

# ---------------------------------------------------------------------------
# 4. Arrancar contenedores Docker (BD + Backend)
# ---------------------------------------------------------------------------
info "Arrancando contenedores Docker (BD + Backend)..."
docker compose up --build -d
if ($LASTEXITCODE -ne 0) { fail "Fallo al arrancar los contenedores Docker." }
log "Contenedores en marcha."

# ---------------------------------------------------------------------------
# 5. Esperar a que el backend responda
# ---------------------------------------------------------------------------
info "Esperando a que el backend este listo..."
$maxWait = 90
$elapsed = 0
$backendReady = $false
while ($elapsed -lt $maxWait) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
        $backendReady = $true
        break
    } catch {
        Start-Sleep -Seconds 3
        $elapsed += 3
        Write-Host -NoNewline "."
    }
}
Write-Host ""
if ($backendReady) {
    log "Backend listo."
} else {
    warn "El backend tardo mas de ${maxWait}s. Comprueba los logs con: docker compose logs backend"
}

# ---------------------------------------------------------------------------
# 6. Seed (solo si se pasa -Seed)
# ---------------------------------------------------------------------------
if ($Seed) {
    info "Ejecutando seed de la base de datos..."
    docker exec tfg-backend npx ts-node prisma/seed.ts
    if ($LASTEXITCODE -eq 0) {
        log "Base de datos poblada correctamente."
    } else {
        warn "El seed fallo o los datos ya existen - es seguro ignorarlo en arranques posteriores."
    }
}

# ---------------------------------------------------------------------------
# 7. Arrancar frontend (Vite) en primer plano
#    El bloque finally detiene Docker al salir (Ctrl+C o cierre de ventana)
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SecureTenis listo" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend  ->  " -NoNewline; Write-Host "http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend   ->  " -NoNewline; Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host "  MariaDB   ->  " -NoNewline; Write-Host "localhost:3306" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Ctrl+C para detener todo"
Write-Host ""

try {
    npm run dev --prefix secure-tenis
} finally {
    Write-Host ""
    info "Deteniendo contenedores Docker..."
    docker compose stop
    log "Todo detenido. Hasta luego!"
}
