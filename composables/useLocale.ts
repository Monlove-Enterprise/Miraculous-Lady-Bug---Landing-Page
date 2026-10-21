// Lightweight FR/EN toggle for the landing page. French is the launch default;
// English exists so clients can review/approve in English.
export type Locale = 'fr' | 'en'

type Dict = Record<string, string>

const messages: Record<Locale, Dict> = {
  fr: {
    'nav.ariaLabel': 'Navigation du site',
    'nav.wordmark': 'Miraculous Live',
    'nav.home': 'Accueil',
    'nav.cast': 'Casting & Équipe créative',
    'nav.cities': 'Villes',
    'nav.tickets': 'Billets',
    'nav.allCities': 'Tournée mondiale',
    'nav.vip': 'VIP',
    'nav.theShow': 'Le spectacle',
    'nav.story': 'L’histoire',
    'nav.sightsSounds': 'Dans les coulisses',
    'sightsSounds.intro': 'Rencontre l’équipe créative et découvre les coulisses du spectacle.',
    'nav.news': 'Presse',
    'nav.faq': 'FAQ',
    'stub.comingSoon': 'Contenu à venir — page en construction.',
    'news.title': 'Presse',
    'news.metaDescription': 'Les dernières nouvelles et articles sur Miraculous Ladybug & Chat Noir : The Live Stage Spectacular.',
    'news.intro': 'Retrouve les dernières mentions et articles sur le spectacle.',
    'news.empty': 'Aucun article pour l’instant — reviens bientôt.',
    'news.readMore': 'Lire l’article',

    'map.heading': 'Nos prochaines destinations',
    'map.lead': 'En tournée en Amérique du Nord, et bientôt dans de nombreuses autres villes à travers le monde.',
    'map.legendTour': 'Ville de tournée',
    'map.legendResidency': 'Résidence permanente',
    'map.zoomIn': 'Zoomer',
    'map.zoomOut': 'Dézoomer',
    'map.zoomReset': 'Réinitialiser',
    'calendar.prevMonth': 'Mois précédent',
    'calendar.nextMonth': 'Mois suivant',
    'trailer.heading': 'Bande-annonce',
    'trailer.comingSoon': 'Bande-annonce à venir.',
    'social.heading': 'Abonne-toi',
    'social.lead': 'Retrouve les coulisses, les annonces et les nouveautés sur nos réseaux.',
    'hero.tagline': 'Tes héros préférés prennent enfin vie sur scène.',
    'hero.musicalBy': 'Une comédie musicale par',
    'hero.cta': "Je m'inscris",
    'hero.logoAlt': 'Miraculous : Ladybug & Chat Noir — Le Spectacle Live',
    'hero.scrollAria': "Aller à l'inscription",
    'hero.onSaleBanner': 'Billets en vente le 23 octobre',

    'signup.introTitleA': 'Aide-nous à amener',
    'signup.introTitleB': 'Miraculous Ladybug & Chat Noir',
    'signup.introTitleC': 'dans ta ville',
    'signup.introText':
      'Envie de voir Miraculous Ladybug & Chat Noir: The Live Stage Spectacular dans ta ville? Abonne-toi pour manifester ton intérêt et être parmi les premiers informés de la mise en vente des billets et des annonces spéciales.',
    'signup.microcopy':
      'Chaque inscription nous aide à amener le spectacle dans davantage de villes à travers le monde.',

    'cast.title': 'Casting & Équipe créative',
    'cast.metaDescription':
      'Découvre les artistes et l’équipe créative de Miraculous Ladybug & Chat Noir : The Live Stage Spectacular.',
    'cast.back': "Retour à l’accueil",
    'cast.intro': 'Découvre les artistes et artisans qui donnent vie au spectacle sur scène.',
    'cast.creativeHeading': 'Équipe créative',
    'cast.castHeading': 'Casting',
    'cast.castNote': 'Casting à venir.',
    'cast.tba': 'Casting à venir',
    'cast.tbaBio': 'Interprète bientôt annoncé·e.',
    'cast.backToCast': 'Retour à Casting & Équipe créative',
    'cast.bioComingSoon': 'Biographie à venir.',

    'vip.title': 'Forfaits VIP',
    'vip.metaDescription': 'Forfaits VIP pour Miraculous Ladybug & Chat Noir : The Live Stage Spectacular.',
    'vip.intro': 'Vis le spectacle autrement avec un accès VIP exclusif.',
    // Math, 2026-10-20: "notes que j'ai reçues" — brand-provided VIP copy,
    // replacing the earlier draft. FR is my translation (not brand-confirmed),
    // kept consistent with tier1.name/tier2.name's "VIP Ultime"/"VIP Premium"
    // naming already used on this page.
    'vip.allPreShow': 'Toutes les activités ont lieu avant le spectacle.',
    'vip.tier1.name': 'Forfait VIP Ultime — Pré-fête',
    'vip.tier1.cta': 'Acheter VIP Ultime',
    'vip.tier1.perks': [
      'Un billet réservé VIP Ultime dans la section VIP',
      'Hôte VIP sur place',
      'Accès exclusif à la pré-fête VIP',
      'Rencontre et séance photo avec Ladybug et/ou Chat Noir',
      'Collations et boissons',
      'Article de produits dérivés exclusif aux forfaits VIP Ultime',
      'Sac fourre-tout VIP officiel',
      'Laminé VIP édition limitée',
      'Magasinage de produits dérivés sans file d’attente',
    ].join('|'),
    'vip.tier2.name': 'Forfait VIP Premium',
    'vip.tier2.cta': 'Acheter VIP Premium',
    'vip.tier2.perks': [
      'Un billet réservé VIP Premium dans la section VIP',
      'Hôte VIP sur place',
      'Article de produits dérivés exclusif aux forfaits VIP Premium',
      'Laminé VIP édition limitée',
      'Magasinage de produits dérivés sans file d’attente',
    ].join('|'),

    // 'faq.questions'/'faq.answers' removed 2026-10-18 — FAQ content moved
    // to utils/faqData.ts (faqFr/faqEn) so it can be grouped into the real
    // document's categories (see pages/faq.vue).
    'faq.title': 'Foire aux questions',

    // Real, brand-validated copy from Math (2026-10-20, replaces the earlier
    // machine-translated FR draft — see git history if that wording is ever
    // needed again). Pasted verbatim as provided, including its "vous" voice,
    // which doesn't match the "tu" voice used elsewhere on the site (signup
    // form, waitlist copy) — flagged to Math, not resolved unilaterally.
    // Also note: this version translates the show's title ("Les Aventures de
    // Ladybug et Chat Noir") where the 2026-10-18 decision had kept it in
    // English — followed the new brand text as given since it supersedes
    // that earlier placeholder call.
    'story.intro':
      'L’univers de Miraculous prend une nouvelle dimension : Miraculous : Les Aventures de Ladybug et Chat Noir prend vie sur scène !\n\n' +
      'Miraculous Corp et MONLOVE unissent leurs forces pour présenter, dès 2027, un spectacle époustouflant, rempli d’action et de rebondissements, qui fera découvrir nos super-héros parisiens préférés aux spectateurs du monde entier.',
    'story.theStoryHeading': 'Synopsis',
    'story.theStoryText':
      'Au cœur de Paris, deux adolescents ordinaires mènent une double vie extraordinaire. Marinette rêve de devenir créatrice de mode, tandis qu’Adrien aspire à s’affranchir des attentes de son célèbre père. Mais lorsque le danger menace, ils se transforment en Ladybug et Chat Noir, les super-héros adorés de Paris.\n\n' +
      'Partenaires dans leurs combats, mais ignorant leurs véritables identités respectives, ils se retrouvent au cœur d’une histoire d’amour compliquée.\n\n' +
      'Alors que Paris se prépare à vivre une Fashion Week spectaculaire, un mystérieux super-vilain menace de transformer les rêves en cauchemars.\n\n' +
      'Le destin de Paris étant en jeu, Ladybug et Chat Noir devront découvrir que leur plus grand pouvoir réside dans leur capacité à unir leurs forces.',
    'story.mastermindsHeading': 'Rencontrez les créateurs',
    'story.mastermindsText':
      'Le spectacle est porté par le génie créatif d’Ella Louise Allaire et Martin Lord Ferguson, le duo primé à l’origine de Ice Age Live! A Mammoth Adventure, Scooby-Doo! and The Lost City of Gold et All Systems Are Go! A NASA Peanuts Adventure.\n\n' +
      'Animés par leur passion pour les histoires captivantes et les technologies scéniques de pointe, ils promettent une production comme les fans de Miraculous n’en ont encore jamais vue.',
    'story.spectacleHeading': 'Un spectacle Miraculous grandiose !',
    'story.spectacleText':
      'Imaginez des acrobaties à couper le souffle, des chorégraphies aériennes éblouissantes, des illusions spectaculaires, des danses électrisantes et des marionnettes ingénieuses, le tout réuni dans une toute nouvelle comédie musicale originale mettant en vedette Ladybug et Chat Noir.\n\n' +
      'Avec des chansons inédites et des interactions spectaculaires entre la scène et les projections vidéo, cette expérience Miraculous promet d’émerveiller les spectateurs de tous âges.',
    'story.nextHeading': 'Et maintenant ?',
    'story.nextText':
      'Restez à l’affût des dernières nouvelles sur Miraculousladybuglive.com pour découvrir les villes et les salles qui accueilleront le spectacle.\n\n' +
      'Ne manquez pas votre chance de voir Ladybug et Chat Noir passer de l’écran à la scène ! De nouvelles informations seront dévoilées chaque semaine.',
    'story.ctaKicker': 'Soyez Miraculous !',
    'story.closing':
      'Êtes-vous prêts à vivre Miraculous en direct ?\n\n' +
      'Partagez votre enthousiasme et revenez régulièrement pour découvrir des nouvelles exclusives sur le spectacle Miraculous Ladybug !',

    'villes.title': 'Le spectacle près de chez toi',
    'villes.metaDescription':
      'Toutes les villes où Miraculous Ladybug & Chat Noir: The Live Stage Spectacular pourrait se produire.',
    'villes.back': "Retour à l’accueil",
    'villes.status.envisagee': 'À l’étude',
    'villes.status.confirmee': 'Confirmée',
    'villes.status.en_vente': 'En vente',
    'villes.status.epuisee': 'Complet',
    'villes.openingTbd': 'Ouverture des ventes à venir',
    'villes.openingOn': 'Billets en vente le {date}',
    'villes.residencyBadge': 'Résidence permanente',
    'villes.calendarHeading': 'Calendrier des représentations',
    'villes.calendarEmpty': 'Calendrier à venir — dates pas encore annoncées.',
    'villes.calendarSeeFull': 'Voir le calendrier complet',
    'villes.perfSoldOut': 'Complet',
    'villes.cta.buy': 'Acheter mes billets',
    'villes.cta.interest': 'Manifester mon intérêt',
    'villes.cta.soldout': 'Complet',
    'villes.cta.pending': 'Bientôt plus d’infos',
    'villes.backToList': 'Toutes les villes',
    'villes.countdownAria': 'Compte à rebours avant la mise en vente',
    'villes.countdown.days': 'jours',
    'villes.countdown.hours': 'h',
    'villes.countdown.minutes': 'min',
    'villes.countdown.seconds': 'sec',
    'villes.detail.envisageeText':
      'Cette ville est à l’étude. Manifeste ton intérêt pour nous aider à confirmer une date près de chez toi.',
    'villes.detail.confirmeeText': 'Billets en vente dans :',
    'villes.detail.enVenteText': 'Les billets sont en vente dès maintenant.',
    'villes.detail.epuiseeText':
      'Cette date est complète. Inscris-toi pour être informé·e d’une éventuelle date supplémentaire.',

    'form.title': 'Abonne-toi pour rester informé·e',
    'form.lead':
      'Sois parmi les premiers informés des dates de tournée, de la mise en vente des billets et des annonces spéciales lorsque le spectacle arrivera près de chez toi.',
    'form.firstName': 'Prénom',
    'form.firstNamePlaceholder': 'Ton prénom',
    'form.email': 'E-mail',
    'form.emailPlaceholder': 'toi@exemple.com',
    'form.city': 'Ville',
    'form.cityPlaceholder': 'Ta ville',
    'form.phone': 'Téléphone',
    'form.phonePlaceholder': '6 12 34 56 78',
    'form.dialCode': 'Indicatif',
    'form.optional': '(optionnel)',
    'form.emailConsent':
      "J'accepte de recevoir par e-mail les actualités, mises à jour, offres et contenus exclusifs liés à Miraculous Ladybug & Cat Noir : The Live Stage Spectacular.",
    'form.emailConsentNotice':
      'En vous inscrivant, vous acceptez de recevoir par e-mail les actualités et mises à jour concernant le spectacle, ainsi que toute autre communication sélectionnée. Vous pouvez vous désinscrire à tout moment. Pour en savoir plus, consultez notre politique de confidentialité.',
    'form.smsConsent':
      "En cochant cette case, je consens à recevoir des SMS de Gestion Belle & Bright Inc., exploitant de Miraculous Ladybug Live, au sujet des dates de tournée, de la mise en vente des billets et des annonces spéciales. La fréquence des messages peut varier. Des frais standards de messagerie et de données peuvent s'appliquer. Répondez STOP pour vous désabonner. Répondez HELP pour de l'aide. Vos coordonnées mobiles ne seront ni vendues ni partagées à des tiers à des fins promotionnelles.",
    'form.age': "Je confirme avoir 16 ans ou plus.",
    'form.smsNote': '',
    'form.submit': 'S’abonner',
    'form.submitting': 'Un instant…',
    'form.legalPre':
      'En t’inscrivant, tu acceptes que tes données soient utilisées pour t’envoyer les communications choisies. Tu peux te désinscrire à tout moment. Pour en savoir plus, consulte notre',
    'form.legalLink': 'politique de confidentialité',
    'form.errEmail': 'Merci de saisir une adresse e-mail valide.',
    'form.errCity': 'Merci d’indiquer ta ville.',
    'form.errPhone': 'Merci d’indiquer un numéro de téléphone valide.',
    'form.errPhoneSms': 'Un numéro de téléphone est requis pour recevoir les SMS.',
    'form.errAge': 'Tu dois confirmer avoir 16 ans ou plus.',
    'form.errGeneric': "L'inscription a échoué. Réessaie.",
    'form.doneTitle': 'Bienvenue parmi nos abonné·e·s !',
    'form.doneText':
      'Tu y es ! Garde un œil sur ta boîte mail pour les annonces de billets, les mises à jour spéciales et les nouveautés, à mesure que Miraculous Live se prépare à venir dans ta ville.',

    'footer.legal': 'Mentions légales',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': 'Conditions d’utilisation',
    'footer.cookies': 'Cookies',
    'footer.copyright': '© 2026 MIRACULOUS CORP. & MONLOVE INTERNATIONAL. Tous droits réservés.',
    'footer.trademark': 'Miraculous® est une marque déposée de MIRACULOUS CORP.',
    'footer.ticketsHeading': 'Billets',
    'footer.aboutHeading': 'À propos',
    'footer.languageHeading': 'Langue',
    'footer.french': 'Français',
    'footer.english': 'Anglais',
    'footer.socialAria': 'Réseaux sociaux',

    'subscribe.heading': 'Profite du contenu exclusif',
    'subscribe.text': 'Abonne-toi et sois parmi les premiers informés des annonces de billets, des nouveautés et du contenu exclusif du spectacle.',
    'subscribe.cta': 'S’abonner',

    'upcoming.heading': 'Prochaines dates',
    'upcoming.seeAll': 'Voir toutes les villes',
    'upcoming.empty': 'Aucune date annoncée pour l’instant.',

    'cookie.text':
      'On utilise des cookies de mesure d’audience (Meta et TikTok) pour comprendre d’où viennent nos visiteurs. Tu peux accepter ou refuser.',
    'cookie.accept': 'Accepter',
    'cookie.decline': 'Refuser',
    'cookie.link': 'En savoir plus',
    'cookie.aria': 'Bandeau de consentement aux cookies',
    'cookie.gpcNotice':
      'Signal « Global Privacy Control » détecté — nous respectons ton choix : aucun cookie publicitaire n’est chargé.',
    'cookie.close': 'Fermer',
  },
  en: {
    'nav.ariaLabel': 'Site navigation',
    'nav.wordmark': 'Miraculous Live',
    'nav.home': 'Home',
    'nav.cast': 'Cast & Creatives',
    'nav.cities': 'Cities',
    'nav.tickets': 'Tickets',
    'nav.allCities': 'World Tour',
    'nav.vip': 'VIP',
    'nav.theShow': 'The Show',
    'nav.story': 'The Story',
    'nav.sightsSounds': 'Behind the Scenes',
    'sightsSounds.intro': 'Meet the creative team and go behind the scenes of the show.',
    'nav.news': 'Press',
    'nav.faq': 'FAQ',
    'stub.comingSoon': 'Content coming soon — page under construction.',
    'news.title': 'Press',
    'news.metaDescription': 'The latest news and articles about Miraculous Ladybug & Cat Noir: The Live Stage Spectacular.',
    'news.intro': 'The latest mentions and articles about the show.',
    'news.empty': 'No articles yet — check back soon.',
    'news.readMore': 'Read the article',

    'map.heading': 'Where We’re Headed',
    'map.lead': 'Touring across North America, and soon many more cities around the world.',
    'map.legendTour': 'Tour stop',
    'map.legendResidency': 'Permanent residency',
    'map.zoomIn': 'Zoom in',
    'map.zoomOut': 'Zoom out',
    'map.zoomReset': 'Reset',
    'calendar.prevMonth': 'Previous month',
    'calendar.nextMonth': 'Next month',
    'trailer.heading': 'Trailer',
    'trailer.comingSoon': 'Trailer coming soon.',
    'social.heading': 'Follow Us',
    'social.lead': 'Behind the scenes, announcements and updates on our socials.',
    'hero.tagline': 'Your favourite heroes finally come to life on stage.',
    'hero.musicalBy': 'A musical by',
    'hero.cta': 'Count me in',
    'hero.logoAlt': 'Miraculous: Ladybug & Cat Noir — The Live Stage Spectacular',
    'hero.scrollAria': 'Go to sign-up',
    'hero.onSaleBanner': 'Tickets on sale October 23rd',

    'signup.introTitleA': 'Help bring Miraculous',
    'signup.introTitleB': 'Ladybug & Cat Noir',
    'signup.introTitleC': 'to your city',
    'signup.introText':
      'Want to see Miraculous Ladybug & Cat Noir: The Live Stage Spectacular in your city? Subscribe to show your interest and be among the first to hear about ticket sales and special announcements.',
    'signup.microcopy':
      'Every registration helps us bring the show to more cities around the world.',

    'cast.title': 'Cast & Creative',
    'cast.metaDescription':
      'Meet the artists and creative team behind Miraculous Ladybug & Cat Noir: The Live Stage Spectacular.',
    'cast.back': 'Back to home',
    'cast.intro': 'Meet the artists and artisans who bring the show to life on stage.',
    'cast.creativeHeading': 'Creative Team',
    'cast.castHeading': 'Cast',
    'cast.castNote': 'Cast to be announced soon.',
    'cast.tba': 'Casting to be announced',
    'cast.tbaBio': 'Performer to be announced soon.',
    'cast.backToCast': 'Back to Cast & Creative',
    'cast.bioComingSoon': 'Bio coming soon.',

    'vip.title': 'VIP Packages',
    'vip.metaDescription': 'VIP packages for Miraculous Ladybug & Cat Noir: The Live Stage Spectacular.',
    'vip.intro': 'Experience the show differently with exclusive VIP access.',
    // Math, 2026-10-20: "notes que j'ai reçues" — brand-provided VIP copy,
    // verbatim, replacing the earlier draft (fixed: meet & greet is with
    // Ladybug AND/OR Cat Noir, and the Ultimate item is a tote bag, not a
    // badge).
    'vip.allPreShow': 'All activities occur before the show.',
    'vip.tier1.name': 'Ultimate VIP Pre-Party Pass',
    'vip.tier1.cta': 'Buy Ultimate VIP',
    'vip.tier1.perks': [
      'One Ultimate VIP reserved ticket in the VIP section',
      'On-site VIP host',
      'Exclusive access to the VIP pre-show party',
      'Meet-and-greet and photo opportunity with Ladybug &/or Cat Noir',
      'Snacks and beverages',
      'Merchandise item exclusive to Ultimate VIP packages',
      'Official VIP tote bag',
      'Limited-edition VIP laminate',
      'Crowd-free merchandise shopping',
    ].join('|'),
    'vip.tier2.name': 'Premium VIP Package',
    'vip.tier2.cta': 'Buy Premium VIP',
    'vip.tier2.perks': [
      'One Premium VIP reserved ticket in the VIP section',
      'On-site VIP host',
      'Merchandise item exclusive to Premium VIP packages',
      'Limited-edition VIP laminate',
      'Crowd-free merchandise shopping',
    ].join('|'),

    // Real brand copy from Math (2026-10-14), verbatim — YouTube handle added
    // per Math's follow-up message the same day.
    // 'faq.questions'/'faq.answers' removed 2026-10-18 — FAQ content moved
    // to utils/faqData.ts (faqFr/faqEn) so it can be grouped into the real
    // document's categories (see pages/faq.vue).
    'faq.title': 'FAQ',

    // Real brand copy from Math (2026-09-15), verbatim.
    'story.intro':
      'The Miraculous universe is expanding, Miraculous: Tales of Ladybug & Cat Noir is going LIVE! Miraculous Corp and Monlove are teaming up to launch a jaw-dropping, action-packed stage show in 2027, bringing our favorite Parisian superheroes to audiences around the globe.',
    // Math, 2026-10-20: "notes que j'ai reçues" — brand copy, verbatim. New
    // synopsis section, not previously on the page.
    'story.theStoryHeading': 'Synopsis',
    'story.theStoryText':
      'In the heart of Paris, two ordinary teenagers lead extraordinary secret lives. Marinette dreams of becoming a fashion designer, while Adrien longs to escape the expectations of his famous father. But when danger strikes, they transform into Ladybug and Cat Noir, the city’s beloved superheroes.\n\n' +
      'Partners in battle, unaware of each other’s true identity, they find themselves caught in a complicated love story.\n\n' +
      'As Paris prepares for a spectacular Fashion Week, a mysterious villain threatens to turn dreams into nightmares.\n\n' +
      'With the fate of Paris at stake, Ladybug and Cat Noir must discover that their greatest power comes from being stronger together.',
    'story.mastermindsHeading': 'Meet the Masterminds',
    // Brand copy, verbatim (Math, 2026-10-20: "utilise ce que je viens de
    // coller" — confirmed "A NASA Peanuts Adventure" as the official
    // subtitle; also updated in Serge Poupart's bio, utils/castData.ts).
    'story.mastermindsText':
      'The show is driven by the creative genius of Ella Louise Allaire and Martin Lord Ferguson, the award-winning duo behind Ice Age Live! A Mammoth Adventure, Scooby-Doo! and The Lost City of Gold, and All Systems Are Go! A NASA Peanuts Adventure. With their passion for storytelling and cutting-edge stagecraft, this production promises to be unlike anything fans have ever seen.',
    'story.spectacleHeading': 'A True Miraculous Spectacular',
    'story.spectacleText':
      'Imagine breathtaking acrobatics, dazzling aerial choreography, jaw-dropping illusions, energetic dance, and inventive puppetry, all woven into an all-new, original musical starring Ladybug and Cat Noir. With original songs and spectacular stage-to-video interaction, this is a Miraculous experience for all ages.',
    'story.nextHeading': 'What’s Next?',
    'story.nextText':
      'Stay tuned right here on Miraculousladybuglive.com for the latest updates on cities and venues. Don’t miss your chance to see Ladybug and Cat Noir leap from screen to stage! New details will be added weekly.',
    'story.ctaKicker': 'Be Miraculous',
    'story.closing':
      'Are you ready to be Miraculous LIVE? Share your excitement and keep watching this space for more exclusive news on the Miraculous Ladybug live stage show!',

    'villes.title': 'Where the show is going',
    'villes.metaDescription':
      'Every city where Miraculous Ladybug & Cat Noir: The Live Stage Spectacular might play.',
    'villes.back': 'Back to home',
    'villes.status.envisagee': 'Being Considered',
    'villes.status.confirmee': 'Confirmed',
    'villes.status.en_vente': 'On Sale',
    'villes.status.epuisee': 'Sold Out',
    'villes.openingTbd': 'On sale date to be announced',
    'villes.openingOn': 'Tickets on sale {date}',
    'villes.residencyBadge': 'Permanent Residency',
    'villes.calendarHeading': 'Performance calendar',
    'villes.calendarEmpty': 'Calendar coming soon — dates not announced yet.',
    'villes.calendarSeeFull': 'See the full calendar',
    'villes.perfSoldOut': 'Sold Out',
    'villes.cta.buy': 'Get Tickets',
    'villes.cta.interest': 'I’m Interested',
    'villes.cta.soldout': 'Sold Out',
    'villes.cta.pending': 'More info soon',
    'villes.backToList': 'All cities',
    'villes.countdownAria': 'Countdown to ticket sale opening',
    'villes.countdown.days': 'days',
    'villes.countdown.hours': 'hrs',
    'villes.countdown.minutes': 'min',
    'villes.countdown.seconds': 'sec',
    'villes.detail.envisageeText':
      'This city is being considered. Let us know you’re interested to help us confirm a date near you.',
    'villes.detail.confirmeeText': 'Tickets go on sale in:',
    'villes.detail.enVenteText': 'Tickets are on sale now.',
    'villes.detail.epuiseeText':
      'This date is sold out. Sign up to be notified if another date is added.',

    'form.title': 'Subscribe to stay in the loop',
    'form.lead':
      'Be among the first to hear about tour dates, ticket sales and special announcements when Miraculous Live comes to your area.',
    'form.firstName': 'First name',
    'form.firstNamePlaceholder': 'Your first name',
    'form.email': 'Email',
    'form.emailPlaceholder': 'you@example.com',
    'form.city': 'City',
    'form.cityPlaceholder': 'Your city',
    'form.phone': 'Phone',
    'form.phonePlaceholder': '6 12 34 56 78',
    'form.dialCode': 'Dialing code',
    'form.optional': '(optional)',
    'form.emailConsent':
      'I agree to receive news, updates, offers and exclusive content related to Miraculous Ladybug & Cat Noir: The Live Stage Spectacular by email.',
    'form.emailConsentNotice':
      'By signing up, you agree to receive news and updates about the show by email, plus any other communications you selected. You can unsubscribe at any time. To learn more, see our privacy policy.',
    'form.smsConsent':
      'By checking this box, I consent to receive text messages from Gestion Belle & Bright Inc., operator of Miraculous Ladybug Live, about tour dates, ticket sales, and special announcements. Message frequency may vary. Standard message and data rates may apply. Reply STOP to opt out. Reply HELP for help. Your mobile information will not be sold or shared with third parties for promotional purposes.',
    'form.age': 'I confirm I am 16 or older.',
    'form.smsNote': '',
    'form.submit': 'Subscribe',
    'form.submitting': 'One moment…',
    'form.legalPre':
      'By signing up, you agree that your data will be used to send you the communications you selected. You can unsubscribe at any time. To learn more, see our',
    'form.legalLink': 'privacy policy',
    'form.errEmail': 'Please enter a valid email address.',
    'form.errCity': 'Please enter your city.',
    'form.errPhone': 'Please enter a valid phone number.',
    'form.errPhoneSms': 'A phone number is required to receive SMS.',
    'form.errAge': 'You must confirm you are 16 or older.',
    'form.errGeneric': 'Sign-up failed. Please try again.',
    'form.doneTitle': 'You’re subscribed!',
    'form.doneText':
      'You’re in! Keep an eye on your inbox for ticket announcements, special updates and exciting news as Miraculous Live gets ready to come to your city.',

    'footer.legal': 'Legal notice',
    'footer.privacy': 'Privacy policy',
    'footer.terms': 'Terms of Use',
    'footer.cookies': 'Cookies',
    'footer.copyright': '© 2026 MIRACULOUS CORP. & MONLOVE INTERNATIONAL. All rights reserved.',
    'footer.trademark': 'Miraculous® is a registered trademark of MIRACULOUS CORP.',
    'footer.ticketsHeading': 'Tickets',
    'footer.aboutHeading': 'About',
    'footer.languageHeading': 'Language',
    'footer.french': 'French',
    'footer.english': 'English',
    'footer.socialAria': 'Social media',

    'subscribe.heading': 'Get Exclusive Content',
    'subscribe.text': 'Subscribe and be among the first to hear about ticket announcements, show updates, and exclusive content.',
    'subscribe.cta': 'Subscribe',

    'upcoming.heading': 'Upcoming Dates',
    'upcoming.seeAll': 'See all cities',
    'upcoming.empty': 'No dates announced yet.',

    'cookie.text':
      'We use audience-measurement cookies (Meta and TikTok) to understand where our visitors come from. You can accept or decline.',
    'cookie.accept': 'Accept',
    'cookie.decline': 'Decline',
    'cookie.link': 'Learn more',
    'cookie.aria': 'Cookie consent banner',
    'cookie.gpcNotice':
      'Global Privacy Control signal detected — we respect your choice: no advertising cookies are loaded.',
    'cookie.close': 'Close',
  },
}

export function useLocale() {
  // English is the default for now (client review / approval). Toggle to FR.
  const locale = useState<Locale>('locale', () => 'en')

  const t = (key: string): string => messages[locale.value][key] ?? key

  const toggle = () => {
    locale.value = locale.value === 'fr' ? 'en' : 'fr'
  }

  // Math, 2026-10-21: "it should be slash cities no ?" — the villes/[ville]
  // route tree keeps its French path for FR visitors, but English visitors
  // get the English-named /cities URL instead (both aliases render the same
  // page — see the `alias` in pages/villes/index.vue and [ville].vue).
  const citiesPath = (): string => (locale.value === 'en' ? '/cities' : '/villes')
  const cityPath = (slug: string): string => `${citiesPath()}/${slug}`

  return { locale, t, toggle, citiesPath, cityPath }
}
