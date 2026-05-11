# =============================================================================
# stop.ps1 - Detiene los contenedores de SecureTenis
# Uso: .\stop.ps1           -> detiene contenedores (mantiene la BD)
#      .\stop.ps1 -Clean    -> detiene y borra volumenes (BD incluida)
# =============================================================================

param(
    [switch]$Clean
)

$ErrorActionPreference = "Stop"

function log  { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function warn { param($msg) Write-Host "[!]  $msg" -ForegroundColor Yellow }
function fail { param($msg) Write-Host "[X]  $msg" -ForegroundColor Red; exit 1 }

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    fail "Docker no encontrado."
}
docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { fail "El demonio de Docker no esta en marcha." }

if ($Clean) {
    warn "Se eliminaran los contenedores Y los volumenes (la BD se borrara)."
    $confirm = Read-Host "Continuar? [s/N]"
    if ($confirm -notmatch '^[sS]$') {
        log "Cancelado."
        exit 0
    }
    docker compose down -v
    log "Contenedores y volumenes eliminados."
} else {
    docker compose down
    log "Contenedores detenidos (los datos de la BD se conservan)."
}
