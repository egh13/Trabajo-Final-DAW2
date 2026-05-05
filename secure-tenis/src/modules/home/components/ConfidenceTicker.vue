<template>
  <div class="confidence-ticker" aria-hidden="true">
    <div class="ticker-track">
      <template v-for="(item, i) in items.concat(items)" :key="i">
        <span class="ticker-item">
          <i :class="`bi ${item.icon}`" />
          {{ item.label }}
        </span>
        <span class="ticker-sep">✦</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const items = [
  { icon: 'bi-truck',              label: 'Envío gratuito desde 50 €'  },
  { icon: 'bi-arrow-return-left',  label: 'Devolución en 30 días'      },
  { icon: 'bi-shield-check',       label: 'Pago 100 % seguro'          },
  { icon: 'bi-headset',            label: 'Atención al cliente 24 / 7' },
  { icon: 'bi-award',              label: 'Calidad garantizada'         },
  { icon: 'bi-bag-check-fill',     label: 'Más de 1.000 referencias'   },
]
</script>

<style scoped>
.confidence-ticker {
  overflow: hidden;
  padding: 0.65rem 0;
  background: var(--color-garnet);
  border-radius: 0.5rem;
}

.ticker-track {
  display: flex;
  width: max-content;
  animation: ticker-ltr 32s linear infinite;
}

.ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: rgba(245, 240, 232, 0.92);
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  white-space: nowrap;
  padding: 0 0.5rem;
}

.ticker-item i {
  color: rgba(245, 240, 232, 0.65);
  font-size: 0.85rem;
}

.ticker-sep {
  color: rgba(245, 240, 232, 0.28);
  font-size: 0.5rem;
  padding: 0 0.75rem;
  align-self: center;
}

@keyframes ticker-ltr {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
</style>
