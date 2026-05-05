<template>
  <section class="hero-banner rounded-3">
    <div class="hero-split">

      <!-- Izquierda: texto -->
      <div class="hero-left" data-aos="fade-right">
        <span class="hero-badge">Nueva Colección 2026</span>
        <h1 class="hero-title">
          Viste con<br>
          <span class="hero-title-accent">actitud propia</span>
        </h1>
        <p class="hero-desc">
          Zapatillas, ropa y accesorios seleccionados para quienes no se conforman con lo ordinario.
        </p>
        <div class="hero-actions">
          <button class="btn-hero-primary" @click="emit('scroll-to-products')">
            Ver Colección <i class="bi bi-arrow-right ms-2"></i>
          </button>
          <router-link class="btn-hero-ghost" to="/productos">
            Explorar todo
          </router-link>
        </div>
      </div>

      <!-- Derecha: visual decorativo -->
      <div class="hero-right" data-aos="fade-left" data-aos-delay="150">
        <div class="hero-visual">
          <div class="visual-ring visual-ring--outer" />
          <div class="visual-ring visual-ring--inner" />
          <div class="visual-center">
            <span class="visual-monogram">ST</span>
          </div>
          <div class="visual-dot visual-dot--1" />
          <div class="visual-dot visual-dot--2" />
          <div class="visual-dot visual-dot--3" />
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'scroll-to-products'): void
}>()
</script>

<style scoped>
.hero-banner {
  background:
    radial-gradient(ellipse at 70% 50%, rgba(107, 30, 46, 0.25) 0%, transparent 60%),
    linear-gradient(135deg, #1E1E1E 0%, #282828 100%);
  border: 1px solid rgba(200, 200, 200, 0.1);
  overflow: hidden;
}

/* ── Split ── */
.hero-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  min-height: 460px;
  padding: 3rem 3.5rem;
  gap: 2rem;
}

@media (max-width: 900px) {
  .hero-split {
    grid-template-columns: 1fr;
    padding: 2.5rem 1.75rem;
    min-height: auto;
    text-align: center;
  }
  .hero-right { display: none; }
  .hero-actions { justify-content: center; }
  .hero-desc { max-width: 100%; }
}

/* ── Izquierda ── */
.hero-badge {
  display: inline-block;
  padding: 0.3rem 1rem;
  border-radius: 50px;
  border: 1px solid rgba(200, 200, 200, 0.35);
  background: rgba(200, 200, 200, 0.09);
  color: #F4F4F2;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1.35rem;
}

.hero-title {
  font-size: clamp(2.2rem, 4.5vw, 3.6rem);
  font-weight: 800;
  line-height: 1.1;
  color: #F4F4F2;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.hero-title-accent {
  color: #CECECE;
}

.hero-desc {
  font-size: 1.05rem;
  color: rgba(210, 210, 210, 0.82);
  line-height: 1.7;
  max-width: 420px;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.btn-hero-primary {
  padding: 0.7rem 1.75rem;
  border-radius: 50px;
  background: var(--color-garnet);
  color: var(--color-cream);
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
}
.btn-hero-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(107, 30, 46, 0.5);
  filter: brightness(1.1);
}

.btn-hero-ghost {
  padding: 0.7rem 1.75rem;
  border-radius: 50px;
  border: 1px solid rgba(200, 200, 200, 0.35);
  color: rgba(240, 240, 240, 0.85);
  background: transparent;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.btn-hero-ghost:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #F4F4F2;
  border-color: rgba(200, 200, 200, 0.55);
}

/* ── Derecha / Visual ── */
.hero-right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-visual {
  position: relative;
  width: 300px;
  height: 300px;
}

.visual-ring {
  position: absolute;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.visual-ring--outer {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(200, 200, 200, 0.25);
}
.visual-ring--inner {
  width: 66%;
  height: 66%;
  border: 1px solid rgba(200, 200, 200, 0.12);
  background: radial-gradient(circle, rgba(107, 30, 46, 0.12) 0%, transparent 70%);
}

.visual-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 18px;
  background: var(--color-garnet);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 40px rgba(107, 30, 46, 0.45), 0 8px 32px rgba(0, 0, 0, 0.3);
}

.visual-monogram {
  font-size: 2rem;
  font-weight: 900;
  color: var(--color-cream);
  letter-spacing: 0.04em;
}

.visual-dot {
  position: absolute;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #CECECE;
  opacity: 0.65;
}
.visual-dot--1 { top: 14%;  right: 17%; animation: dot-pulse 3s ease-in-out infinite; }
.visual-dot--2 { bottom: 19%; left: 13%; animation: dot-pulse 3s ease-in-out infinite 1s; }
.visual-dot--3 { top: 54%; right: 7%; width: 6px; height: 6px; animation: dot-pulse 3s ease-in-out infinite 2s; }

@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50%       { transform: scale(1.45); opacity: 0.85; }
}
</style>
