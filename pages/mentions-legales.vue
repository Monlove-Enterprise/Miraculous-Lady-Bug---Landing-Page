<script setup lang="ts">
const { locale } = useLocale()
useHead({
  title: () =>
    locale.value === 'fr'
      ? 'Mentions légales — Miraculous : Le Spectacle Live'
      : 'Legal Notice — Miraculous: The Live Stage Spectacular',
})
</script>

<template>
  <LegalPage :title="locale === 'fr' ? 'Mentions légales' : 'Legal Notice'">
    <!-- FRENCH -->
    <template v-if="locale === 'fr'">
      <p class="updated">Dernière mise à jour : 15 juillet 2026</p>

      <h2>Éditeur</h2>
      <p>
        Belle &amp; Bright Management Inc., exerçant sous le nom commercial Monlove International
        («&nbsp;MONLOVE&nbsp;»)<br />
        1597 Berges du Nord<br />
        Wentworth‑Nord (Québec) J0T 1Y0<br />
        Canada<br />
        NEQ 1177091189<br />
        <a href="mailto:info@monlove.com">info@monlove.com</a>
      </p>

      <h2>Hébergeur</h2>
      <p>
        IONOS Inc.<br />
        2 Logan Square, 100 N. 18th Street, Suite 400<br />
        Philadelphia, PA 19103<br />
        États-Unis
      </p>

      <h2>Droits d'auteur et marques</h2>
      <p>
        L'ensemble du contenu du site est protégé par le droit d'auteur et les autres droits de
        propriété intellectuelle. Miraculous®, Ladybug®, Cat Noir® et les éléments de propriété
        intellectuelle associés sont la propriété de MIRACULOUS CORP. et/ou de leurs titulaires de
        droits respectifs et sont utilisés sous licence. Toutes les autres marques appartiennent à
        leurs propriétaires respectifs. Aucun élément de ce site ne peut être reproduit, distribué
        ou autrement utilisé sans autorisation écrite préalable, sauf dans les cas permis par la loi
        applicable.
      </p>

      <h2>Documents liés</h2>
      <p>
        Les présentes mentions légales doivent être lues conjointement avec nos
        <NuxtLink to="/conditions">conditions d'utilisation</NuxtLink> et notre
        <NuxtLink to="/confidentialite">politique de confidentialité</NuxtLink>, qui régissent
        ensemble votre utilisation de MiraculousLadybugLive.com.
      </p>
    </template>

    <!-- ENGLISH -->
    <template v-else>
      <p class="updated">Last updated: 15 July 2026</p>

      <h2>Publisher</h2>
      <p>
        Belle &amp; Bright Management Inc., operating under the trade name Monlove International
        ("MONLOVE")<br />
        1597 Berges du Nord<br />
        Wentworth‑Nord, Québec J0T 1Y0<br />
        Canada<br />
        NEQ 1177091189<br />
        <a href="mailto:info@monlove.com">info@monlove.com</a>
      </p>

      <h2>Hosting Provider</h2>
      <p>
        IONOS Inc.<br />
        2 Logan Square, 100 N. 18th Street, Suite 400<br />
        Philadelphia, PA 19103<br />
        United States
      </p>

      <h2>Copyright &amp; Trademarks</h2>
      <p>
        All website content is protected by copyright and other intellectual property laws.
        Miraculous®, Ladybug®, Cat Noir® and related intellectual property are owned by MIRACULOUS
        CORP. and/or their respective rights holders and are used under licence. All other
        trademarks belong to their respective owners. No material on this Site may be reproduced,
        distributed or otherwise used without prior written permission, except as permitted by
        applicable law.
      </p>

      <h2>Related Documents</h2>
      <p>
        This Legal Notice should be read together with our
        <NuxtLink to="/conditions">Terms of Use</NuxtLink> and
        <NuxtLink to="/confidentialite">Privacy Notice</NuxtLink>, which together govern your use of
        MiraculousLadybugLive.com.
      </p>
    </template>
  </LegalPage>
</template>
