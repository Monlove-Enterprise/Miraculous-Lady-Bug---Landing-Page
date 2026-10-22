# Miraculous Live Show — Contexte projet

Site de capture de fans (Nuxt 3 / Vercel) pour un spectacle musical sous licence Miraculous (ZAG).
Audience de la marque = enfants ; base de données = **parents acheteurs de billets uniquement**.
Opérateur solo (Mat) avec Claude Code. Campagne en cours : « Bring the show to your city »
(trafic depuis les comptes Instagram/Facebook de Miraculous). Pas encore de dates de tournée officielles.

## Maintenance de ce fichier

**Mets à jour ce fichier toi-même** quand une décision listée ici change au cours d'une session
(changement de CRM, nouveau chantier terminé, statut modifié) : édite la section concernée,
de façon concise, et signale la modification dans ton résumé de fin de session.

## Règles non négociables

- **Postgres d'abord, CRM ensuite.** Toute inscription s'écrit dans Supabase AVANT le push CRM.
  Jamais d'échec silencieux : si le push CRM échoue, la ligne reste avec `synced_to_crm = false`.
- **Conformité sur chaque formulaire** : case 16+ obligatoire, consentements email et SMS
  séparés, non pré-cochés, horodatés, avec le texte exact accepté archivé (`consent_text_version`).
  RGPD / COPPA / CASL. Aucune page de capture sans ces éléments.
- **Audit avant modification, delta uniquement.** Toujours vérifier l'existant avant de créer.
- **Jamais d'ajout/retrait de ville de tournée (table `cities`) sans approbation explicite de Mat
  au préalable**, même si ça ressemble à un bug à corriger. Incident du 2026-10-21 : Austin,
  New Orleans et San Antonio dormaient dans `scripts/seed-cities.mjs` sans jamais avoir été
  commitées en base — un audit SEO a conclu (à tort) que c'était un oubli et les a seedées en
  prod, alors que ce n'étaient pas de vraies dates. Retiré le 2026-10-22 sur instruction de Mat.
  Toute divergence entre le script de seed et la base = à signaler et faire confirmer, jamais à
  "corriger" unilatéralement.
- **Ne jamais supprimer `brevo.ts`** (repli + levier de négociation), même si Klaviyo est le CRM actif.
- Le CSV est un format d'export, jamais le stockage maître.
- Les exports contiennent des données personnelles : jamais de dump commité, jamais de données
  réelles dans les fixtures.

## Stack & architecture

