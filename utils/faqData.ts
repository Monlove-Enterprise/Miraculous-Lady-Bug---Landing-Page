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

// No French version of the new FAQ has been provided yet — keeps the
// shorter set of Q&As that were already live on the FR page (same content
// previously stored as useLocale.ts 'faq.questions'/'faq.answers' pipe
// strings), verbatim, in a single unheaded category.
export const faqFr: FaqCategory[] = [
  {
    heading: '',
    items: [
      {
        q: 'Qu’est-ce que Miraculous Ladybug & Cat Noir : Le Spectacle Live ?',
        a: 'Une production scénique où Ladybug et Chat Noir affrontent une toute nouvelle menace. Porté par une histoire inédite et des chansons originales, le spectacle allie technologie de pointe, acrobaties, illusion, danse et marionnettes. Un spectacle pour toute la famille.',
      },
      {
        q: 'Est-ce la même histoire que la série ?',
        a: 'Non. Le spectacle raconte une histoire inédite, écrite spécialement pour la scène, avec des chansons originales.',
      },
      {
        q: 'Qui a créé le spectacle ?',
        a: 'Le spectacle a été créé pour la scène par Ella Louise Allaire et Martin Lord Ferguson de Monlove, le duo derrière Scooby-Doo! and The Lost City of Gold. Il est développé en partenariat avec Miraculous Corp, propriétaire de la franchise Miraculous, et produit par Monlove.',
      },
      {
        q: 'À qui s’adresse le spectacle ?',
        a: 'Le spectacle est conçu pour les familles et les fans de Miraculous de toutes les générations.',
      },
      {
        q: 'Quand commence la tournée ?',
        a: 'La tournée mondiale débute au début de 2027.',
      },
      {
        q: 'Quand les billets seront-ils mis en vente ?',
        a: 'Les billets seront mis en vente le vendredi 23 octobre 2026.',
      },
      {
        q: 'Le spectacle viendra-t-il dans ma ville ?',
        a: 'Inscris-toi à la liste d’attente sur ce site (16 ans et plus) pour recevoir les nouvelles de la tournée par courriel.',
      },
      {
        q: 'Où puis-je suivre le spectacle ?',
        a: 'Facebook et Instagram : @miraculousladybuglive. TikTok : @miraculousladybuglive_. X : @miraculouslive_. YouTube : @MiraculousLive.',
      },
    ],
  },
]
