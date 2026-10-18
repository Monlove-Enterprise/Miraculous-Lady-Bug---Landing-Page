// Math, 2026-10-18: "here are the updated FAQ" — the full, categorized FAQ
// document (pasted verbatim, cleaned of PDF-export artifacts: literal
// "&amp;" decoded back to "&", and the repeated
// "Miraculous Ladybug & Cat Noir: The Live Stage Spectacular • FAQ"
// page-footer lines that appeared mid-document removed as paste
// artifacts, not content). English only — no French version was
// provided, so the French FAQ page keeps the shorter set of Q&As that
// were already live (verbatim, unchanged) rather than guessing a
// translation for policy-sensitive content (ticket/VIP/accessibility
// terms) ourselves. Flagged to Math: FR needs its own translation pass
// once one exists.

export interface FaqItem {
  q: string
  a: string
}

export interface FaqCategory {
  /** Empty string renders no heading — used for the FR fallback below,
   *  which doesn't have real categories yet. */
  heading: string
  items: FaqItem[]
}

export const faqEn: FaqCategory[] = [
  {
    heading: 'About the show',
    items: [
      {
        q: 'What is Miraculous Ladybug & Cat Noir: The Live Stage Spectacular?',
        a: 'Get ready for a Miraculous adventure like never before! This all-new live theatrical production brings the beloved superheroes to life through an original story, original songs, breathtaking acrobatics, spectacular visual effects, and cutting-edge technology. Join Ladybug and Cat Noir in an unforgettable experience for the whole family!',
      },
      {
        q: 'Is this a new Miraculous show?',
        a: 'Yes! This is a brand-new theatrical production featuring an original story and original music created especially for the stage.',
      },
      {
        q: 'Is the show based on the Miraculous animated television series?',
        a: 'The show is inspired by the beloved animated series Miraculous: Tales of Ladybug & Cat Noir, featuring familiar characters in an exciting new adventure created especially for live audiences.',
      },
      {
        q: 'Will Ladybug and Cat Noir appear in the show?',
        a: 'Absolutely! Ladybug and Cat Noir take center stage in an action-packed adventure filled with heroic moments, humor, music, and surprises.',
      },
      {
        q: 'Do I need to know the television series to enjoy the show?',
        a: 'Not at all! Whether you’re a longtime Miraculous fan or discovering Ladybug and Cat Noir for the first time, the show is designed to entertain the whole family.',
      },
      {
        q: 'What makes this live show special?',
        a: 'Experience the magic of Miraculous like never before! Combining original music, breathtaking acrobatics, humor, captivating puppetry, innovative video technology, and spectacular theatrical effects, this all-new production brings Ladybug and Cat Noir’s extraordinary world to life in an unforgettable experience for the whole family!',
      },
    ],
  },
  {
    heading: 'For the whole family',
    items: [
      {
        q: 'What ages is the show recommended for?',
        a: 'Miraculous Ladybug & Cat Noir: The Live Stage Spectacular is an unforgettable live entertainment experience designed for the whole family! Whether you’re a young fan, a teenager, or an adult, there’s something for everyone to enjoy.',
      },
      {
        q: 'Is the show suitable for young children?',
        a: 'The show is designed for family audiences and includes exciting action sequences, music, theatrical effects, and moments of suspense. Parents may wish to consider their child’s individual sensitivity to loud sounds, lighting effects, and dramatic scenes.',
      },
      {
        q: 'Will teenagers and adults enjoy the show?',
        a: 'Absolutely! With its captivating storytelling, humor, thrilling action, and spectacular performances, the show offers an unforgettable experience for Miraculous fans of all generations.',
      },
      {
        q: 'Can children dress up as their favorite Miraculous characters?',
        a: 'We love seeing fans celebrate their favorite superheroes! Costumes are welcome, subject to each venue’s costume and safety policies.',
      },
    ],
  },
  {
    heading: 'Performance information',
    items: [
      {
        q: 'How long is the show?',
        a: 'The show runs approximately 80 minutes.',
      },
      {
        q: 'Will there be an intermission?',
        a: 'Intermission information will be confirmed closer to the performance dates.',
      },
      {
        q: 'Is the show performed in English?',
        a: 'The North American production is performed in English.',
      },
      {
        q: 'Will there be music and singing?',
        a: 'Yes! The show features original songs and music created especially for this live production.',
      },
      {
        q: 'Will there be acrobatics and special effects?',
        a: 'Absolutely! Expect thrilling acrobatics, impressive visual effects, and innovative stage technology that bring the Miraculous universe to life.',
      },
    ],
  },
  {
    heading: 'Tickets & seating',
    items: [
      {
        q: 'Where can I purchase tickets?',
        a: 'Tickets are available through official venue websites and authorized ticketing partners. Visit the official show website to find your city and purchase tickets.',
      },
      {
        q: 'Do children need their own tickets?',
        a: 'Ticket requirements vary by venue. Please consult your venue’s ticketing policy for children and infants.',
      },
      {
        q: 'Are there assigned seats?',
        a: 'Most performances offer reserved seating. Please consult the seating chart when purchasing tickets.',
      },
      {
        q: 'Are accessible seats available?',
        a: 'Accessible seating options are available through participating venues. Please contact your venue directly for accessibility information and assistance.',
      },
      {
        q: 'Can I exchange or refund my tickets?',
        a: 'Ticket purchases are subject to the policies of the ticketing provider and venue. Please review the applicable terms before purchasing.',
      },
    ],
  },
  {
    heading: 'VIP experiences',
    items: [
      {
        q: 'Are VIP packages available?',
        a: 'Yes! Make your Miraculous experience even more special with exclusive VIP packages available at select performances.',
      },
      {
        q: 'What is included in the Ultimate VIP Pre-Party Pass?',
        a: 'The Ultimate VIP Pre-Party Pass includes a premium reserved ticket, access to an exclusive pre-show party, a meet-and-greet and photo opportunity with Ladybug, snacks and beverages, exclusive merchandise, and additional VIP benefits. Please review the package description for full details.',
      },
      {
        q: 'What is included in the Premium VIP Package?',
        a: 'The Premium VIP Package includes a premium reserved ticket, exclusive merchandise, VIP credentials, crowd-free merchandise shopping, and additional benefits. Please review the package description for full details.',
      },
      {
        q: 'Can I meet Ladybug and Cat Noir?',
        a: 'The Ultimate VIP Pre-Party Pass includes a meet-and-greet and photo opportunity with Ladybug. Only the character appearances specifically listed in a package are included.',
      },
      {
        q: 'Are VIP packages available for every performance?',
        a: 'VIP package availability varies by city and performance. Quantities are limited.',
      },
    ],
  },
  {
    heading: 'At the theatre',
    items: [
      {
        q: 'Can we take photos or videos during the performance?',
        a: 'Photography and video recording policies vary by venue and production. Please follow the instructions of theatre staff.',
      },
      {
        q: 'Will Miraculous merchandise be available?',
        a: 'Official Miraculous merchandise is expected to be available at participating venues, subject to availability.',
      },
      {
        q: 'How early should we arrive?',
        a: 'We recommend arriving at least 30 minutes before showtime to allow time for parking, security, and finding your seats. VIP guests should follow the arrival instructions provided with their packages.',
      },
      {
        q: 'What happens if we arrive late?',
        a: 'Late seating is subject to venue policies and may be delayed until an appropriate moment in the performance.',
      },
    ],
  },
  {
    heading: 'Tour information & updates',
    items: [
      {
        q: 'Where is the show touring?',
        a: 'Visit the official show website for the latest tour dates, cities, and ticket information.',
      },
      {
        q: 'Will the show be coming to my city?',
        a: 'New cities and performance dates may be announced. Follow the official social media channels and sign up for updates to be among the first to know!',
      },
      {
        q: 'Will there be additional performances?',
        a: 'Additional performances may be announced depending on the tour schedule and availability.',
      },
      {
        q: 'How can I stay updated?',
        a: 'Follow the official social media channels and subscribe to the newsletter for tour announcements, behind-the-scenes content, special offers, and Miraculous news!',
      },
    ],
  },
]

