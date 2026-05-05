<template>
  <section class="editorial-section">
    <div class="editorial-grid">

      <router-link class="editorial-card editorial-card--dark" to="/zapatillas" data-aos="fade-up">
        <div class="ed-content">
          <span class="ed-overline">Temporada 2026</span>
          <h3 class="ed-title">Zapatillas que<br>marcan tendencia</h3>
          <span class="ed-cta">Ver Zapatillas <i class="bi bi-arrow-right" /></span>
        </div>
      </router-link>

      <router-link class="editorial-card editorial-card--warm" to="/ropa" data-aos="fade-up" data-aos-delay="100">
        <div class="ed-content">
          <span class="ed-overline">Lookbook</span>
          <h3 class="ed-title">Ropa para<br>cada ocasión</h3>
          <span class="ed-cta">Ver Ropa <i class="bi bi-arrow-right" /></span>
        </div>
      </router-link>

    </div>
  </section>
</template>

<script setup lang="ts">
// componente estático — sin lógica
</script>

<style scoped>
.editorial-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .editorial-grid { grid-template-columns: 1fr; }
}

.editorial-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 1rem;
  padding: 2rem 1.75rem;
  text-decoration: none;
  min-height: 280px;
  position: relative;
  overflow: hidden;
  transition: transform 0.28s ease, box-shadow 0.28s ease;
}

.editorial-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.editorial-card--dark {
  background: linear-gradient(
    160deg,
    var(--color-espresso) 0%,
    #2A1810 55%,
    rgba(107, 30, 46, 0.35) 100%
  );
  border: 1px solid rgba(201, 170, 130, 0.08);
}

.editorial-card--warm {
  background: linear-gradient(
    160deg,
    var(--color-coffee) 0%,
    #3D1F10 55%,
    var(--color-espresso) 100%
  );
  border: 1px solid rgba(201, 170, 130, 0.06);
}

.ed-content {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
  z-index: 1;
}

.ed-overline {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(201, 170, 130, 0.6);
}

.ed-title {
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--color-cream);
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin: 0;
}

.ed-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-cream);
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.85rem;
  opacity: 0.75;
  transition: opacity 0.2s, gap 0.2s;
}

.editorial-card:hover .ed-cta {
  opacity: 1;
  gap: 0.65rem;
}
</style>
