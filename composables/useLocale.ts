// Lightweight FR/EN toggle for the landing page. French is the launch default;
// English exists so clients can review/approve in English.
export type Locale = 'fr' | 'en'

type Dict = Record<string, string>

const messages: Record<Locale, Dict> = {
  fr: {
    'hero.tagline': 'Tes héros préférés prennent enfin vie sur scène.',
    'hero.musicalBy': 'Une comédie musicale par',
    'hero.cta': "Je m'inscris",
    'hero.logoAlt': 'Miraculous : Ladybug & Cat Noir — Le Spectacle Live',
    'hero.scrollAria': "Aller à l'inscription",

    'signup.introTitleA': 'Aide-nous à amener',
    'signup.introTitleB': 'Miraculous Ladybug & Cat Noir',
    'signup.introTitleC': 'dans ta ville',
    'signup.introText':
      'Envie de voir Miraculous Ladybug & Cat Noir: The Live Stage Spectacular dans ta ville? Rejoins la liste d’attente officielle pour manifester ton intérêt et être parmi les premiers informés de la mise en vente des billets et des annonces spéciales.',
    'signup.microcopy':
      'Chaque inscription nous aide à amener le spectacle dans davantage de villes à travers le monde.',

    'form.title': 'Rejoins la liste d’attente officielle',
    'form.lead':
      'Sois parmi les premiers informés des dates de tournée, des ventes de billets et des annonces spéciales quand Miraculous Live arrive près de chez toi.',
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
    'form.submit': 'Rejoindre la liste d’attente',
    'form.submitting': 'Un instant…',
    'form.legalPre':
      'En t’inscrivant, tu acceptes que tes données soient utilisées pour t’envoyer les communications choisies. Tu peux te désinscrire à tout moment. Pour en savoir plus, consulte notre',
    'form.legalLink': 'politique de confidentialité',
    'form.errEmail': 'Merci de saisir une adresse e-mail valide.',
    'form.errCity': 'Merci d’indiquer ta ville.',
    'form.errPhone': 'Merci d’indiquer un numéro de téléphone valide.',
    'form.errAge': 'Tu dois confirmer avoir 16 ans ou plus.',
    'form.errGeneric': "L'inscription a échoué. Réessaie.",
    'form.doneTitle': 'Bienvenue sur la liste d’attente officielle !',
    'form.doneText':
      'Tu y es ! Garde un œil sur ta boîte mail pour les annonces de billets, les mises à jour spéciales et les nouveautés, à mesure que Miraculous Live se prépare à venir dans ta ville.',

    'footer.legal': 'Mentions légales',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': 'Conditions d’utilisation',
    'footer.copyright': '© 2026 MIRACULOUS CORP. & MONLOVE INTERNATIONAL. Tous droits réservés.',
    'footer.trademark': 'Miraculous® est une marque déposée de MIRACULOUS CORP.',
  },
  en: {
    'hero.tagline': 'Your favourite heroes finally come to life on stage.',
    'hero.musicalBy': 'A musical by',
    'hero.cta': 'Count me in',
    'hero.logoAlt': 'Miraculous: Ladybug & Cat Noir — The Live Stage Spectacular',
    'hero.scrollAria': 'Go to sign-up',

    'signup.introTitleA': 'Help bring Miraculous',
    'signup.introTitleB': 'Ladybug & Cat Noir',
    'signup.introTitleC': 'to your city',
    'signup.introText':
      'Want to see Miraculous Ladybug & Cat Noir: The Live Stage Spectacular in your city? Join the official waitlist to show your interest and be among the first to hear about ticket sales and special announcements.',
    'signup.microcopy':
      'Every registration helps us bring the show to more cities around the world.',

    'form.title': 'Join the official waitlist',
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
    'form.submit': 'Join the waitlist',
    'form.submitting': 'One moment…',
    'form.legalPre':
      'By signing up, you agree that your data will be used to send you the communications you selected. You can unsubscribe at any time. To learn more, see our',
    'form.legalLink': 'privacy policy',
    'form.errEmail': 'Please enter a valid email address.',
    'form.errCity': 'Please enter your city.',
    'form.errPhone': 'Please enter a valid phone number.',
    'form.errAge': 'You must confirm you are 16 or older.',
    'form.errGeneric': 'Sign-up failed. Please try again.',
    'form.doneTitle': 'Welcome to the official waitlist!',
    'form.doneText':
      'You’re in! Keep an eye on your inbox for ticket announcements, special updates and exciting news as Miraculous Live gets ready to come to your city.',

    'footer.legal': 'Legal notice',
    'footer.privacy': 'Privacy policy',
    'footer.terms': 'Terms of Use',
    'footer.copyright': '© 2026 MIRACULOUS CORP. & MONLOVE INTERNATIONAL. All rights reserved.',
    'footer.trademark': 'Miraculous® is a registered trademark of MIRACULOUS CORP.',
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
