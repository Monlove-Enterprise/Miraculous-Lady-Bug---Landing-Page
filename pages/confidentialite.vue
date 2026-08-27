<script setup lang="ts">
const { locale } = useLocale()
useHead({
  title: () =>
    locale.value === 'fr'
      ? 'Politique de confidentialité — Miraculous : Le Spectacle Live'
      : 'Privacy Notice — Miraculous: The Live Stage Spectacular',
})
</script>

<template>
  <LegalPage :title="locale === 'fr' ? 'Politique de confidentialité' : 'Privacy Notice'">
    <!-- FRENCH -->
    <template v-if="locale === 'fr'">
      <p class="updated">Dernière mise à jour : 19 août 2026</p>

      <h2>Responsable du traitement</h2>
      <p>
        Belle &amp; Bright Management Inc., exerçant sous le nom commercial Monlove International
        («&nbsp;MONLOVE&nbsp;»).
      </p>

      <h2>Informations que nous collectons</h2>
      <p>
        Prénom, adresse e-mail, ville, numéro de téléphone facultatif, pays / indicatif
        téléphonique, choix de consentement, métadonnées d'inscription, et informations techniques
        limitées telles que l'adresse IP, les informations relatives au navigateur et les journaux
        de sécurité.
      </p>

      <h2>Utilisation des informations</h2>
      <p>
        Pour gérer la liste d'attente, communiquer avec vous si vous y consentez, comprendre la
        demande du public, sécuriser le site et respecter nos obligations légales.
      </p>

      <h2>Bases légales</h2>
      <p>
        Le consentement, votre demande de rejoindre la liste d'attente, les intérêts légitimes et
        les obligations légales, selon le cas.
      </p>

      <h2>E-mail et SMS</h2>
      <p>
        L'e-mail et le SMS sont facultatifs. Vous pouvez vous désinscrire à tout moment. Nous
        prévoyons de n'envoyer que des mises à jour occasionnelles concernant la production.
      </p>

      <h2>Partage</h2>
      <p>
        Les informations peuvent être partagées avec des prestataires de services autorisés
        agissant dans le cadre d'un contrat, tels qu'identifiés ci-dessous.
      </p>

      <h2>Sous-traitants</h2>
      <ul>
        <li>IONOS (hébergement)</li>
        <li>Supabase (base de données et infrastructure applicative)</li>
        <li>Twilio (SMS, le cas échéant)</li>
        <li>Resend (e-mail, le cas échéant)</li>
        <li>
          Meta Platforms (pixel Meta — mesure d'audience et publicité, uniquement avec votre
          consentement)
        </li>
        <li>
          TikTok (pixel TikTok — mesure d’audience et publicité, uniquement avec votre consentement)
        </li>
      </ul>

      <h2>Transferts internationaux</h2>
      <p>
        Les informations peuvent être traitées au Canada, dans l'EEE, aux États-Unis et dans
        d'autres juridictions, en recourant aux clauses contractuelles types (le cas échéant) et à
        d'autres garanties appropriées lorsque cela est requis.
      </p>

      <h2>Conservation</h2>
      <p>
        Les enregistrements de la liste d'attente sont généralement conservés jusqu'à 36 mois après
        votre dernière interaction significative, sauf si une durée plus longue est requise par la
        loi.
      </p>

      <h2>Vos droits</h2>
      <p>
        Selon votre juridiction, vous pouvez demander l'accès, la rectification, la suppression, la
        limitation, la portabilité, vous opposer à certains traitements ou retirer votre
        consentement.
      </p>

      <h2>Suppression des données</h2>
      <p>
        Vous pouvez demander la suppression de vos informations personnelles à tout moment en
        écrivant à <a href="mailto:info@monlove.com">info@monlove.com</a>.
      </p>

      <h2>Décisions automatisées</h2>
      <p>
        Nous n'utilisons pas vos informations pour prendre des décisions fondées uniquement sur un
        traitement automatisé produisant des effets juridiques ou vous affectant de manière
        significative.
      </p>

      <h2>Cookies et mesure d'audience</h2>
      <p>
        Nous utilisons des technologies strictement nécessaires au fonctionnement du site. Avec
        votre consentement, nous utilisons également les pixels Meta (Facebook) et TikTok, fournis par
        Meta Platforms et TikTok, qui déposent des cookies afin de mesurer la fréquentation du site et les
        inscriptions, d'évaluer l'efficacité de nos campagnes publicitaires et de permettre le
        reciblage publicitaire. Ce pixel ne se charge qu'après votre acceptation via le bandeau de
        consentement affiché sur le site. Le refuser n'a aucune conséquence sur votre inscription,
        et vous pouvez retirer votre consentement à tout moment en supprimant les cookies de votre
        navigateur ou en nous écrivant à <a href="mailto:info@monlove.com">info@monlove.com</a>.
      </p>

      <h2>Sécurité</h2>
      <p>
        Des mesures techniques et organisationnelles raisonnables sont mises en œuvre, bien
        qu'aucun système ne soit totalement sécurisé.
      </p>

      <h2>Enfants</h2>
      <p>Le site n'est pas destiné aux enfants de moins de 16 ans.</p>

      <h2>Contact</h2>
      <p>
        Questions relatives à la confidentialité :
        <a href="mailto:info@monlove.com">info@monlove.com</a>.
      </p>

      <h2>Documents liés</h2>
      <p>
        La présente politique de confidentialité doit être lue conjointement avec nos
        <NuxtLink to="/conditions">conditions d'utilisation</NuxtLink> et nos
        <NuxtLink to="/mentions-legales">mentions légales</NuxtLink>, qui régissent ensemble votre
        utilisation de MiraculousLadybugLive.com.
      </p>
    </template>

    <!-- ENGLISH -->
    <template v-else>
      <p class="updated">Last updated: 19 August 2026</p>

      <h2>Data Controller</h2>
      <p>
        Belle &amp; Bright Management Inc., operating under the trade name Monlove International
        ("MONLOVE").
      </p>

      <h2>Information We Collect</h2>
      <p>
        First name, email, city, optional phone number, country/dialling code, consent choices,
        registration metadata, limited technical information such as IP address, browser information
        and security logs.
      </p>

      <h2>How We Use Information</h2>
      <p>
        To manage the waitlist, communicate with you if you consent, understand audience demand,
        secure the Site and comply with legal obligations.
      </p>

      <h2>Legal Bases</h2>
      <p>
        Consent, your request to join the waitlist, legitimate interests and legal obligations, as
        applicable.
      </p>

      <h2>Email &amp; SMS</h2>
      <p>
        Email and SMS are optional. You may unsubscribe at any time. We expect to send only
        occasional production updates.
      </p>

      <h2>Sharing</h2>
      <p>
        Information may be shared with authorized service providers acting under contract, as
        identified below.
      </p>

      <h2>Data Processors</h2>
      <ul>
        <li>IONOS (hosting)</li>
        <li>Supabase (database and application infrastructure)</li>
        <li>Twilio (SMS, if used)</li>
        <li>Resend (email, if used)</li>
        <li>Meta Platforms (Meta Pixel — analytics and advertising, only with your consent)</li>
        <li>TikTok (TikTok Pixel — analytics and advertising, only with your consent)</li>
      </ul>

      <h2>International Transfers</h2>
      <p>
        Information may be processed in Canada, the EEA, the United States and other jurisdictions
        using Standard Contractual Clauses (where applicable) and other appropriate safeguards where
        required.
      </p>

      <h2>Retention</h2>
      <p>
        Waitlist records are generally retained for up to 36 months after your last meaningful
        interaction unless a longer period is required by law.
      </p>

      <h2>Your Rights</h2>
      <p>
        Depending on your jurisdiction you may request access, correction, deletion, restriction,
        portability, object to certain processing or withdraw consent.
      </p>

      <h2>Data Deletion</h2>
      <p>
        You may request deletion of your personal information at any time by contacting
        <a href="mailto:info@monlove.com">info@monlove.com</a>.
      </p>

      <h2>Automated Decisions</h2>
      <p>
        We do not use your information to make decisions based solely on automated processing that
        produce legal or similarly significant effects.
      </p>

      <h2>Cookies &amp; Analytics</h2>
      <p>
        We use strictly necessary technologies to operate the Site. With your consent, we also use
        the Meta (Facebook) and TikTok pixels, provided by Meta Platforms and TikTok, which set cookies to measure site
        visits and sign-ups, assess the effectiveness of our advertising campaigns and enable ad
        retargeting. The pixel loads only after you accept it via the consent banner shown on the
        Site. Declining has no effect on your registration, and you may withdraw your consent at any
        time by clearing your browser cookies or by emailing
        <a href="mailto:info@monlove.com">info@monlove.com</a>.
      </p>

      <h2>Security</h2>
      <p>
        Reasonable technical and organizational safeguards are implemented, although no system is
        completely secure.
      </p>

      <h2>Children</h2>
      <p>The Site is not intended for children under 16.</p>

      <h2>Contact</h2>
      <p>Privacy questions: <a href="mailto:info@monlove.com">info@monlove.com</a>.</p>

      <h2>Related Documents</h2>
      <p>
        This Privacy Notice should be read together with our
        <NuxtLink to="/conditions">Terms of Use</NuxtLink> and
        <NuxtLink to="/mentions-legales">Legal Notice</NuxtLink>, which together govern your use of
        MiraculousLadybugLive.com.
      </p>
    </template>
  </LegalPage>
</template>
