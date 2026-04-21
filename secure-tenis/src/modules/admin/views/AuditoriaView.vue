<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">📋 Auditoría de Actividad</h2>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-success btn-sm" disabled>
          <i class="bi bi-download me-1"></i> Exportar CSV
        </button>
        <button class="btn btn-outline-dark btn-sm" disabled>
          <i class="bi bi-filetype-pdf me-1"></i> Exportar PDF
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-3">
            <label class="form-label small fw-semibold text-muted">Buscar</label>
            <input type="text" class="form-control form-control-sm" placeholder="Usuario, acción, IP..." disabled />
          </div>
          <div class="col-md-2">
            <label class="form-label small fw-semibold text-muted">Nivel</label>
            <select class="form-select form-select-sm" disabled>
              <option>Todos</option>
              <option>INFO</option>
              <option>WARN</option>
              <option>ERROR</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label small fw-semibold text-muted">Módulo</label>
            <select class="form-select form-select-sm" disabled>
              <option>Todos</option>
              <option>Auth</option>
              <option>Productos</option>
              <option>Pedidos</option>
              <option>Sistema</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label small fw-semibold text-muted">Desde</label>
            <input type="date" class="form-control form-control-sm" disabled />
          </div>
          <div class="col-md-2">
            <label class="form-label small fw-semibold text-muted">Hasta</label>
            <input type="date" class="form-control form-control-sm" disabled />
          </div>
          <div class="col-md-1 d-grid">
            <button class="btn btn-success btn-sm" disabled>
              <i class="bi bi-funnel"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Logs table -->
    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover table-striped mb-0 align-middle">
          <thead class="table-dark">
            <tr>
              <th style="width: 40px">#</th>
              <th>Fecha/Hora</th>
              <th>Nivel</th>
              <th>Módulo</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>IP</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in sampleLogs" :key="log.id">
              <td class="small text-muted">{{ log.id }}</td>
              <td class="small font-monospace">{{ log.time }}</td>
              <td>
                <span class="badge" :class="levelClass(log.level)">{{ log.level }}</span>
              </td>
              <td class="small">{{ log.module }}</td>
              <td class="small fw-semibold">{{ log.user }}</td>
              <td class="small">{{ log.action }}</td>
              <td class="small font-monospace">{{ log.ip }}</td>
              <td>
                <button class="btn btn-sm btn-outline-secondary py-0 px-2" disabled>
                  <i class="bi bi-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="card-footer bg-white d-flex justify-content-between align-items-center">
        <span class="small text-muted">Mostrando 1-10 de 2.483 registros</span>
        <nav>
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item disabled"><a class="page-link" href="#">←</a></li>
            <li class="page-item active"><a class="page-link bg-success border-success" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item"><a class="page-link" href="#">...</a></li>
            <li class="page-item"><a class="page-link" href="#">249</a></li>
            <li class="page-item"><a class="page-link" href="#">→</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sampleLogs = [
  { id: 2483, time: '2026-04-21 10:38:20', level: 'INFO', module: 'Sistema', user: 'sistema', action: 'Backup automático completado', ip: '127.0.0.1' },
  { id: 2482, time: '2026-04-21 10:37:55', level: 'INFO', module: 'Productos', user: 'ana.lopez@gmail.com', action: 'GET /api/categories', ip: '192.168.1.42' },
  { id: 2481, time: '2026-04-21 10:36:01', level: 'ERROR', module: 'Auth', user: 'desconocido@test.com', action: 'Login fallido — contraseña incorrecta', ip: '192.168.1.105' },
  { id: 2480, time: '2026-04-21 10:35:42', level: 'INFO', module: 'Auth', user: 'admin@securetenis.com', action: 'Login exitoso', ip: '192.168.1.10' },
  { id: 2479, time: '2026-04-21 10:34:08', level: 'WARN', module: 'Auth', user: 'anónimo', action: 'Acceso sin token a /api/orders', ip: '45.33.32.156' },
  { id: 2478, time: '2026-04-21 10:33:15', level: 'INFO', module: 'Productos', user: 'carlos.m@hotmail.com', action: 'GET /api/products', ip: '192.168.1.88' },
  { id: 2477, time: '2026-04-21 10:30:05', level: 'INFO', module: 'Pedidos', user: 'ana.lopez@gmail.com', action: 'Nuevo pedido #412 creado', ip: '192.168.1.42' },
  { id: 2476, time: '2026-04-21 10:28:33', level: 'WARN', module: 'Sistema', user: 'sistema', action: 'Uso de memoria > 80%', ip: '127.0.0.1' },
  { id: 2475, time: '2026-04-21 10:25:11', level: 'INFO', module: 'Auth', user: 'carlos.m@hotmail.com', action: 'Login exitoso', ip: '192.168.1.88' },
  { id: 2474, time: '2026-04-21 10:20:00', level: 'ERROR', module: 'Auth', user: 'hacker@evil.com', action: 'Login fallido — usuario no encontrado', ip: '103.21.244.0' },
]

const levelClass = (level: string) => {
  switch (level) {
    case 'INFO': return 'bg-success'
    case 'WARN': return 'bg-warning text-dark'
    case 'ERROR': return 'bg-danger'
    default: return 'bg-secondary'
  }
}
</script>

<style scoped>
/* Bootstrap handles most styling, minimal custom CSS needed */
</style>
