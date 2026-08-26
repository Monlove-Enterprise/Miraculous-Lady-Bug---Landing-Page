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
      "Envoyez-moi des SMS sur les dates et billets de Miraculous Ladybug Live. La fréquence des messages peut varier. Des frais de messagerie et de données peuvent s'appliquer. Répondez STOP pour vous désabonner, HELP pour de l'aide. Vos coordonnées mobiles ne seront ni vendues ni partagées à des fins promotionnelles.",
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
    'form.errPhoneSms': 'Un numéro de téléphone est requis pour recevoir les SMS.',
    'form.errAge': 'Tu dois confirmer avoir 16 ans ou plus.',
    'form.errGeneric': "L'inscription a échoué. Réessaie.",
    'form.doneTitle': 'Bienvenue sur la liste d’attente officielle !',
    'form.doneText':
      'Tu y es ! Garde un œil sur ta boîte mail pour les annonces de billets, les mises à jour spéciales et les nouveautés, à mesure que Miraculous Live se prépare à venir dans ta ville.',

    'footer.legal': 'Mentions légales',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': 'Conditions d’utilisation',
    'footer.cookies': 'Cookies',
    'footer.copyright': '© 2026 MIRACULOUS CORP. & MONLOVE INTERNATIONAL. Tous droits réservés.',
    'footer.trademark': 'Miraculous® est une marque déposée de MIRACULOUS CORP.',

    'cookie.text':
      'On utilise des cookies de mesure d’audience (Meta) pour comprendre d’où viennent nos visiteurs. Tu peux accepter ou refuser.',
    'cookie.accept': 'Accepter',
    'cookie.decline': 'Refuser',
    'cookie.link': 'En savoir plus',
    'cookie.aria': 'Bandeau de consentement aux cookies',
    'cookie.gpcNotice':
      'Signal « Global Privacy Control » détecté — nous respectons ton choix : aucun cookie publicitaire n’est chargé.',
    'cookie.close': 'Fermer',
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
    'form.emailConsentNotice':
      'By signing up, you agree to receive news and updates about the show by email, plus any other communications you selected. You can unsubscribe at any time. To learn more, see our privacy policy.',
    'form.smsConsent':
      'Text me about Miraculous Ladybug Live tour dates and tickets. Message frequency may vary. Standard message and data rates may apply. Reply STOP to opt out, HELP for help. We will not sell or share your mobile information with third parties for promotional purposes.',
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
    'form.errPhoneSms': 'A phone number is required to receive SMS.',
    'form.errAge': 'You must confirm you are 16 or older.',
    'form.errGeneric': 'Sign-up failed. Please try again.',
    'form.doneTitle': 'Welcome to the official waitlist!',
    'form.doneText':
      'You’re in! Keep an eye on your inbox for ticket announcements, special updates and exciting news as Miraculous Live gets ready to come to your city.',

    'footer.legal': 'Legal notice',
    'footer.privacy': 'Privacy policy',
    'footer.terms': 'Terms of Use',
    'footer.cookies': 'Cookies',
    'footer.copyright': '© 2026 MIRACULOUS CORP. & MONLOVE INTERNATIONAL. All rights reserved.',
    'footer.trademark': 'Miraculous® is a registered trademark of MIRACULOUS CORP.',

    'cookie.text':
      'We use audience-measurement cookies (Meta) to understand where our visitors come from. You can accept or decline.',
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

  return { locale, t, toggle }
}
