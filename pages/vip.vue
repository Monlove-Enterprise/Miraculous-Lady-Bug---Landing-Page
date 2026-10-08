<script setup lang="ts">
const { t } = useLocale()

useHead(() => ({
  title: `${t('vip.title')} — Miraculous Live`,
  meta: [{ name: 'description', content: t('vip.metaDescription') }],
}))

const tiers = computed(() => [
  { name: t('vip.tier1.name'), perks: t('vip.tier1.perks').split('|'), featured: true },
  { name: t('vip.tier2.name'), perks: t('vip.tier2.perks').split('|'), featured: false },
])
</script>

<template>
  <main class="vip">
    <SiteHeader />

    <div class="container">
      <NuxtLink to="/" class="back">← {{ t('cast.back') }}</NuxtLink>

      <header class="vip__head">
        <h1 class="vip__title">{{ t('vip.title') }}</h1>
        <p class="vip__intro">{{ t('vip.intro') }}</p>
        <p class="vip__note">{{ t('vip.note') }}</p>
      </header>

      <div class="vip__grid">
        <section v-for="tier in tiers" :key="tier.name" class="tier" :class="{ 'tier--featured': tier.featured }">
          <h2 class="tier__name">{{ tier.name }}</h2>
          <ul class="tier__perks">
            <li v-for="perk in tier.perks" :key="perk">{{ perk }}</li>
          </ul>
          <p class="tier__footnote">{{ t('vip.allPreShow') }}</p>
          <NuxtLink to="/signup" class="btn btn--buy">{{ t('vip.cta') }}</NuxtLink>
        </section>
      </div>
    </div>
    <SiteFooter />
  </main>
</template>

<style scoped>
.vip {
  min-height: 100dvh;
  padding-bottom: 6rem;
  background:
    radial-gradient(80% 50% at 20% 0%, rgba(244, 14, 4, 0.16), transparent 60%),
    var(--ink);
}
.container { padding-top: 3rem; }

.back {
  display: inline-block;
  color: var(--cream-dim);
  font-size: 0.9rem;
  margin-bottom: 2.5rem;
  transition: color 0.15s ease;
}
.back:hover { color: var(--red); }

.vip__head { max-width: 760px; margin-bottom: 3rem; }
.vip__title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 7vw, 3.6rem);
  color: var(--red);
  text-transform: uppercase;
  margin-bottom: 1.2rem;
  text-wrap: balance;
}
.vip__intro {
  color: var(--cream);
  font-size: clamp(1.05rem, 2.2vw, 1.25rem);
  line-height: 1.6;
  margin-bottom: 1rem;
}
.vip__note {
  display: inline-block;
  color: var(--cream-dim);
  font-size: 0.85rem;
  padding: 0.5rem 0.9rem;
  border: 1px dashed rgba(244, 14, 4, 0.4);
  border-radius: 999px;
}

.vip__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  max-width: 980px;
}
@media (max-width: 760px) {
  .vip__grid { grid-template-columns: 1fr; }
}

.tier {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-radius: 16px;
  background: var(--ink-panel);
  border: 1px solid rgba(243, 233, 216, 0.08);
}
.tier--featured {
  border-color: var(--red);
  box-shadow: 0 0 0 1px rgba(244, 14, 4, 0.3) inset;
}

.tier__name {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 3.2vw, 1.6rem);
  color: var(--cream);
  text-transform: uppercase;
  margin-bottom: 1.3rem;
  text-wrap: balance;
}
.tier--featured .tier__name { color: var(--red); }

.tier__perks {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin: 0 0 1.4rem;
  padding: 0;
  list-style: none;
  flex: 1;
}
.tier__perks li {
  position: relative;
  padding-left: 1.3rem;
  color: var(--cream-dim);
  font-size: 0.92rem;
  line-height: 1.5;
}
.tier__perks li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--red);
}

.tier__footnote {
  color: var(--muted, var(--cream-dim));
  font-size: 0.75rem;
  font-style: italic;
  margin-bottom: 1.3rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.6rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.15s ease, background 0.15s ease;
}
.btn--buy { background: var(--red); color: #fff; align-self: flex-start; }
.btn--buy:hover { background: #ff1f4a; transform: translateY(-1px); }
</style>
