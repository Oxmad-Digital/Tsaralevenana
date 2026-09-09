// Contenu centralisé du site : facile à modifier sans toucher aux composants.

export const siteInfo = {
  name: "Tsaralevenana",
  tagline: "Maison Funéraire",
  slogan: "Présent à vos côtés, dans chaque étape du deuil.",
  city: "Antananarivo",
  country: "Madagascar",
  phone: "+261 33 09 760 96",
  phoneHref: "tel:+261330976096",
  email: "Tsaralevenana.tana@gmail.com",
};

export type ServiceItem = {
  number: string;
  title: string;
  description: string;
  icon: "urn" | "house" | "plane" | "torch" | "fire" | "star";
};

export const services: ServiceItem[] = [
  {
    number: "01",
    title: "Organisation des obsèques",
    description:
      "Prise en charge complète et coordination de chaque détail de la cérémonie, dans le respect de vos volontés.",
    icon: "urn",
  },
  {
    number: "02",
    title: "Location espace veillée",
    description:
      "Un lieu serein et recueilli pour veiller votre proche, entouré de vos proches dans la dignité.",
    icon: "house",
  },
  {
    number: "03",
    title: "Rapatriement du corps",
    description:
      "Démarches administratives et logistiques pour le transfert du défunt, en Madagascar comme à l'international.",
    icon: "plane",
  },
  {
    number: "04",
    title: "Service traiteur & cocktail",
    description:
      "Une cuisine soignée et un moment de partage pour accueillir vos invités après la cérémonie, dans le confort et le respect.",
    icon: "torch",
  },
  {
    number: "05",
    title: "Crémation",
    description:
      "Accompagnement complet du processus de crémation, avec écoute et accompagnement à chaque étape.",
    icon: "fire",
  },
  {
    number: "06",
    title: "Prestations à la demande",
    description:
      "Des solutions personnalisées pour répondre à toute demande particulière, sur mesure.",
    icon: "star",
  },
];

export type ProcessStep = {
  numeral: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    numeral: "I",
    title: "Premier contact",
    description:
      "Joignable à toute heure, nous vous écoutons et organisons un premier rendez-vous pour comprendre vos besoins.",
  },
  {
    numeral: "II",
    title: "Organisation",
    description:
      "Nous planifions ensemble chaque détail des obsèques et prenons en charge l'ensemble des démarches administratives.",
  },
  {
    numeral: "III",
    title: "Cérémonie",
    description:
      "Le jour de l'hommage, notre équipe veille au bon déroulement de chaque instant, avec discrétion et dignité.",
  },
  {
    numeral: "IV",
    title: "Accompagnement",
    description:
      "Nous restons à vos côtés après la cérémonie pour vous soutenir dans les formalités et le souvenir.",
  },
];

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "Êtes-vous disponibles à toute heure ?",
    answer:
      "Oui. Notre équipe est joignable 24h/24 et 7j/7 au +261 33 09 760 96. Nous intervenons à tout moment, car nous savons que le deuil ne connaît pas d'horaires.",
  },
  {
    question: "Proposez-vous le rapatriement à l'international ?",
    answer:
      "Absolument. Nous prenons en charge l'ensemble des démarches administratives et logistiques pour le rapatriement du corps, à Madagascar comme vers l'étranger.",
  },
  {
    question: "Puis-je personnaliser entièrement la cérémonie ?",
    answer:
      "Chaque hommage est unique. De la veillée au service traiteur, nous adaptons l'ensemble des prestations à vos volontés, vos croyances et votre budget.",
  },
  {
    question: "Prenez-vous en charge les démarches administratives ?",
    answer:
      "Oui, nous nous occupons de l'intégralité des formalités afin que vous puissiez vous consacrer pleinement à la mémoire de votre proche.",
  },
  {
    question: "Comment obtenir un devis ?",
    answer:
      "Contactez-nous par téléphone, par email ou via le formulaire de ce site. Nous vous proposerons un accompagnement et un devis clair, sans engagement.",
  },
];

export type LocationItem = {
  tag: string;
  name: string;
  address: string;
  phone: string;
};

export const locations: LocationItem[] = [
  {
    tag: "Siège principal",
    name: "Premier emplacement",
    address: "Antananarivo, Madagascar",
    phone: "+261 33 09 760 96",
  },
  {
    tag: "Antenne",
    name: "Deuxième emplacement",
    address: "Antananarivo, Madagascar",
    phone: "+261 33 09 760 96",
  },
];

export type MapConfig = {
  name: string;
  embedUrl: string;
  linkUrl: string;
};

export const mapConfigs: MapConfig[] = [
  {
    name: "Antananarivo Centre",
    embedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=47.47%2C-18.95%2C47.59%2C-18.83&layer=mapnik&marker=-18.8792%2C47.5079",
    linkUrl:
      "https://www.google.com/maps/search/?api=1&query=Antananarivo+Centre+Madagascar",
  },
  {
    name: "Deuxième emplacement",
    embedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=47.49%2C-18.98%2C47.61%2C-18.86&layer=mapnik&marker=-18.9201%2C47.5459",
    linkUrl: "https://www.google.com/maps/search/?api=1&query=Antananarivo+Madagascar",
  },
];

export const contactFormOptions = [
  "Organisation des obsèques",
  "Rapatriement du corps",
  "Location espace veillée",
  "Service traiteur / cocktail",
  "Crémation",
  "Autre demande",
];
