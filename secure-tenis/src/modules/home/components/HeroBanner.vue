<template>
  <section class="hero-banner rounded-3 mb-4">

    <div class="hero-ticker" aria-hidden="true">
      <div class="ticker-track">
        <template v-for="(item, i) in tickerItems.concat(tickerItems)" :key="i">
          <span class="ticker-item">
            <i :class="`bi ${item.icon}`"></i>{{ item.label }}
          </span>
          <span class="ticker-sep">✦</span>
        </template>
      </div>
    </div>

    <div class="hero-content text-center py-5 px-3">
      <span class="badge bg-accent text-white mb-3 px-3 py-2 fs-6" data-aos="fade-down">Nueva Colección 2026</span>
      <h1 class="display-5 fw-bold text-white mb-3" data-aos="fade-up" data-aos-delay="100">
        Bienvenido a <span class="text-accent">Secure Tenis</span>
      </h1>
      <p class="lead text-light mb-4 mx-auto" style="max-width: 520px;" data-aos="fade-up" data-aos-delay="200">
        Los mejores tenis para cada ocasión. Calidad y estilo en cada paso.
      </p>
      <div data-aos="fade-up" data-aos-delay="300">
        <button class="btn btn-accent btn-lg px-5 shadow" @click="emit('scroll-to-products')">
          Ver Productos <i class="bi bi-arrow-down ms-2"></i>
        </button>
      </div>
    </div>

    <div class="hero-ticker" aria-hidden="true">
      <div class="ticker-track ticker-track--reverse">
        <template v-for="(item, i) in tickerItems.concat(tickerItems)" :key="i">
          <span class="ticker-item">
            <i :class="`bi ${item.icon}`"></i>{{ item.label }}
          </span>
          <span class="ticker-sep">✦</span>
        </template>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'scroll-to-products'): void
}>()

const tickerItems = [
  { icon: 'bi-bag-fill',              label: 'Zapatillas'      },
  { icon: 'bi-person-fill',           label: 'Camisetas'       },
  { icon: 'bi-gem',                   label: 'Colgantes'       },
  { icon: 'bi-lightning-charge-fill', label: 'Moda Urbana'     },
  { icon: 'bi-trophy-fill',           label: 'Deporte'         },
  { icon: 'bi-stars',                 label: 'Accesorios'      },
  { icon: 'bi-heart-fill',            label: 'Ropa de Calle'   },
  { icon: 'bi-wind',                  label: 'Running'         },
  { icon: 'bi-palette-fill',          label: 'Estilo Propio'   },
]
</script>

<style scoped>
.hero-banner {
  background:
    radial-gradient(ellipse at 75% 50%, rgba(233, 69, 96, 0.18) 0%, transparent 55%),
    linear-gradient(135deg, var(--color-dark) 0%, var(--color-dark-surface) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease;
}

.hero-banner:hover {
  border-color: rgba(233, 69, 96, 0.3);
  box-shadow: 0 0 30px rgba(233, 69, 96, 0.18), 0 6px 20px rgba(233, 69, 96, 0.1);
  transform: scale(1.002);
}

.hero-content {
  max-width: 640px;
  margin: 0 auto;
  padding-top: 3.5rem;
  padding-bottom: 3.5rem;
}

/* ── Ticker ── */
.hero-ticker {
  overflow: hidden;
  padding: 0.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.ticker-track {
  display: flex;
  width: max-content;
  animation: ticker-ltr 28s linear infinite;
}

.ticker-track--reverse {
  animation: ticker-rtl 28s linear infinite;
}

.ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  padding: 0 0.25rem;
}

.ticker-item i {
  color: var(--color-accent);
  font-size: 0.8rem;
}

.ticker-sep {
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.55rem;
  padding: 0 0.75rem;
  align-self: center;
}

@keyframes ticker-ltr {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@keyframes ticker-rtl {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
}
</style>
