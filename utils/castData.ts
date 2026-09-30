// Real full creative-team credits from Math (2026-09-22), FR/EN as provided;
// headshots added same day (design-source/Headshots -> public/images/cast/,
// resized/converted to web-ready JPEGs). No bios given yet — omitted rather
// than invented (brand-wording rule); add bioFr/bioEn once supplied.
// Shared by pages/cast.vue (grid) and pages/cast/[slug].vue (bio subpage).
export interface Person {
  slug?: string // omit → no bio subpage (TBA roles, "Silent Partners" studio credit excluded on purpose... actually included, just no page for nameless roles)
  name?: string // omit → renders as "to be announced"
  roleFr: string
  roleEn: string
  photo?: string // path under /images/cast/
  bioFr?: string
  bioEn?: string
}

// Robert McQueen and Serge Pourpart bios: EN verbatim from Math (2026-09-30);
// FR is my translation, not brand-confirmed — flag for review before launch.
// Ella/Martin role title ("Creators & Creative Directors") from Math
// (2026-09-30); FR ("Créateurs & Directeurs Artistiques") is my translation,
// same caveat.
export const creative: Person[] = [
  { slug: 'ella-louise-allaire', name: 'Ella Louise Allaire', roleFr: 'Créateurs & Directeurs Artistiques', roleEn: 'Creators & Creative Directors', photo: '/images/cast/ella-louise-allaire.webp' },
  { slug: 'martin-lord-ferguson', name: 'Martin Lord Ferguson', roleFr: 'Créateurs & Directeurs Artistiques', roleEn: 'Creators & Creative Directors', photo: '/images/cast/martin-lord-ferguson.webp' },
  {
    slug: 'robert-mcqueen',
    name: 'Robert McQueen',
    roleFr: 'Mise en scène',
    roleEn: 'Stage Direction',
    photo: '/images/cast/robert-mcqueen.webp',
    bioEn:
      'Robert has worked as a theatre and opera director across North America and Internationally.\n\n' +
      'Robert was the Associate Director for the Broadway production of Mamma Mia, and directed the U.S. tours as well as companies in Mexico City, Buenos Aires, São Paulo and Toronto. Early in his career he worked closely with Harold Prince as Resident Director of the Livent production of the musical Showboat. Robert directed the Japanese language adaptation of the musical Carousel for HoriPro Productions in Tokyo, and the premier of Where Elephants Weep in Phnom Penh, Cambodia.\n\n' +
      "In Canada Robert's theatre productions have been seen at The Stratford Festival, Mirvish Productions, Musical Stage Company, Canadian Stage and in regional theatres across the country.\n\n" +
      "In opera Robert's productions have been seen at The Canadian Opera Company, The Vancouver Opera, Pacific Opera Victoria, Cincinnati Opera and The Arizona Opera Company.\n\n" +
      'From 2013 to 2020 and 2024 to 2026 Robert was Director of New Musical Works and NoteWorthy for Musical Stage Company in Toronto, leading the development of new Canadian theatre works.\n\n' +
      'Additionally, he has developed new musicals and opera for Yonge Street Theatricals, Toronto, Cambodia Living Arts, Phnom Penh, The Vancouver Opera, The Canadian Opera Company and City Opera Vancouver.\n\n' +
      'As a theatre educator, Robert has taught classes and workshops for Arte Studio in Mexico City, The Shanghai Academy, The Royal Conservatoire, Glasgow, HB Studio, New York City, The Stratford Festival, Canada, Studio 58, Vancouver, The Canadian Opera Company, The Vancouver Opera and Pacific Opera Victoria.',
    bioFr:
      "Robert a travaillé comme metteur en scène de théâtre et d'opéra à travers l'Amérique du Nord et à l'international.\n\n" +
      "Robert a été metteur en scène associé pour la production de Broadway Mamma Mia, et a dirigé les tournées américaines ainsi que des productions à Mexico, Buenos Aires, São Paulo et Toronto. Au début de sa carrière, il a travaillé étroitement avec Harold Prince en tant que metteur en scène résident de la production Livent de la comédie musicale Showboat. Robert a mis en scène l'adaptation en langue japonaise de la comédie musicale Carousel pour HoriPro Productions à Tokyo, ainsi que la première de Where Elephants Weep à Phnom Penh, au Cambodge.\n\n" +
      "Au Canada, les productions théâtrales de Robert ont été présentées au Stratford Festival, chez Mirvish Productions, à la Musical Stage Company, au Canadian Stage, ainsi que dans des théâtres régionaux à travers le pays.\n\n" +
      'En opéra, ses productions ont été présentées à la Canadian Opera Company, au Vancouver Opera, à Pacific Opera Victoria, au Cincinnati Opera et à l\'Arizona Opera Company.\n\n' +
      'De 2013 à 2020, puis de 2024 à 2026, Robert a été directeur de New Musical Works et de NoteWorthy pour la Musical Stage Company à Toronto, où il a dirigé le développement de nouvelles œuvres théâtrales canadiennes.\n\n' +
      'Il a également développé de nouvelles comédies musicales et opéras pour Yonge Street Theatricals (Toronto), Cambodia Living Arts (Phnom Penh), le Vancouver Opera, la Canadian Opera Company et la City Opera Vancouver.\n\n' +
      "En tant que formateur en art théâtral, Robert a enseigné et animé des ateliers pour l'Arte Studio à Mexico, la Shanghai Academy, le Royal Conservatoire de Glasgow, le HB Studio à New York, le Stratford Festival (Canada), Studio 58 à Vancouver, la Canadian Opera Company, le Vancouver Opera et Pacific Opera Victoria.",
  },
  { slug: 'debra-brown', name: 'Debra Brown', roleFr: 'Chorégraphies Acrobatiques', roleEn: 'Acrobatic Choreography', photo: '/images/cast/debra-brown.webp' },
  { slug: 'kassandra-boivin-cenelia', name: 'Kassandra Boivin-Cénélia', roleFr: 'Chorégraphies', roleEn: 'Choreography', photo: '/images/cast/kassandra-boivin-cenelia.webp' },
  { slug: 'nicolas-vaudelet', name: 'Nicolas Vaudelet', roleFr: 'Costumes', roleEn: 'Costume Design', photo: '/images/cast/nicolas-vaudelet.webp' },
  { slug: 'william-todd-jones', name: 'William Todd Jones', roleFr: 'Marionnettes', roleEn: 'Puppet Design', photo: '/images/cast/william-todd-jones.webp' },
  { slug: 'sarah-tremblay', name: 'Sarah Tremblay', roleFr: 'Perruques', roleEn: 'Wig Design', photo: '/images/cast/sarah-tremblay.webp' },
  {
    slug: 'serge-pourpart',
    name: 'Serge Pourpart',
    roleFr: 'Scénographie & Direction Technique',
    roleEn: 'Set Design & Technical Manager',
    photo: '/images/cast/serge-pourpart.webp',
    bioEn:
      'Serge brings over 25 years of experience in technical direction, international productions, and major events, working with organizations including Monlove, Cirque du Soleil, the Formula 1 Grand Prix of Canada, and Just for Laughs.\n\n' +
      'His technical management credits span touring productions and live experiences, including the Backstreet Boys, Scooby-Doo and the Lost City of Gold, All Systems Are Go! A NASA–Peanuts Experience, Mary Poppins, Rick & Morty, and Les Ballets Jazz de Montréal.\n\n' +
      'He has also overseen complex, large-scale projects, including the Dungeons & Dragons attraction at Village Vacances Valcartier, scenic renovations at Palais Montcalm, and the immersive multimedia show Metaforia in Montreal and Jeddah. Beyond entertainment, Serge collaborates with Airbus on scaffolding design for aircraft assembly.',
    bioFr:
      "Serge cumule plus de 25 ans d'expérience en direction technique, productions internationales et grands événements, ayant collaboré avec des organisations telles que Monlove, le Cirque du Soleil, le Grand Prix de Formule 1 du Canada et Juste pour rire.\n\n" +
      'Sa feuille de route en gestion technique couvre des productions en tournée et des expériences live, notamment les Backstreet Boys, Scooby-Doo et la Cité perdue de l\'or, All Systems Are Go! A NASA–Peanuts Experience, Mary Poppins, Rick & Morty, ainsi que Les Ballets Jazz de Montréal.\n\n' +
      "Il a également supervisé des projets complexes de grande envergure, dont l'attraction Donjons & Dragons au Village Vacances Valcartier, des rénovations scéniques au Palais Montcalm, et le spectacle multimédia immersif Metaforia à Montréal et à Djeddah. Au-delà du divertissement, Serge collabore avec Airbus sur la conception d'échafaudages pour l'assemblage d'aéronefs.",
  },
  { slug: 'silent-partners', name: 'Silent Partners', roleFr: 'Design Vidéo', roleEn: 'Video Design' },
  { slug: 'vincent-fournier', name: 'Vincent Fournier', roleFr: 'Lumières', roleEn: 'Lighting Design', photo: '/images/cast/vincent-fournier.webp' },
  { roleFr: 'Son', roleEn: 'Sound Design' }, // TBD — no name yet
]

export const cast: Person[] = [
  { roleFr: 'Ladybug', roleEn: 'Ladybug' },
  { roleFr: 'Cat Noir', roleEn: 'Cat Noir' },
  { roleFr: 'Ensemble', roleEn: 'Ensemble' },
  { roleFr: 'Ensemble', roleEn: 'Ensemble' },
]

export function findPerson(slug: string): Person | undefined {
  return [...creative, ...cast].find((p) => p.slug === slug)
}
