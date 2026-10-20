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

// Robert McQueen and Serge Poupart bios: EN verbatim from Math (2026-09-30);
// FR is my translation, not brand-confirmed — flag for review before launch.
// Ella/Martin role title updated by Math (2026-10-15) to two credit lines
// ("Original Concept & Creative Direction" / "Book, Music & Lyrics"),
// replacing the earlier single-line "Creators & Creative Directors"
// (2026-09-30). FR is my translation, not brand-confirmed — same caveat.
export const creative: Person[] = [
  {
    slug: 'ella-louise-allaire',
    name: 'Ella Louise Allaire',
    roleFr: 'Concept original & direction artistique\nLivret, musique & paroles',
    roleEn: 'Original Concept & Creative Direction\nBook, Music & Lyrics',
    photo: '/images/cast/ella-louise-allaire.webp',
    bioEn:
      'Ella Louise Allaire is an award-winning show creator, composer, librettist, lyricist and producer with nearly 20 years of experience creating large-scale live entertainment for international audiences.\n\n' +
      'She co-created the original concept, book, music and lyrics for Ice Age Live! A Mammoth Adventure, an international arena production that toured 48 countries, was translated into 12 languages and grossed more than $100 million. She also co-created the concept, book, music and lyrics for Scooby-Doo! and the Lost City of Gold, a multi-million-dollar family musical that toured North America and was presented at Etihad Arena in Abu Dhabi.\n\n' +
      "Her recent work includes creating and producing All Systems Are Go!, an immersive Peanuts™/NASA experience that brought NASA's Artemis missions to life for family audiences and was presented for two years at Kennedy Space Center Visitor Complex in Florida.\n\n" +
      'Her creative and musical credits include Cirque du Soleil\'s KÀ, ZED and Alegría, for which she wrote "Rinalto Vera," as well as the feature film Cirque du Soleil: Worlds Away, co-produced by James Cameron.\n\n' +
      'Ella Louise has received four Gold Stevie® Awards, including Creative Executive of the Year and recognition for her creative work on All Systems Are Go! and Scooby-Doo! and the Lost City of Gold.',
    bioFr:
      "Ella Louise Allaire est une créatrice de spectacles, compositrice, librettiste, parolière et productrice primée, comptant près de 20 ans d'expérience dans la création de divertissements grand format pour des publics internationaux.\n\n" +
      "Elle a co-créé le concept original, le livret, la musique et les paroles de Ice Age Live! A Mammoth Adventure, une production d'arène internationale présentée dans 48 pays, traduite en 12 langues et ayant généré plus de 100 millions de dollars de recettes. Elle a également co-créé le concept, le livret, la musique et les paroles de Scooby-Doo! and the Lost City of Gold, une comédie musicale familiale à plusieurs millions de dollars présentée en tournée en Amérique du Nord et à l'Etihad Arena d'Abu Dhabi.\n\n" +
      "Ses travaux récents incluent la création et la production de All Systems Are Go!, une expérience immersive Peanuts™/NASA qui a donné vie aux missions Artemis de la NASA pour le public familial, présentée pendant deux ans au Kennedy Space Center Visitor Complex, en Floride.\n\n" +
      'Parmi ses crédits créatifs et musicaux figurent KÀ, ZED et Alegría du Cirque du Soleil, pour lequel elle a écrit « Rinalto Vera », ainsi que le film Cirque du Soleil: Worlds Away, coproduit par James Cameron.\n\n' +
      "Ella Louise a reçu quatre Stevie® Awards d'or, dont celui de Cadre créatif de l'année, ainsi que des distinctions pour son travail créatif sur All Systems Are Go! et Scooby-Doo! and the Lost City of Gold.",
  },
  {
    slug: 'martin-lord-ferguson',
    name: 'Martin Lord Ferguson',
    roleFr: 'Concept original & direction artistique\nLivret, musique & paroles',
    roleEn: 'Original Concept & Creative Direction\nBook, Music & Lyrics',
    photo: '/images/cast/martin-lord-ferguson.webp',
    bioEn:
      'Martin Lord Ferguson is a Canadian show creator/producer, sound engineer, scriptwriter, composer and lyricist. His credits include co-writing the book, music and lyrics for the mega success Ice Age Live! A Mammoth Adventure (20th Century Fox, Stage Entertainment), with record audiences in Paris (over 60,000 spectators in a 5-day run) and Hamburg (over 30,000 spectators in a single weekend), beating acts like Coldplay and U2.\n\n' +
      "Martin is also the co-creator and co-producer of family musicals such as The Nut Job Live & Friends, Scooby-Doo! and the Lost City of Gold, and the upcoming Miraculous Ladybug & Cat Noir: The Live Stage Spectacular. Additionally, he created the immersive educational experience All Systems Are Go! on NASA's Artemis mission, which was presented for two years at Kennedy Space Center Visitor Complex in Florida.\n\n" +
      'Martin started out as a music producer and engineer, producing over 30 albums, including Cirque du Soleil, Holiday on Ice, Roch Voisine, Ginette Reno, Mitsou & Elise Velle. For over 20 years, he has been involved in every field of the industry, including theatre and large-format shows, advertising, TV series and feature films, as well as songwriting. He scored White Skin, which received two awards in Canada: "Best New Director," Toronto Film Festival, and "Best First Movie," Genie Awards, and the TV series Fortier, which, with a 60% market share, was the biggest drama series ever in French Canadian history.\n\n' +
      "His music has been heard on many international productions, including Cirque du Soleil: Worlds Away, a 3D film co-produced by James Cameron and directed by Andrew Adamson (Shrek, Narnia…), Conan the Barbarian (2011), the 2010 Winter Olympic Games, The Scorpion King 2, The Huntsman: Winter's War, Dateline NBC, The Cleveland Show, NFL Films and the video game Spider-Man: Shattered Dimensions.",
    bioFr:
      "Martin Lord Ferguson est un créateur/producteur de spectacles, ingénieur du son, scénariste, compositeur et parolier canadien. Parmi ses crédits, on compte la co-écriture du livret, de la musique et des paroles du méga-succès Ice Age Live! A Mammoth Adventure (20th Century Fox, Stage Entertainment), qui a établi des records d'audience à Paris (plus de 60 000 spectateurs en 5 jours) et à Hambourg (plus de 30 000 spectateurs en un seul week-end), devançant des artistes comme Coldplay et U2.\n\n" +
      "Martin est également co-créateur et co-producteur de comédies musicales familiales telles que The Nut Job Live & Friends, Scooby-Doo! and the Lost City of Gold, ainsi que du prochain spectacle Miraculous Ladybug & Cat Noir: The Live Stage Spectacular. Il a également créé l'expérience éducative immersive All Systems Are Go! sur la mission Artemis de la NASA, présentée pendant deux ans au Kennedy Space Center Visitor Complex, en Floride.\n\n" +
      "Martin a débuté comme producteur et ingénieur musical, produisant plus de 30 albums, notamment pour le Cirque du Soleil, Holiday on Ice, Roch Voisine, Ginette Reno, Mitsou et Élise Velle. Depuis plus de 20 ans, il œuvre dans tous les domaines de l'industrie : théâtre et spectacles grand format, publicité, séries télévisées et longs métrages, ainsi que l'écriture de chansons. Il a composé la musique de White Skin, récompensé au Canada par le prix du « Meilleur nouveau réalisateur » au Festival du film de Toronto et du « Meilleur premier film » aux Prix Génie, ainsi que celle de la série télévisée Fortier qui, avec 60 % de parts de marché, est devenue la plus grande série dramatique de l'histoire de la télévision canadienne-française.\n\n" +
      "Sa musique a été entendue dans de nombreuses productions internationales, dont Cirque du Soleil: Worlds Away, un film 3D coproduit par James Cameron et réalisé par Andrew Adamson (Shrek, Narnia…), Conan the Barbarian (2011), les Jeux olympiques d'hiver de 2010, The Scorpion King 2, The Huntsman: Winter's War, Dateline NBC, The Cleveland Show, NFL Films, ainsi que le jeu vidéo Spider-Man: Shattered Dimensions.",
  },
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
  {
    slug: 'debra-brown',
    name: 'Debra Brown',
    roleFr: 'Chorégraphies Acrobatiques',
    roleEn: 'Acrobatic Choreography',
    photo: '/images/cast/debra-brown.webp',
    // Bio verbatim from Math (2026-10-19). FR is my translation, not
    // brand-confirmed — flag for review before launch.
    bioEn:
      'Debra Lynne Brown is an internationally renowned Canadian choreographer celebrated for her groundbreaking contributions to Cirque du Soleil and her innovative fusion of dance, gymnastics, and circus arts. Over the course of her career, she has received numerous accolades, including an Emmy Award for Outstanding Choreography for her work on the 74th Annual Academy Awards.\n\n' +
      'As Cirque du Soleil’s principal choreographer beginning in 1987, Brown helped shape the company’s signature style and movement vocabulary through iconic productions such as Alegría, Mystère, Quidam, La Nouba, “O,” Corteo, Amaluna, and Luzia. Her influence extends far beyond Cirque. She has worked with global superstars, creating aerial choreography for Madonna’s Drowned World Tour, staging performances for Aerosmith, Céline Dion, and Björk, and bringing her vision to films such as Catwoman and Van Helsing. She has also choreographed for leading opera houses, including the Metropolitan Opera, and created choreography for the Canadian Olympic synchronized swimming team.\n\n' +
      'Brown’s artistry has earned her further recognition, including a Doctorate of Education from Nipissing University, the Bob Fosse Innovative Choreography Award, the Golden Clown at the World Circus Festival, and eight National Gymnastics Awards.',
    bioFr:
      "Debra Lynne Brown est une chorégraphe canadienne de renommée internationale, célébrée pour ses contributions novatrices au Cirque du Soleil et pour sa fusion originale de la danse, de la gymnastique et des arts du cirque. Au cours de sa carrière, elle a reçu de nombreuses distinctions, dont un Emmy Award de la meilleure chorégraphie pour son travail sur la 74e cérémonie des Oscars.\n\n" +
      "Chorégraphe principale du Cirque du Soleil à partir de 1987, Brown a contribué à façonner le style signature et le vocabulaire gestuel de la compagnie à travers des productions emblématiques telles qu'Alegría, Mystère, Quidam, La Nouba, « O », Corteo, Amaluna et Luzia. Son influence dépasse largement le Cirque : elle a collaboré avec des superstars internationales, créant la chorégraphie aérienne du Drowned World Tour de Madonna, mettant en scène des performances pour Aerosmith, Céline Dion et Björk, et apportant sa vision à des films tels que Catwoman et Van Helsing. Elle a également chorégraphié pour de grandes maisons d'opéra, dont le Metropolitan Opera, et créé des chorégraphies pour l'équipe olympique canadienne de nage synchronisée.\n\n" +
      "Le talent de Brown lui a valu d'autres distinctions, dont un doctorat honorifique en éducation de l'Université Nipissing, le Bob Fosse Innovative Choreography Award, le Clown d'or du Festival mondial du cirque et huit National Gymnastics Awards.",
  },
  {
    slug: 'kassandra-boivin-cenelia',
    name: 'Kassandra Boivin-Cénélia',
    roleFr: 'Chorégraphies',
    roleEn: 'Choreography',
    photo: '/images/cast/kassandra-boivin-cenelia.webp',
    // Bios verbatim from Math (2026-10-15).
    bioEn:
      'Kassandra Boivin-Cenelia, known as Badkass, is a choreographer recognized for her authenticity, energy, and distinctive choreographic style.\n\n' +
      'For Kassandra, dance has always been a language. Deeply connected to music, her work blends emotion, street dance, and instinct to create movement and worlds that tell stories, stir feelings, and leave a lasting impression. Her approach is rooted in ongoing exploration—a commitment to learning and to evolving her own artistic voice.\n\n' +
      'Her career has taken her into major productions as a performer, teacher, and choreographer. From stage to screen, she has danced in numerous projects, travelled across Canada to teach, and collaborated with artists and creative teams from diverse backgrounds. Her choreography credits include television shows such as En direct de l’univers and Révolution (seasons 4–7). She has also developed her work through stage productions, music videos, artistic residencies, and variety shows, including Super Franco Fête. This breadth of experience allows her to approach every project with authenticity, sensitivity, and precision.',
    bioFr:
      'Kassandra Boivin-Cenelia, alias Badkass, est une chorégraphe reconnue pour son authenticité, son énergie et sa signature chorégraphique.\n\n' +
      'Depuis toujours, la danse est pour elle un langage. Profondément connectée à la musique, son travail est un mélange d’émotions, de streetdance et d’instinct pour donner vie à des mouvements et des univers qui racontent, évoquent et laissent une impression forte. Sa démarche se nourrit d’une recherche constante, autant dans son apprentissage que dans sa volonté de faire évoluer son propre langage artistique.\n\n' +
      'Son parcours l’a amenée à évoluer au sein de productions d’envergure, comme interprète, enseignante et chorégraphe. De la scène à l’écran, elle a dansé dans de nombreux projets, parcouru différentes provinces du Canada pour y enseigner et côtoyer des artistes et des équipes issues de milieux variés. Elle a notamment signé des chorégraphies pour des émissions telles qu’En direct de l’univers et Révolution (des saisons 4 à 7), tout en développant son travail à travers différents projets scéniques, vidéoclips, résidences artistiques et show de variétés, dont Super Franco Fête. Cette expérience plurielle lui permet aujourd’hui d’aborder chaque projet avec authenticité, sensibilité et rigueur.',
  },
  {
    slug: 'nicolas-vaudelet',
    name: 'Nicolas Vaudelet',
    roleFr: 'Costumes',
    roleEn: 'Costume Design',
    photo: '/images/cast/nicolas-vaudelet.webp',
    // NOTE: this credit names the real-world Lido cabaret (a past client of
    // his, unrelated to our own unconfirmed Paris venue) — flagged for Math
    // given the 2026-10-06 instruction to scrub "Lido" mentions site-wide;
    // kept as-is for now since it's factual career history, not our venue.
    bioFr:
      'Nicolas Vaudelet a été formé par les plus grands noms de la Mode : Christian Lacroix, Christian Dior (John Galliano), Louis Vuitton (Marc Jacobs), Givenchy (Alexander McQueen, Julian MacDonald), Sonia Rykiel et Jean Paul Gaultier.\n\n' +
      'Avec ce dernier, il participe au design et à l\'élaboration des costumes du Confession Tour de Madonna et du danseur de flamenco Joaquin Cortes.\n\n' +
      "Après une riche expérience à Séville comme directeur artistique de la maison centenaire El Caballo, où il obtient en 2009 le prix l'Oréal de la meilleure collection, il crée les costumes du Ballet National Espagnol. Pour ce travail, il est nommé « meilleur costumier » aux Max de 2014.\n\n" +
      'Cette même année, il fait la rencontre du célèbre metteur en scène Franco Dragone. Pour lui, il conçoit les 600 costumes qui composent le vestiaire du Cabaret parisien du Lido, du chanteur russe Philipp Kirkorov au Kremlin de Moscou, du Daï Show à XiShuangBanna et du parc et hôtel Rixos World en Turquie.\n\n' +
      "Cette période qui s'étend jusqu'à fin 2016 marque nettement la prédilection de Nicolas pour la création de costumes de scène.\n\n" +
      'Dès janvier 2017, il poursuit cette activité au Canada auprès de Scéno-Plus pour MGM Macau. Dans le même temps, il assure la création des costumes de plusieurs productions du Cirque du Soleil, notamment, Helene Fischer Tour 2017-2018, le spectacle sur glace Axel et le chapiteau de tournée Echo en 2023.',
    bioEn:
      "Nicolas Vaudelet trained under some of fashion's biggest names: Christian Lacroix, Christian Dior (John Galliano), Louis Vuitton (Marc Jacobs), Givenchy (Alexander McQueen, Julien Macdonald), Sonia Rykiel and Jean Paul Gaultier.\n\n" +
      "With Gaultier, he worked on the design and creation of costumes for Madonna's Confessions Tour and for flamenco dancer Joaquín Cortés.\n\n" +
      'After a rich experience in Seville as artistic director of the century-old house El Caballo, where he won the 2009 L\'Oréal Prize for Best Collection, he created the costumes for the Spanish National Ballet. For this work, he was named "Best Costume Designer" at the 2014 Max Awards.\n\n' +
      "That same year, he met renowned director Franco Dragone. For him, he designed the 600 costumes that make up the wardrobe of the Lido cabaret in Paris, Russian singer Philipp Kirkorov's show at the Moscow Kremlin, the Dai Show in Xishuangbanna, and the Rixos World park and hotel in Turkey.\n\n" +
      "This period, which lasted until the end of 2016, marked a clear turning point toward Nicolas's dedication to creating stage costumes.\n\n" +
      'Starting in January 2017, he continued this work in Canada with Scéno-Plus for MGM Macau. At the same time, he designed costumes for several Cirque du Soleil productions, including the Helene Fischer Tour 2017–2018, the ice show Axel, and the touring big top show Echo in 2023.',
  },
  {
    slug: 'william-todd-jones',
    name: 'William Todd-Jones',
    roleFr: 'Marionnettes',
    roleEn: 'Puppet Design',
    photo: '/images/cast/william-todd-jones.webp',
    // Bio verbatim from Math (2026-10-19). FR is my translation, not
    // brand-confirmed — flag for review before launch.
    bioEn:
      'William Todd-Jones is a performer, puppet designer, movement consultant, and director with nearly four decades of experience in film, television, and theatre. Known professionally as Todd, he combines puppetry, physical performance, and technology to bring characters and creatures to life.\n\n' +
      'Todd began his career building and performing puppets and creatures for Jim Henson’s Labyrinth. His subsequent credits include Who Framed Roger Rabbit, Batman, Harry Potter and the Order of the Phoenix, John Carter, and I Am Not a Serial Killer, with roles spanning puppetry, creature movement, and creature effects supervision. His theatre work includes Ice Age Live! A Mammoth Adventure.\n\n' +
      'For the BBC/HBO series His Dark Materials, Todd established the creature effects department and served as its head and master puppeteer, overseeing the creation of puppets representing the series’ dæmons and full-size armoured bear rigs. Across his career, he has contributed to productions recognised with Academy Awards, Emmys, and BAFTAs.',
    bioFr:
      "William Todd-Jones est interprète, concepteur de marionnettes, consultant en mouvement et réalisateur, avec près de quatre décennies d'expérience au cinéma, à la télévision et au théâtre. Connu professionnellement sous le nom de Todd, il combine marionnettisme, performance physique et technologie pour donner vie à des personnages et des créatures.\n\n" +
      "Todd a débuté sa carrière en construisant et en animant des marionnettes et des créatures pour Labyrinthe de Jim Henson. Parmi ses crédits ultérieurs figurent Qui veut la peau de Roger Rabbit, Batman, Harry Potter et l'Ordre du Phénix, John Carter et I Am Not a Serial Killer, avec des rôles allant du marionnettisme au mouvement de créatures en passant par la supervision des effets de créatures. Son travail au théâtre inclut Ice Age Live! A Mammoth Adventure.\n\n" +
      "Pour la série BBC/HBO His Dark Materials (À la croisée des mondes), Todd a mis sur pied le département des effets de créatures et en a assuré la direction en tant que marionnettiste principal, supervisant la création des marionnettes représentant les dæmons de la série ainsi que les ours blindés grandeur nature. Tout au long de sa carrière, il a contribué à des productions récompensées par des Oscars, des Emmy et des BAFTA.",
  },
  { slug: 'sarah-tremblay', name: 'Sarah Tremblay', roleFr: 'Perruques', roleEn: 'Wig Design', photo: '/images/cast/sarah-tremblay.webp' },
  {
    slug: 'serge-poupart',
    name: 'Serge Poupart',
    // Math, 2026-10-15: two-line title like Ella/Martin's — "SET DESIGN"
    // / "PRODUCTION & TECHNICAL DIRECTION". FR is my translation, not
    // brand-confirmed.
    roleFr: 'Scénographie\nProduction et direction technique',
    roleEn: 'Set Design\nProduction & Technical Direction',
    photo: '/images/cast/serge-poupart.webp',
    bioEn:
      'Serge brings over 25 years of experience in technical direction, international productions, and major events, working with organizations including Monlove, Cirque du Soleil, the Formula 1 Grand Prix of Canada, and Just for Laughs.\n\n' +
      'His technical management credits span touring productions and live experiences, including the Backstreet Boys, Scooby-Doo and the Lost City of Gold, All Systems Are Go! A NASA–Peanuts Experience, Mary Poppins, Rick & Morty, and Les Ballets Jazz de Montréal.\n\n' +
      'He has also overseen complex, large-scale projects, including the Dungeons & Dragons attraction at Village Vacances Valcartier, scenic renovations at Palais Montcalm, and the immersive multimedia show Metaforia in Montreal and Jeddah. Beyond entertainment, Serge collaborates with Airbus on scaffolding design for aircraft assembly.',
    bioFr:
      "Serge cumule plus de 25 ans d'expérience en direction technique, productions internationales et grands événements, ayant collaboré avec des organisations telles que Monlove, le Cirque du Soleil, le Grand Prix de Formule 1 du Canada et Juste pour rire.\n\n" +
      'Sa feuille de route en gestion technique couvre des productions en tournée et des expériences live, notamment les Backstreet Boys, Scooby-Doo et la Cité perdue de l\'or, All Systems Are Go! A NASA–Peanuts Experience, Mary Poppins, Rick & Morty, ainsi que Les Ballets Jazz de Montréal.\n\n' +
      "Il a également supervisé des projets complexes de grande envergure, dont l'attraction Donjons & Dragons au Village Vacances Valcartier, des rénovations scéniques au Palais Montcalm, et le spectacle multimédia immersif Metaforia à Montréal et à Djeddah. Au-delà du divertissement, Serge collabore avec Airbus sur la conception d'échafaudages pour l'assemblage d'aéronefs.",
  },
  { slug: 'vincent-fournier', name: 'Vincent Fournier', roleFr: 'Lumières', roleEn: 'Lighting Design', photo: '/images/cast/vincent-fournier.webp' },
  {
    slug: 'real-by-fake',
    name: 'REAL by FAKE',
    // Math, 2026-10-19: a studio credit, not a person — role title derived
    // from the bio's own description, not brand-confirmed.
    roleFr: 'Effets visuels et postproduction',
    roleEn: 'Visual Effects & Post-Production',
    // Bio verbatim from Math (2026-10-19). FR is my translation, not
    // brand-confirmed — flag for review before launch. Logo (not a
    // headshot) — shown via .card__photo--logo in pages/cast/index.vue,
    // which switches to object-fit: contain, no grayscale.
    photo: '/images/cast/real-by-fake.png',
    bioEn:
      'REAL by FAKE is a Montréal-based post-production and visual effects company with offices in Los Angeles and Mexico City. Specialising in realistic visual effects for film, television, commercials, and music videos, the company offers integrated services from creative planning and VFX supervision to editing, colour grading, and final delivery. Its credits include Dallas Buyers Club, Wild, Big Little Lies, Sharp Objects, and The Morning Show, reflecting a commitment to combining technical expertise with visual storytelling.',
    bioFr:
      "REAL by FAKE est une entreprise montréalaise de postproduction et d'effets visuels, avec des bureaux à Los Angeles et à Mexico. Spécialisée dans les effets visuels réalistes pour le cinéma, la télévision, la publicité et les vidéoclips, l'entreprise offre des services intégrés allant de la planification créative et de la supervision des effets visuels jusqu'au montage, à l'étalonnage des couleurs et à la livraison finale. Parmi ses crédits figurent Dallas Buyers Club, Wild, Big Little Lies, Sharp Objects et The Morning Show, témoignant d'un engagement à allier expertise technique et narration visuelle.",
  },
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
