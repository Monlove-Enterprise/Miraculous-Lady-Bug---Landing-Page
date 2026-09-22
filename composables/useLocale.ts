// Lightweight FR/EN toggle for the landing page. French is the launch default;
// English exists so clients can review/approve in English.
export type Locale = 'fr' | 'en'

type Dict = Record<string, string>

const messages: Record<Locale, Dict> = {
  fr: {
    'nav.ariaLabel': 'Navigation du site',
    'nav.wordmark': 'Miraculous Live',
    'nav.home': 'Accueil',
    'nav.cast': 'Distribution & Équipe créative',
    'nav.cities': 'Villes',
    'nav.tickets': 'Billets',
    'nav.allCities': 'Toutes les villes',
    'nav.vip': 'VIP',
    'nav.theShow': 'Le spectacle',
    'nav.story': 'L’histoire',
    'nav.sightsSounds': 'Dans les coulisses',
    'nav.news': 'Presse',
    'nav.faq': 'FAQ',
    'stub.comingSoon': 'Contenu à venir — page en construction.',
    'news.title': 'Presse',
    'news.metaDescription': 'Les dernières nouvelles et articles sur Miraculous Ladybug & Cat Noir : The Live Stage Spectacular.',
    'news.intro': 'Retrouve les dernières mentions et articles sur le spectacle.',
    'news.empty': 'Aucun article pour l’instant — reviens bientôt.',
    'news.readMore': 'Lire l’article',

    'map.heading': 'Nos prochaines destinations',
    'map.lead': 'Tournée en Amérique du Nord et résidence permanente au Lido, à Paris.',
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
    'hero.logoAlt': 'Miraculous : Ladybug & Cat Noir — Le Spectacle Live',
    'hero.scrollAria': "Aller à l'inscription",

    'signup.introTitleA': 'Aide-nous à amener',
    'signup.introTitleB': 'Miraculous Ladybug & Cat Noir',
    'signup.introTitleC': 'dans ta ville',
    'signup.introText':
      'Envie de voir Miraculous Ladybug & Cat Noir: The Live Stage Spectacular dans ta ville? Abonne-toi pour manifester ton intérêt et être parmi les premiers informés de la mise en vente des billets et des annonces spéciales.',
    'signup.microcopy':
      'Chaque inscription nous aide à amener le spectacle dans davantage de villes à travers le monde.',

    'cast.title': 'Distribution & Équipe créative',
    'cast.metaDescription':
      'Découvre les artistes et l’équipe créative de Miraculous Ladybug & Cat Noir : The Live Stage Spectacular.',
    'cast.back': "Retour à l’accueil",
    'cast.intro': 'Les artistes et l’équipe qui donnent vie au spectacle sur scène.',
    'cast.note': 'Contenu provisoire — casting et biographies en attente de validation par la marque.',
    'cast.creativeHeading': 'Équipe créative',
    'cast.castHeading': 'Distribution',
    'cast.tba': 'Casting à venir',
    'cast.tbaBio': 'Interprète bientôt annoncé·e.',
    'cast.backToCast': 'Retour à Distribution & Équipe créative',
    'cast.bioComingSoon': 'Biographie à venir.',

    // Real brand copy from Math (2026-09-15) — EN is verbatim as provided.
    // FR is a straight translation, kept in the site's "tu" voice; flag for a
    // brand check on the translation specifically before it's final.
    'story.intro':
      'L’univers Miraculous s’agrandit : Miraculous : Les Aventures de Ladybug et Chat Noir prend vie sur scène ! Miraculous Corp et Monlove s’associent pour lancer en 2027 un spectacle scénique spectaculaire et rempli d’action, qui amène nos super-héros parisiens préférés devant des publics du monde entier.',
    'story.mastermindsHeading': 'Les cerveaux créatifs derrière le spectacle',
    'story.mastermindsText':
      'Le spectacle est porté par le génie créatif d’Ella Louise Allaire et Martin Lord Ferguson, le duo primé derrière « Ice Age Live! », « Scooby-Doo! and The Lost City of Gold » et « All Systems Are Go! ». Grâce à leur passion pour la narration et une mise en scène à la pointe de l’innovation, cette production promet d’être unique en son genre.',
    'story.spectacleHeading': 'Un vrai spectacle Miraculous',
    'story.spectacleText':
      'Imagine de l’acrobatie, des chorégraphies aériennes éblouissantes, des illusions à couper le souffle, de la danse énergique et même des marionnettes, le tout tissé dans une toute nouvelle aventure originale où Ladybug et Chat Noir affrontent une nouvelle menace palpitante ! Avec des interactions scène-vidéo et des chansons exclusives, ce sera une expérience Miraculous pour les générations.',
    'story.nextHeading': 'Et ensuite ?',
    'story.nextText':
      'Les détails sur les villes, les salles et la mise en vente des billets seront dévoilés cette année. Reste à l’affût juste ici sur Miraculousladybug.com pour les dernières nouvelles — ne manque pas ta chance de voir Ladybug et Chat Noir passer de l’écran à la scène ! Les détails seront mis à jour chaque semaine.',
    'story.closing':
      'Prêt·e à vivre Miraculous LIVE ? Partage ton enthousiasme et reste à l’affût pour d’autres nouvelles exclusives sur le spectacle sur scène de Miraculous Ladybug !',

    'villes.title': 'Le spectacle près de chez toi',
    'villes.metaDescription':
      'Toutes les villes où Miraculous Ladybug & Cat Noir: The Live Stage Spectacular pourrait se produire.',
    'villes.back': "Retour à l’accueil",
    'villes.intro': 'Retrouve toutes les villes envisagées, confirmées ou déjà en vente.',
    'villes.note':
      'Exemple de mise en page — aucune date de tournée n’est confirmée à ce jour.',
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
    'form.smsConsent':
      "J'accepte de recevoir par SMS les actualités, mises à jour et offres liées à Miraculous Ladybug & Cat Noir : The Live Stage Spectacular. En fournissant ton numéro, tu acceptes de recevoir des SMS concernant le spectacle. Des frais de message et de données peuvent s'appliquer. Réponds STOP pour te désinscrire.",
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
    'form.errAge': 'Tu dois confirmer avoir 16 ans ou plus.',
    'form.errGeneric': "L'inscription a échoué. Réessaie.",
    'form.doneTitle': 'Bienvenue parmi nos abonné·e·s !',
    'form.doneText':
      'Tu y es ! Garde un œil sur ta boîte mail pour les annonces de billets, les mises à jour spéciales et les nouveautés, à mesure que Miraculous Live se prépare à venir dans ta ville.',

    'footer.legal': 'Mentions légales',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': 'Conditions d’utilisation',
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
  },
  en: {
    'nav.ariaLabel': 'Site navigation',
    'nav.wordmark': 'Miraculous Live',
    'nav.home': 'Home',
    'nav.cast': 'Cast & Creatives',
    'nav.cities': 'Cities',
    'nav.tickets': 'Tickets',
    'nav.allCities': 'All Cities',
    'nav.vip': 'VIP',
    'nav.theShow': 'The Show',
    'nav.story': 'The Story',
    'nav.sightsSounds': 'Behind the Scenes',
    'nav.news': 'Press',
    'nav.faq': 'FAQ',
    'stub.comingSoon': 'Content coming soon — page under construction.',
    'news.title': 'Press',
    'news.metaDescription': 'The latest news and articles about Miraculous Ladybug & Cat Noir: The Live Stage Spectacular.',
    'news.intro': 'The latest mentions and articles about the show.',
    'news.empty': 'No articles yet — check back soon.',
    'news.readMore': 'Read the article',

    'map.heading': 'Where We’re Headed',
    'map.lead': 'Touring across North America, plus a permanent residency at the Lido in Paris.',
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
    'hero.logoAlt': 'Miraculous: Ladybug & Cat Noir — The Live Stage Spectacular',
    'hero.scrollAria': 'Go to sign-up',

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
    'cast.intro': 'The artists and team bringing the show to life on stage.',
    'cast.note': 'Placeholder content — casting and bios pending brand approval.',
    'cast.creativeHeading': 'Creative Team',
    'cast.castHeading': 'Cast',
    'cast.tba': 'Casting to be announced',
    'cast.tbaBio': 'Performer to be announced soon.',
    'cast.backToCast': 'Back to Cast & Creative',
    'cast.bioComingSoon': 'Bio coming soon.',

    // Real brand copy from Math (2026-09-15), verbatim.
    'story.intro':
      'The Miraculous universe is expanding, Miraculous: Tales of Ladybug & Cat Noir is going LIVE! Miraculous Corp and Monlove are teaming up to launch a jaw-dropping, action-packed stage show in 2027, bringing our favorite Parisian superheroes to audiences around the globe.',
    'story.mastermindsHeading': 'Meet the Masterminds',
    'story.mastermindsText':
      'The show will be driven by the creative genius of Ella Louise Allaire and Martin Lord Ferguson, the award-winning duo behind “Ice Age Live!”, “Scooby-Doo! and The Lost City of Gold”, and “All Systems Are Go!”. With their passion for storytelling and cutting-edge stagecraft, this production promises to be unlike anything fans have ever seen.',
    'story.spectacleHeading': 'A True Miraculous Spectacle',
    'story.spectacleText':
      'Imagine acrobatics, dazzling aerial choreography, jaw-dropping illusions, energetic dance, and even puppetry, all woven into an all-new, original adventure featuring Ladybug and Cat Noir as they face an exciting new threat! With stage-to-video interaction and exclusive songs, this will be a Miraculous experience for the ages.',
    'story.nextHeading': 'What’s Next?',
    'story.nextText':
      'Details on cities, venues, and ticket sales will be revealed this year. Stay tuned right here on Miraculousladybug.com for the latest updates, don’t miss your chance to see Ladybug and Cat Noir leap from screen to stage! Details will be updated weekly.',
    'story.closing':
      'Are you ready to be Miraculous LIVE? Share your excitement and keep watching this space for more exclusive news on the Miraculous Ladybug live stage show!',

    'villes.title': 'Where the show is going',
    'villes.metaDescription':
      'Every city where Miraculous Ladybug & Cat Noir: The Live Stage Spectacular might play.',
    'villes.back': 'Back to home',
    'villes.intro': 'Browse every city that’s being considered, confirmed, or already on sale.',
    'villes.note': 'Layout example — no tour dates are confirmed yet.',
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
    'form.smsConsent':
      'I agree to receive news, updates and offers related to Miraculous Ladybug & Cat Noir: The Live Stage Spectacular by SMS. By providing your number, you agree to receive SMS communications about the show. Message and data rates may apply. Reply STOP to opt out.',
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
    'form.errAge': 'You must confirm you are 16 or older.',
    'form.errGeneric': 'Sign-up failed. Please try again.',
    'form.doneTitle': 'You’re subscribed!',
    'form.doneText':
      'You’re in! Keep an eye on your inbox for ticket announcements, special updates and exciting news as Miraculous Live gets ready to come to your city.',

    'footer.legal': 'Legal notice',
    'footer.privacy': 'Privacy policy',
    'footer.terms': 'Terms of Use',
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
  },
}

export function useLocale() {
  // English is the default for now (client review / approval). Toggle to FR.
  const locale = useState<Locale>('locale', () => 'en')

  const t = (key: string): string => messages[locale.value][key] ?? key

  const toggle = () => {
    locale.value = locale.value === 'fr' ? 'en' : 'fr'
  }

  return { locale, t, toggle }
}