// Math, 2026-10-18: "can you translate it ?" — draft translation of the
// full FAQ, matching the "tu" voice already used elsewhere on the FR
// site. This is MY translation, not brand-supplied copy — per this
// project's own rule ("ne pas inventer de wording final... circuit de
// validation externe"), treat it as a draft that still needs a real
// validation pass before launch, especially the policy-sensitive
// sections (tickets, VIP packages, accessibility) where precise wording
// matters. Flag any correction back here.
export const faqFr: FaqCategory[] = [
  {
    heading: 'À propos du spectacle',
    items: [
      {
        q: 'Qu’est-ce que Miraculous Ladybug & Cat Noir : Le Spectacle Live ?',
        a: 'Prépare-toi à vivre une aventure Miraculous comme jamais auparavant ! Cette toute nouvelle production théâtrale live donne vie aux super-héros préférés à travers une histoire inédite, des chansons originales, des acrobaties à couper le souffle, des effets visuels spectaculaires et une technologie de pointe. Rejoins Ladybug et Chat Noir pour une expérience inoubliable en famille !',
      },
      {
        q: 'Est-ce un nouveau spectacle Miraculous ?',
        a: 'Oui ! Il s’agit d’une toute nouvelle production théâtrale avec une histoire inédite et une musique originale créées spécialement pour la scène.',
      },
      {
        q: 'Le spectacle est-il basé sur la série animée Miraculous ?',
        a: 'Le spectacle s’inspire de la série animée Miraculous : Les Aventures de Ladybug et Chat Noir, avec des personnages familiers dans une toute nouvelle aventure créée spécialement pour la scène.',
      },
      {
        q: 'Ladybug et Chat Noir seront-ils présents dans le spectacle ?',
        a: 'Absolument ! Ladybug et Chat Noir sont au cœur de l’action dans une aventure trépidante remplie de moments héroïques, d’humour, de musique et de surprises.',
      },
      {
        q: 'Dois-je connaître la série télévisée pour apprécier le spectacle ?',
        a: 'Pas du tout ! Que tu sois fan de Miraculous de longue date ou que tu découvres Ladybug et Chat Noir pour la première fois, le spectacle est conçu pour divertir toute la famille.',
      },
      {
        q: 'Qu’est-ce qui rend ce spectacle live si spécial ?',
        a: 'Vis la magie de Miraculous comme jamais auparavant ! Alliant musique originale, acrobaties à couper le souffle, humour, marionnettes captivantes, technologie vidéo innovante et effets théâtraux spectaculaires, cette toute nouvelle production donne vie à l’univers extraordinaire de Ladybug et Chat Noir pour une expérience inoubliable en famille !',
      },
    ],
  },
  {
    heading: 'Pour toute la famille',
    items: [
      {
        q: 'À partir de quel âge le spectacle est-il recommandé ?',
        a: 'Miraculous Ladybug & Cat Noir : Le Spectacle Live est une expérience de divertissement inoubliable conçue pour toute la famille ! Que tu sois jeune fan, adolescent ou adulte, il y en a pour tous les goûts.',
      },
      {
        q: 'Le spectacle convient-il aux jeunes enfants ?',
        a: 'Le spectacle est conçu pour un public familial et comprend des séquences d’action, de la musique, des effets théâtraux et des moments de suspense. Les parents voudront peut-être tenir compte de la sensibilité de leur enfant aux bruits forts, aux effets lumineux et aux scènes intenses.',
      },
      {
        q: 'Les adolescents et les adultes vont-ils apprécier le spectacle ?',
        a: 'Absolument ! Avec son histoire captivante, son humour, son action palpitante et ses performances spectaculaires, le spectacle offre une expérience inoubliable aux fans de Miraculous de toutes les générations.',
      },
      {
        q: 'Les enfants peuvent-ils se déguiser en leurs personnages Miraculous préférés ?',
        a: 'On adore voir les fans célébrer leurs super-héros préférés ! Les costumes sont les bienvenus, sous réserve des politiques de costumes et de sécurité propres à chaque salle.',
      },
    ],
  },
  {
    heading: 'Informations sur la représentation',
    items: [
      {
        q: 'Combien de temps dure le spectacle ?',
        a: 'Le spectacle dure environ 80 minutes.',
      },
      {
        q: 'Y aura-t-il un entracte ?',
        a: 'Les informations sur l’entracte seront confirmées à l’approche des dates de représentation.',
      },
      {
        q: 'Le spectacle est-il présenté en anglais ?',
        a: 'La production nord-américaine est présentée en anglais.',
      },
      {
        q: 'Y aura-t-il de la musique et du chant ?',
        a: 'Oui ! Le spectacle comprend des chansons et une musique originales, créées spécialement pour cette production live.',
      },
      {
        q: 'Y aura-t-il des acrobaties et des effets spéciaux ?',
        a: 'Absolument ! Attends-toi à des acrobaties palpitantes, des effets visuels impressionnants et une technologie scénique innovante qui donnent vie à l’univers Miraculous.',
      },
    ],
  },
  {
    heading: 'Billets et places',
    items: [
      {
        q: 'Où puis-je acheter des billets ?',
        a: 'Les billets sont disponibles sur les sites officiels des salles et auprès des partenaires billetterie autorisés. Visite le site officiel du spectacle pour trouver ta ville et acheter tes billets.',
      },
      {
        q: 'Les enfants ont-ils besoin de leur propre billet ?',
        a: 'Les exigences en matière de billets varient selon la salle. Consulte la politique billetterie de ta salle concernant les enfants et les nourrissons.',
      },
      {
        q: 'Les places sont-elles assignées ?',
        a: 'La plupart des représentations offrent des places réservées. Consulte le plan de salle au moment d’acheter tes billets.',
      },
      {
        q: 'Des places accessibles sont-elles disponibles ?',
        a: 'Des places accessibles sont proposées dans les salles participantes. Contacte directement ta salle pour obtenir des informations et de l’aide en matière d’accessibilité.',
      },
      {
        q: 'Puis-je échanger ou me faire rembourser mes billets ?',
        a: 'L’achat de billets est soumis aux politiques du fournisseur de billetterie et de la salle. Prends connaissance des conditions applicables avant d’acheter.',
      },
    ],
  },
  {
    heading: 'Expériences VIP',
    items: [
      {
        q: 'Des forfaits VIP sont-ils disponibles ?',
        a: 'Oui ! Rends ton expérience Miraculous encore plus spéciale grâce à des forfaits VIP exclusifs offerts pour certaines représentations.',
      },
      {
        q: 'Qu’est-ce qui est inclus dans le laissez-passer Ultimate VIP Pre-Party ?',
        a: 'Le laissez-passer Ultimate VIP Pre-Party comprend un billet réservé premium, l’accès à une fête exclusive avant le spectacle, une rencontre et une séance photo avec Ladybug, des collations et des boissons, des articles exclusifs ainsi que d’autres avantages VIP. Consulte la description du forfait pour tous les détails.',
      },
      {
        q: 'Qu’est-ce qui est inclus dans le forfait Premium VIP ?',
        a: 'Le forfait Premium VIP comprend un billet réservé premium, des articles exclusifs, un laissez-passer VIP, un accès à la boutique sans file d’attente ainsi que d’autres avantages. Consulte la description du forfait pour tous les détails.',
      },
      {
        q: 'Puis-je rencontrer Ladybug et Chat Noir ?',
        a: 'Le laissez-passer Ultimate VIP Pre-Party comprend une rencontre et une séance photo avec Ladybug. Seules les apparitions de personnages explicitement mentionnées dans un forfait sont incluses.',
      },
      {
        q: 'Les forfaits VIP sont-ils disponibles pour toutes les représentations ?',
        a: 'La disponibilité des forfaits VIP varie selon la ville et la représentation. Les quantités sont limitées.',
      },
    ],
  },
  {
    heading: 'À la salle',
    items: [
      {
        q: 'Pouvons-nous prendre des photos ou des vidéos pendant la représentation ?',
        a: 'Les politiques relatives à la photo et à la vidéo varient selon la salle et la production. Suis les consignes du personnel sur place.',
      },
      {
        q: 'Des produits dérivés Miraculous seront-ils disponibles ?',
        a: 'Des produits dérivés Miraculous officiels devraient être disponibles dans les salles participantes, selon les stocks.',
      },
      {
        q: 'À quelle heure devrions-nous arriver ?',
        a: 'Nous te recommandons d’arriver au moins 30 minutes avant le début du spectacle pour avoir le temps de te stationner, de passer la sécurité et de trouver ta place. Les invités VIP doivent suivre les consignes d’arrivée fournies avec leur forfait.',
      },
      {
        q: 'Que se passe-t-il si nous arrivons en retard ?',
        a: 'Le placement en cas de retard est soumis aux politiques de la salle et peut être retardé jusqu’à un moment approprié de la représentation.',
      },
    ],
  },
  {
    heading: 'Infos tournée et mises à jour',
    items: [
      {
        q: 'Où le spectacle est-il en tournée ?',
        a: 'Visite le site officiel du spectacle pour connaître les dernières dates de tournée, les villes et les informations billetterie.',
      },
      {
        q: 'Le spectacle viendra-t-il dans ma ville ?',
        a: 'De nouvelles villes et dates de représentation pourraient être annoncées. Suis les réseaux sociaux officiels et inscris-toi pour recevoir les mises à jour et être parmi les premiers informés !',
      },
      {
        q: 'Y aura-t-il des représentations supplémentaires ?',
        a: 'Des représentations supplémentaires pourraient être annoncées selon le calendrier de la tournée et les disponibilités.',
      },
      {
        q: 'Comment puis-je rester informé ?',
        a: 'Suis les réseaux sociaux officiels et abonne-toi à l’infolettre pour recevoir les annonces de tournée, du contenu exclusif en coulisses, des offres spéciales et les dernières nouvelles Miraculous !',
      },
    ],
  },
]
