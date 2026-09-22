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

export const creative: Person[] = [
  { slug: 'ella-louise-allaire', name: 'Ella Louise Allaire', roleFr: 'Direction Artistique, Livret, Paroles & Musiques', roleEn: 'Artistic Direction, Book, Music & Lyrics', photo: '/images/cast/ella-louise-allaire.webp' },
  { slug: 'martin-lord-ferguson', name: 'Martin Lord Ferguson', roleFr: 'Direction Artistique, Livret, Paroles & Musiques', roleEn: 'Artistic Direction, Book, Music & Lyrics', photo: '/images/cast/martin-lord-ferguson.webp' },
  { slug: 'robert-mcqueen', name: 'Robert McQueen', roleFr: 'Mise en scène', roleEn: 'Stage Direction', photo: '/images/cast/robert-mcqueen.webp' },
  { slug: 'debra-brown', name: 'Debra Brown', roleFr: 'Chorégraphies Acrobatiques', roleEn: 'Acrobatic Choreography', photo: '/images/cast/debra-brown.webp' },
  { slug: 'kassandra-boivin-cenelia', name: 'Kassandra Boivin-Cénélia', roleFr: 'Chorégraphies', roleEn: 'Choreography', photo: '/images/cast/kassandra-boivin-cenelia.webp' },
  { slug: 'nicolas-vaudelet', name: 'Nicolas Vaudelet', roleFr: 'Costumes', roleEn: 'Costume Design', photo: '/images/cast/nicolas-vaudelet.webp' },
  { slug: 'william-todd-jones', name: 'William Todd Jones', roleFr: 'Marionnettes', roleEn: 'Puppet Design', photo: '/images/cast/william-todd-jones.webp' },
  { slug: 'sarah-tremblay', name: 'Sarah Tremblay', roleFr: 'Perruques', roleEn: 'Wig Design', photo: '/images/cast/sarah-tremblay.webp' },
  { slug: 'serge-pourpart', name: 'Serge Pourpart', roleFr: 'Scénographie & Direction Technique', roleEn: 'Set Design & Technical Manager', photo: '/images/cast/serge-pourpart.webp' },
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
