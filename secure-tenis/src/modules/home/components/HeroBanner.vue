<template>
  <section class="hero-banner rounded-3">
    <div class="hero-split">

      <!-- Izquierda: texto -->
      <div class="hero-left" data-aos="fade-right">
        <div class="hero-logo">
          <span class="hero-logo-secure">Secure</span><span class="hero-logo-tenis">Tenis</span>
        </div>
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

      <!-- Derecha: imagen de modelo -->
      <div class="hero-right" data-aos="fade-left" data-aos-delay="150">
        <div class="hero-image-wrap">
          <img src="@/assets/images/PesonaConGafas.jpg" alt="Modelo con gafas" class="hero-model-img" />
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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

/* ── Logo hero ── */
.hero-logo {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.01em;
  margin-bottom: 1.5rem;
  user-select: none;
}
.hero-logo-secure {
  color: #F4F4F2;
}
.hero-logo-tenis {
  color: var(--color-garnet);
}
.hero-banner {
  position: relative;
  background-color: #1E1E1E;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 22px,
    rgba(200, 200, 200, 0.035) 22px,
    rgba(200, 200, 200, 0.035) 23px
  );
  border: 1px solid rgba(200, 200, 200, 0.1);
  overflow: hidden;
}

/* Halo de granate en la esquina derecha (pseudo-elemento, no degradado de fondo) */
.hero-banner::after {
  content: '';
  position: absolute;
  right: -80px;
  top: 50%;
  transform: translateY(-50%);
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(107, 30, 46, 0.22) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Split ── */
.hero-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: end;
  min-height: 260px;
  padding: 0 0 0 3.5rem;
  gap: 0;
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
.hero-left {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

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

/* ── Derecha / Imagen ── */
.hero-right {
  /* sale del padding del grid y llega al borde derecho del banner */
  margin-right: -3.5rem;
  margin-bottom: 0;
  align-self: stretch;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  overflow: hidden;
}

.hero-image-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 260px;
  /* Máscara: disuelve solo por la izquierda y por abajo; derecha sin recorte */
  -webkit-mask-image:
    linear-gradient(to bottom, #000 55%, transparent 100%),
    linear-gradient(to right,  transparent 0%, #000 22%, #000 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(to bottom, #000 55%, transparent 100%),
    linear-gradient(to right,  transparent 0%, #000 22%, #000 100%);
  mask-composite: intersect;
}

.hero-model-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
  mix-blend-mode: luminosity;
  filter: contrast(1.05) brightness(0.95);
}

/* ── (estilos del visual decorativo eliminados) ── */
.visual-dot--1 { top: 14%;  right: 17%; animation: dot-pulse 3s ease-in-out infinite; }
.visual-dot--2 { bottom: 19%; left: 13%; animation: dot-pulse 3s ease-in-out infinite 1s; }
.visual-dot--3 { top: 54%; right: 7%; width: 6px; height: 6px; animation: dot-pulse 3s ease-in-out infinite 2s; }

@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50%       { transform: scale(1.45); opacity: 0.85; }
}
</style>
