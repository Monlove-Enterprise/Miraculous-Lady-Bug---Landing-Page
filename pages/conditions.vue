<script setup lang="ts">
const { locale } = useLocale()
useHead({
  title: () =>
    locale.value === 'fr'
      ? "Conditions d'utilisation — Miraculous : Le Spectacle Live"
      : 'Terms of Use — Miraculous: The Live Stage Spectacular',
})
</script>

<template>
  <LegalPage :title="locale === 'fr' ? 'Conditions d\'utilisation' : 'Terms of Use'">
    <!-- FRENCH -->
    <template v-if="locale === 'fr'">
      <p class="updated">Dernière mise à jour : 15 juillet 2026</p>

      <h2>1. À propos des présentes conditions</h2>
      <p>
        Les présentes conditions d'utilisation régissent votre accès et votre utilisation de
        MiraculousLadybugLive.com (le «&nbsp;Site&nbsp;»). En accédant au Site ou en l'utilisant,
        vous acceptez ces conditions. Si vous ne les acceptez pas, veuillez ne pas utiliser le Site.
      </p>
      <p>
        Ces conditions doivent être lues conjointement avec notre
        <NuxtLink to="/confidentialite">politique de confidentialité</NuxtLink> et nos
        <NuxtLink to="/mentions-legales">mentions légales</NuxtLink>, qui y sont intégrées par
        renvoi et qui régissent ensemble votre utilisation du Site.
      </p>

      <h2>2. Exploitant du Site</h2>
      <p>
        Le Site est exploité par Belle &amp; Bright Management Inc., exerçant sous le nom commercial
        Monlove International («&nbsp;MONLOVE&nbsp;», «&nbsp;nous&nbsp;» ou «&nbsp;notre&nbsp;»), 1597
        Berges du Nord, Wentworth‑Nord (Québec) J0T 1Y0, Canada (NEQ 1177091189). Le Site fait la
        promotion de Miraculous : Ladybug &amp; Cat Noir — The Live Stage Spectacular, présenté sous
        licence de MIRACULOUS CORP.
      </p>

      <h2>3. Objet</h2>
      <p>
        Le Site fournit des informations sur la production et permet aux visiteurs de rejoindre la
        liste d'attente officielle. L'inscription ne garantit ni la tenue de représentations dans
        une ville, ni la disponibilité de billets, ni un accès prioritaire, ni de futures
        communications.
      </p>

      <h2>4. Admissibilité</h2>
      <p>
        Vous devez être âgé d'au moins 16 ans, ou de tout âge supérieur requis par la loi
        applicable, pour soumettre des informations personnelles.
      </p>

      <h2>5. Utilisation acceptable</h2>
      <p>
        Vous ne pouvez utiliser le Site qu'à des fins licites, personnelles et non commerciales.
        Vous ne devez pas perturber le Site, tenter un accès non autorisé, téléverser des logiciels
        malveillants, extraire du contenu en violation de la loi applicable, soumettre de fausses
        informations ni porter atteinte aux droits d'autrui.
      </p>

      <h2>6. Propriété intellectuelle</h2>
      <p>
        L'ensemble du contenu est protégé par le droit d'auteur, le droit des marques et les autres
        droits de propriété intellectuelle. Miraculous®, Ladybug®, Cat Noir® et les éléments
        associés sont la propriété de MIRACULOUS CORP. et/ou de leurs titulaires de droits respectifs
        et sont utilisés sous licence. Aucun droit de propriété ni aucune licence n'est accordé,
        hormis le droit limité d'accéder au Site à des fins personnelles et non commerciales.
      </p>

      <h2>7. Liens vers des tiers</h2>
      <p>
        Les liens vers des sites tiers sont fournis à titre de commodité uniquement. Nous ne sommes
        pas responsables de leur contenu ni de leurs pratiques.
      </p>

      <h2>8. Avertissement</h2>
      <p>
        Le Site est fourni «&nbsp;tel que disponible&nbsp;». Les informations peuvent être modifiées
        sans préavis.
      </p>

      <h2>9. Limitation de responsabilité</h2>
      <p>
        Dans toute la mesure permise par la loi, MONLOVE ainsi que ses concédants de licence,
        partenaires et prestataires de services ne sauraient être tenus responsables des dommages
        indirects, accessoires ou consécutifs résultant de l'utilisation du Site.
      </p>

      <h2>10. Indemnisation</h2>
      <p>
        Vous acceptez d'indemniser et de dégager de toute responsabilité MONLOVE et ses sociétés
        affiliées à l'égard de toute réclamation découlant de votre utilisation abusive du Site ou de
        la violation des présentes conditions.
      </p>

      <h2>11. Résiliation</h2>
      <p>
        Nous nous réservons le droit de suspendre ou de résilier l'accès au Site si nous estimons
        raisonnablement que les présentes conditions ont été enfreintes.
      </p>

      <h2>12. Modification des conditions</h2>
      <p>
        Nous pouvons mettre à jour les présentes conditions de temps à autre afin de refléter les
        évolutions du Site, de nos services ou de la loi applicable. La version mise à jour sera
        publiée sur cette page avec une date de «&nbsp;dernière mise à jour&nbsp;» révisée.
      </p>

      <h2>13. Droit applicable</h2>
      <p>
        Les présentes conditions sont régies par les lois du Québec et les lois fédérales
        applicables du Canada. Sous réserve des droits impératifs des consommateurs, tout litige sera
        soumis aux tribunaux de Montréal (Québec).
      </p>

      <h2>14. Divisibilité</h2>
      <p>
        Si une disposition est jugée inapplicable, les dispositions restantes demeurent en vigueur.
      </p>

      <h2>15. Intégralité de l'accord</h2>
      <p>
        Les présentes conditions constituent l'intégralité de l'accord concernant l'utilisation du
        Site.
      </p>

      <h2>16. Contact</h2>
      <p>
        Toute question relative aux présentes conditions peut être adressée à :
        <a href="mailto:info@monlove.com">info@monlove.com</a>.
      </p>
    </template>

    <!-- ENGLISH -->
    <template v-else>
      <p class="updated">Last updated: 15 July 2026</p>

      <h2>1. About these Terms</h2>
      <p>
        These Terms of Use govern your access to and use of MiraculousLadybugLive.com (the "Site").
        By accessing or using the Site, you agree to these Terms. If you do not agree, please do not
        use the Site.
      </p>
      <p>
        These Terms should be read together with our
        <NuxtLink to="/confidentialite">Privacy Notice</NuxtLink> and
        <NuxtLink to="/mentions-legales">Legal Notice</NuxtLink>, which are incorporated by reference
        and together govern your use of the Site.
      </p>

      <h2>2. Site Operator</h2>
      <p>
        The Site is operated by Belle &amp; Bright Management Inc., operating under the trade name
        Monlove International ("MONLOVE", "we", "us" or "our"), 1597 Berges du Nord, Wentworth‑Nord,
        Québec J0T 1Y0, Canada (NEQ 1177091189). The Site promotes Miraculous: Ladybug &amp; Cat Noir
        — The Live Stage Spectacular, presented under licence from MIRACULOUS CORP.
      </p>

      <h2>3. Purpose</h2>
      <p>
        The Site provides information about the production and allows visitors to join the official
        waitlist. Registration does not guarantee performances in any city, ticket availability,
        priority access or future communications.
      </p>

      <h2>4. Eligibility</h2>
      <p>
        You must be at least 16 years of age, or any higher age required by applicable law, to submit
        personal information.
      </p>

      <h2>5. Acceptable Use</h2>
      <p>
        You may use the Site only for lawful, personal and non-commercial purposes. You must not
        interfere with the Site, attempt unauthorized access, upload malicious software, scrape
        content contrary to applicable law, submit false information or infringe the rights of
        others.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        All content is protected by copyright, trademark and other intellectual property laws.
        Miraculous®, Ladybug®, Cat Noir® and related elements are owned by MIRACULOUS CORP. and/or
        their respective rights holders and are used under licence. No ownership or licence is
        granted except the limited right to access the Site for personal, non-commercial use.
      </p>

      <h2>7. Third-Party Links</h2>
      <p>
        Links to third-party websites are provided for convenience only. We are not responsible for
        their content or practices.
      </p>

      <h2>8. Disclaimer</h2>
      <p>
        The Site is provided on an "as available" basis. Information may change without notice.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, MONLOVE and its licensors, partners and service
        providers shall not be liable for indirect, incidental or consequential damages arising from
        use of the Site.
      </p>

      <h2>10. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless MONLOVE and its affiliates from claims arising from
        your misuse of the Site or violation of these Terms.
      </p>

      <h2>11. Termination</h2>
      <p>
        We reserve the right to suspend or terminate access to the Site if we reasonably believe
        these Terms have been violated.
      </p>

      <h2>12. Changes to the Terms</h2>
      <p>
        We may update these Terms from time to time to reflect changes to the Site, our services or
        applicable law. The updated version will be posted on this page with a revised "Last updated"
        date.
      </p>

      <h2>13. Governing Law</h2>
      <p>
        These Terms are governed by the laws of Québec and the applicable federal laws of Canada.
        Subject to mandatory consumer rights, disputes shall be submitted to the courts of Montréal,
        Québec.
      </p>

      <h2>14. Severability</h2>
      <p>If any provision is held unenforceable, the remaining provisions remain in effect.</p>

      <h2>15. Entire Agreement</h2>
      <p>These Terms constitute the entire agreement regarding use of the Site.</p>

      <h2>16. Contact</h2>
      <p>
        Questions regarding these Terms may be sent to:
        <a href="mailto:info@monlove.com">info@monlove.com</a>.
      </p>
    </template>
  </LegalPage>
</template>
