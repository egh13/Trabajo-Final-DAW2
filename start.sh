#!/usr/bin/env bash
# =============================================================================
# start.sh — Lanza SecureTenis completo (BD + Backend en Docker, Frontend local)
# Uso: ./start.sh [--seed]  →  pasa --seed para poblar la BD en el primer arranque
# =============================================================================

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✔]${NC} $1"; }
info() { echo -e "${CYAN}[→]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
fail() { echo -e "${RED}[✘]${NC} $1"; exit 1; }

SEED=false
for arg in "$@"; do
  [[ "$arg" == "--seed" ]] && SEED=true
done

# ---------------------------------------------------------------------------
# 1. Requisitos
# ---------------------------------------------------------------------------
command -v docker >/dev/null 2>&1 || fail "Docker no encontrado. Instálalo desde https://docs.docker.com/get-docker/"
docker info >/dev/null 2>&1       || fail "El demonio de Docker no está en marcha. Arranca Docker y vuelve a intentarlo."
command -v node >/dev/null 2>&1   || fail "Node.js no encontrado. Instálalo desde https://nodejs.org/"

# ---------------------------------------------------------------------------
# 2. Crear backend/.env si no existe
# ---------------------------------------------------------------------------
if [[ ! -f backend/.env ]]; then
  if [[ ! -f backend/.env.example ]]; then
    fail "No existe backend/.env.example. No se puede crear la configuración."
  fi
  info "Creando backend/.env desde .env.example..."
  cp backend/.env.example backend/.env

  # Generar JWT_SECRET aleatorio (48 caracteres, sin caracteres problemáticos en sed)
  JWT_SECRET=$(LC_ALL=C tr -dc 'A-Za-z0-9_' </dev/urandom 2>/dev/null | head -c 48 || echo "secret_$(date +%s%N)")
  # Usar un delimitador alternativo en sed para evitar conflictos con '/'
  sed -i "s|cambia_este_secreto_en_produccion|${JWT_SECRET}|g" backend/.env

  warn "backend/.env creado con JWT_SECRET aleatorio."
  warn "Edítalo si necesitas configurar SMTP u otras variables."
  echo ""
fi

# ---------------------------------------------------------------------------
# 3. Instalar dependencias del frontend si falta node_modules
# ---------------------------------------------------------------------------
if [[ ! -d secure-tenis/node_modules ]]; then
  info "Instalando dependencias del frontend (primera vez)..."
  npm install --prefix secure-tenis --silent
  log "Dependencias instaladas."
fi

# ---------------------------------------------------------------------------
# 4. Arrancar contenedores Docker (BD + Backend)
# ---------------------------------------------------------------------------
info "Arrancando contenedores Docker (BD + Backend)..."
docker compose up --build -d
log "Contenedores en marcha."

# ---------------------------------------------------------------------------
# 5. Esperar a que el backend responda
# ---------------------------------------------------------------------------
info "Esperando a que el backend esté listo..."
MAX_WAIT=90
ELAPSED=0
while ! curl -sf http://localhost:3000 >/dev/null 2>&1; do
  if [[ $ELAPSED -ge $MAX_WAIT ]]; then
    warn "El backend tardó más de ${MAX_WAIT}s. Comprueba los logs con: docker compose logs backend"
    break
  fi
  sleep 3
  ELAPSED=$((ELAPSED + 3))
  echo -n "."
done
[[ $ELAPSED -lt $MAX_WAIT ]] && echo "" && log "Backend listo."

# ---------------------------------------------------------------------------
# 6. Seed (solo si se pasa --seed)
# ---------------------------------------------------------------------------
if [[ "$SEED" == "true" ]]; then
  info "Ejecutando seed de la base de datos..."
  if docker exec tfg-backend npx ts-node prisma/seed.ts; then
    log "Base de datos poblada correctamente."
  else
    warn "El seed falló o los datos ya existen — es seguro ignorarlo en arranques posteriores."
  fi
fi

# ---------------------------------------------------------------------------
# 7. Arrancar frontend (Vite) en primer plano
#    Al pulsar Ctrl+C, el trap detiene también los contenedores Docker
# ---------------------------------------------------------------------------
cleanup() {
  echo ""
  info "Deteniendo contenedores Docker..."
  docker compose stop
  log "Todo detenido. ¡Hasta luego!"
}
trap cleanup INT TERM

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  SecureTenis listo 🎾${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "  Frontend  →  ${CYAN}http://localhost:5173${NC}"
echo -e "  Backend   →  ${CYAN}http://localhost:3000${NC}"
echo -e "  MariaDB   →  ${CYAN}localhost:3306${NC}"
echo ""
echo "  Ctrl+C para detener todo"
echo ""

npm run dev --prefix secure-tenis
