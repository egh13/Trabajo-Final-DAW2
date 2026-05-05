<template>
  <div class="container-fluid px-0">
    <h2 class="fw-bold mb-4">Estado General del Sistema</h2>

    <div class="row g-3 mb-4">
      <div class="col-md-4" data-aos="fade-up" data-aos-delay="0">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex align-items-center gap-3">
              <div class="status-indicator bg-success"></div>
              <div>
                <h6 class="mb-0 text-muted small text-uppercase" style="letter-spacing:.05em">Backend</h6>
                <span class="fw-bold fs-5 status-text">Operativo</span>
              </div>
            </div>
            <hr />
            <div class="row text-center small text-muted">
              <div class="col">
                <div class="fw-semibold status-text">99.9%</div>
                Uptime
              </div>
              <div class="col">
                <div class="fw-semibold status-text">42ms</div>
                Latencia
              </div>
              <div class="col">
                <div class="fw-semibold status-text">v1.0.0</div>
                Versión
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4" data-aos="fade-up" data-aos-delay="80">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex align-items-center gap-3">
              <div class="status-indicator bg-success"></div>
              <div>
                <h6 class="mb-0 text-muted small text-uppercase">Base de Datos</h6>
                <span class="fw-bold fs-5 status-text">Conectada</span>
              </div>
            </div>
            <hr />
            <div class="row text-center small text-muted">
              <div class="col">
                <div class="fw-semibold status-text">MariaDB</div>
                Motor
              </div>
              <div class="col">
                <div class="fw-semibold status-text">156 MB</div>
                Tamaño
              </div>
              <div class="col">
                <div class="fw-semibold status-text">12</div>
                Tablas
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4" data-aos="fade-up" data-aos-delay="160">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex align-items-center gap-3">
              <div class="status-indicator bg-warning"></div>
              <div>
                <h6 class="mb-0 text-muted small text-uppercase">Última Backup</h6>
                <span class="fw-bold fs-5 status-text">Hace 2 días</span>
              </div>
            </div>
            <hr />
            <div class="d-flex justify-content-between small text-muted">
              <span>Tamaño: <strong class="status-text">84 MB</strong></span>
              <span>Estado: <strong class="text-warning">Pendiente</strong></span>
            </div>
            <button class="btn btn-sm btn-outline-admin w-100 mt-3" disabled>
              <i class="bi bi-download me-1"></i> Realizar backup ahora
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm" data-aos="fade-up" data-aos-delay="240">
      <div class="card-header card-header-console d-flex justify-content-between align-items-center">
        <span class="fw-semibold"><i class="bi bi-terminal me-2"></i>Últimos Logs del Sistema</span>
        <span class="badge bg-success">Live</span>
      </div>
      <div class="card-body p-0">
        <div class="log-console">
          <div class="log-line" v-for="(log, i) in sampleLogs" :key="i">
            <span class="log-time text-muted">{{ log.time }}</span>
            <span class="log-level" :class="'level-' + log.level">{{ log.level.toUpperCase() }}</span>
            <span class="log-msg">{{ log.message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sampleLogs = [
  { time: '2026-04-21 10:32:01', level: 'info', message: 'Servidor iniciado en puerto 3000' },
  { time: '2026-04-21 10:32:02', level: 'info', message: 'Conexión a MariaDB establecida correctamente' },
  { time: '2026-04-21 10:33:15', level: 'info', message: 'GET /api/products — 200 OK (23ms)' },
  { time: '2026-04-21 10:34:08', level: 'warn', message: 'Intento de acceso sin token a /api/orders' },
  { time: '2026-04-21 10:35:42', level: 'info', message: 'POST /api/auth/login — 200 OK (145ms)' },
  { time: '2026-04-21 10:36:01', level: 'error', message: 'POST /api/auth/login — 401 Credenciales inválidas' },
  { time: '2026-04-21 10:37:55', level: 'info', message: 'GET /api/categories — 200 OK (8ms)' },
  { time: '2026-04-21 10:38:20', level: 'info', message: 'Backup automático completado — 84 MB' },
]
</script>

<style scoped>
.status-text {
  color: var(--color-surface, #1E1E1E);
}

.card-header-console {
  background: var(--color-surface, #1E1E1E);
  color: #fff;
}

.btn-outline-admin {
  border-color: var(--color-garnet, #6B1E2E);
  color: var(--color-garnet, #6B1E2E);
}

.btn-outline-admin:hover {
  background: var(--color-garnet, #6B1E2E);
  color: #fff;
}

.status-indicator {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  flex-shrink: 0;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(107, 30, 46, 0.35); }
  50% { box-shadow: 0 0 0 7px rgba(107, 30, 46, 0); }
}

.log-console {
  background: #0a0a0a;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.8rem;
  padding: 1rem;
  max-height: 320px;
  overflow-y: auto;
}

.log-line {
  display: flex;
  gap: 1rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid #1a1a1a;
}

.log-time {
  color: #666;
  flex-shrink: 0;
}

.log-level {
  font-weight: 700;
  flex-shrink: 0;
  width: 50px;
  text-align: center;
  border-radius: 3px;
  padding: 0 4px;
  font-size: 0.7rem;
  line-height: 1.6;
}

.level-info { color: #22c55e; }
.level-warn { color: #f59e0b; }
.level-error { color: #ef4444; }

.log-msg {
  color: #d4d4d4;
}
</style>