- **Frontend/hosting** : Nuxt 3 sur Vercel (Vercel = hébergeur, non remplaçable par du mutualisé)
- **Base de données** : Supabase Postgres, région UE — SOURCE DE VÉRITÉ (statut : à créer/brancher, voir chantier 1)
- **CRM** : **Brevo est le CRM actif** (depuis le 25/08/2026, import CSV initial + `server/utils/crm/brevo-sync.ts` en temps réel sur `server/api/subscribe.post.ts`). 4 listes par combo de consentement (#3-#6). `crm/klaviyo.ts` et `crm/brevo.ts` (générique) sont dormants/hors chemin actif — gardés en réserve/négociation, jamais supprimés.
  - ⚠️ Piège déjà rencontré une fois : les noms d'attributs envoyés par le code doivent correspondre EXACTEMENT à ceux existants dans le compte Brevo (`CITY`, `COUNTRY`, `SMS_CONSENT`, `SMS_CONSENT_AT`, `EMAIL_CONSENT_AT`, `CREATED_AT`, `LOCALE`, `SMS`) — Brevo ignore silencieusement un attribut inconnu, sans erreur. Toujours vérifier via `GET /v3/contacts/attributes` avant de changer un nom.
  - Téléphone normalisé via `libphonenumber-js` (`server/api/subscribe.post.ts`), plus de regex manuelle. Backfill/resync versionnés : `scripts/backfill-phone-e164.mjs`, `scripts/resync-phone-brevo.mjs`.
- **SMS US** : toll-free (PAS de 10DLC nécessaire ; vérification 3-6 semaines à lancer tôt) — à confirmer côté Brevo maintenant que Klaviyo n'est plus le chemin actif.
- **Formulaire** : une seule étape (`components/SignupForm.vue`) — prénom, email, ville (autocomplete), téléphone + indicatif pays (select lié au code ISO, pas juste l'indicatif), consentement SMS, 16+. Le "deux étapes" ci-dessous est obsolète, gardé barré pour mémoire : ~~email (étape 1), téléphone/SMS + ville/pays (étape 2)~~.
- Vidéo : YouTube/Vimeo embarqué (jamais d'hébergement local). Images : Supabase Storage ou
  Cloudinary si volume. CMS headless : seulement si un non-développeur doit éditer un jour.

## Décisions actées (juillet 2026)

- Laylo : écarté pour l'exécution (formulaire non conforme, coût en crédits, base captive).
  Chaque fonctionnalité se reconstruit ici. Évaluation Enterprise en cours via la directrice
  marketing (5 questions posées) — statut à mettre à jour selon leurs réponses.
- Supabase choisi vs Neon (Table Editor, briques Auth/Storage en réserve). Plan gratuit pour
  câbler, **Pro (25$/mois) obligatoire avant production** (pas de pause, backups quotidiens).
- Le compte à rebours des pages villes dépend de la date de la ville (table `cities`),
  jamais de l'IP du visiteur. La géoloc IP = suggestion en accueil, jamais de redirection forcée.
- Une fois inscrits, les contacts reçoivent les liens d'achat DIRECTS (billetterie) dans les
  messages Klaviyo — on ne les fait pas repasser par la landing.

## Chantiers (ordre de priorité)

1. **Fondation base** : auditer où vont les inscriptions actuelles (Brevo direct ? nulle part ?),
   brancher Supabase, table `subscribers` (email unique, phone, country, city_interest, locale,
   consent_email, consent_sms, consent_text_version, age_confirmed_16plus, utm_*, created_at
   timestamptz, synced_to_crm), endpoint Postgres-d'abord, test bout en bout, test `klaviyo.ts`
   réel puis `CRM_PROVIDER=klaviyo`.
2. **Champ ville + UTM** : capturer city_interest (étape 2) et les UTM — la campagne
   « bring the show to your city » en dépend. Requête « demande par ville » pour la production.
3. **Pages villes dynamiques** : table `cities` (nom, slug, pays, statut envisagée/confirmée/
   en_vente/épuisée, datetime ouverture stockée en UTC avec fuseau, ticket_url, promoteur),
   template unique `pages/villes/[ville].vue` à 4 états, composant countdown paramétré par la
   date (bascule auto à zéro vers en_vente), UTM apposés sur les liens sortants billetterie.
   **Statut (2026-09-15) : back-end réel branché sur la branche `site`** — tables Supabase
   `cities` (tournée/résidence) + `performances` (calendrier, pour le format résidence)
   créées via `migrations/003_cities.sql` (idempotent, aussi dans `server/utils/db.ts`
   ensureSchema()). Endpoints publics `server/api/cities.get.ts` + `cities/[slug].get.ts`
   (jamais les champs financiers — promoteur/garanties restent hors code). **12 dates de
   tournée 2027 confirmées insérées** (villes/salles/dates réelles fournies par Mat le
   2026-09-14, `scripts/seed-cities.mjs`, ré-exécutable) + le Lido (Paris, résidence
   permanente, calendrier pas encore rempli). `pages/villes/index.vue` + `[ville].vue`
   branchées sur l'API (le fichier placeholder est supprimé). Page détail affiche un
   calendrier de représentations pour les villes en format résidence.
   **Carte du monde** (`components/WorldMap.vue` + `utils/worldMapPath.ts`) : SVG maison,
   contour terrestre figé une fois depuis Natural Earth 110m (aucun service de carte tiers,
   aucune clé API), points cliquables par ville (rouge = tournée, crème = résidence).
   Nav complète (`components/SiteHeader.vue`, référence Wicked : barre sombre, menus
   déroulants Tickets/The Show + lien FAQ) + pages stub pour les sections sans contenu
   (story, sights-sounds, for-good, reviews, vip, faq). **Landing (`main`) toujours pas
   remplacée** — mais `pages/index.vue` sur `site` a maintenant la barre de nav noire, le
   bouton "Book Now", la carte du monde, un placeholder bande-annonce (TODO lien
   YouTube/Vimeo réel) et une section réseaux sociaux — décisions de Mat le 2026-09-14,
   toujours des ajouts, pas un remplacement.
4. **Hygiène** : user Postgres readonly pour les extractions, backup pg_dump hebdomadaire.

## Conventions

- Documents destinés au client : anglais clair, non technique.
- Wording des messages et formulaires : validé par la marque avant production (circuit de
  validation externe — ne pas inventer de wording final, utiliser des placeholders marqués TODO).
