#!/usr/bin/env bash
# =============================================================================
# stop.sh — Detiene y opcionalmente elimina los contenedores de SecureTenis
# Uso: ./stop.sh          → detiene contenedores (mantiene la BD)
#      ./stop.sh --clean  → detiene y borra volúmenes (BD incluida)
# =============================================================================

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✔]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
fail() { echo -e "${RED}[✘]${NC} $1"; exit 1; }

command -v docker >/dev/null 2>&1 || fail "Docker no encontrado."
docker info >/dev/null 2>&1       || fail "El demonio de Docker no está en marcha."

CLEAN=false
for arg in "$@"; do
  [[ "$arg" == "--clean" ]] && CLEAN=true
done

if [[ "$CLEAN" == "true" ]]; then
  warn "Se eliminarán los contenedores Y los volúmenes (la BD se borrará)."
  read -rp "¿Continuar? [s/N] " confirm
  [[ "$confirm" =~ ^[sS]$ ]] || { log "Cancelado."; exit 0; }
  docker compose down -v
  log "Contenedores y volúmenes eliminados."
else
  docker compose down
  log "Contenedores detenidos (los datos de la BD se conservan)."
fi
