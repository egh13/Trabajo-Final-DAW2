<template>
  <div class="container-fluid">
    <h2 class="fw-bold mb-4">🔐 Autenticación y Accesos</h2>

    <!-- KPI cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card border-0 shadow-sm text-center py-3">
          <div class="card-body">
            <div class="kpi-value text-success">1.284</div>
            <div class="small text-muted">Inicios de sesión (30d)</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm text-center py-3">
          <div class="card-body">
            <div class="kpi-value text-danger">37</div>
            <div class="small text-muted">Intentos fallidos (30d)</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm text-center py-3">
          <div class="card-body">
            <div class="kpi-value text-primary">89</div>
            <div class="small text-muted">Usuarios activos hoy</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm text-center py-3">
          <div class="card-body">
            <div class="kpi-value text-warning">3</div>
            <div class="small text-muted">Cuentas bloqueadas</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <!-- Login chart placeholder -->
      <div class="col-md-8">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
            <span class="fw-semibold">Inicios de sesión vs Intentos fallidos</span>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-secondary active">7d</button>
              <button class="btn btn-outline-secondary">30d</button>
              <button class="btn btn-outline-secondary">90d</button>
            </div>
          </div>
          <div class="card-body d-flex align-items-center justify-content-center">
            <div class="chart-placeholder">
              <div class="chart-bars">
                <div v-for="(bar, i) in chartBars" :key="i" class="chart-bar-group">
                  <div class="chart-bar bar-success" :style="{ height: bar.ok + 'px' }"></div>
                  <div class="chart-bar bar-danger" :style="{ height: bar.fail + 'px' }"></div>
                  <span class="chart-label small text-muted">{{ bar.day }}</span>
                </div>
              </div>
              <p class="text-muted small mt-3 mb-0 text-center">
                <i class="bi bi-info-circle me-1"></i>Gráfico de ejemplo — los datos reales se cargarán desde la API
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent sessions -->
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-bottom">
            <span class="fw-semibold">Últimas sesiones</span>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between align-items-center" v-for="(s, i) in recentSessions" :key="i">
              <div>
                <div class="fw-semibold small">{{ s.user }}</div>
                <div class="text-muted" style="font-size: 0.75rem">{{ s.time }}</div>
              </div>
              <span class="badge rounded-pill" :class="s.ok ? 'bg-success' : 'bg-danger'">
                {{ s.ok ? 'OK' : 'Fallido' }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Failed attempts detail -->
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <span class="fw-semibold text-danger"><i class="bi bi-shield-exclamation me-2"></i>Últimos intentos fallidos</span>
        <span class="badge bg-danger">{{ failedAttempts.length }}</span>
      </div>
      <div class="table-responsive">
        <table class="table table-hover mb-0 align-middle">
          <thead class="table-light">
            <tr>
              <th>Fecha/Hora</th>
              <th>Email</th>
              <th>IP</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(a, i) in failedAttempts" :key="i">
              <td class="small">{{ a.time }}</td>
              <td class="small fw-semibold">{{ a.email }}</td>
              <td class="small font-monospace">{{ a.ip }}</td>
              <td><span class="badge bg-danger bg-opacity-10 text-danger">{{ a.reason }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const chartBars = [
  { day: 'Lun', ok: 90, fail: 12 },
  { day: 'Mar', ok: 110, fail: 8 },
  { day: 'Mié', ok: 85, fail: 15 },
  { day: 'Jue', ok: 120, fail: 5 },
  { day: 'Vie', ok: 140, fail: 20 },
  { day: 'Sáb', ok: 60, fail: 3 },
  { day: 'Dom', ok: 45, fail: 2 },
]

const recentSessions = [
  { user: 'admin@securetenis.com', time: 'Hace 5 min', ok: true },
  { user: 'ana.lopez@gmail.com', time: 'Hace 12 min', ok: true },
  { user: 'desconocido@test.com', time: 'Hace 18 min', ok: false },
  { user: 'carlos.m@hotmail.com', time: 'Hace 25 min', ok: true },
  { user: 'hacker@evil.com', time: 'Hace 32 min', ok: false },
]

const failedAttempts = [
  { time: '2026-04-21 10:36:01', email: 'desconocido@test.com', ip: '192.168.1.105', reason: 'Contraseña incorrecta' },
  { time: '2026-04-21 10:32:44', email: 'hacker@evil.com', ip: '45.33.32.156', reason: 'Usuario no encontrado' },
  { time: '2026-04-21 09:58:12', email: 'admin@securetenis.com', ip: '192.168.1.10', reason: 'Contraseña incorrecta' },
  { time: '2026-04-20 22:15:03', email: 'test@test.com', ip: '103.21.244.0', reason: 'Usuario no encontrado' },
  { time: '2026-04-20 20:44:30', email: 'admin@securetenis.com', ip: '185.220.101.1', reason: 'Token expirado' },
]
</script>

<style scoped>
.kpi-value {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
}

.chart-placeholder {
  width: 100%;
  padding: 1rem 0;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1.5rem;
  height: 160px;
}

.chart-bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.chart-bar {
  width: 22px;
  border-radius: 4px 4px 0 0;
  transition: height 0.4s ease;
}

.bar-success { background: #22c55e; }
.bar-danger { background: #ef4444; }

.chart-label {
  margin-top: 6px;
}
</style>
