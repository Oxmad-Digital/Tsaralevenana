// URLs des images hébergées sur Cloudflare R2 (bucket "tsaralevenana-images").
// Fichier isolé : à importer où nécessaire, sans dépendance sur les composants existants.

export const R2_BASE_URL =
  "https://pub-64919f93e7b1426dbd14328099e8e1c0.r2.dev";

export const imageFileNames = [
  "Tsaralevenana-mise-en-biere.webp",
  "Tsaralevenana-facade-exterieure.webp",
  "Tsaralevenana-emplacement-1.webp",
  "Tsaralevenana-salle-veillee.webp",
  "Tsaralevenana-salle-ceremonie.webp",
  "Tsaralevenana-tente-reception.webp",
  "Tsaralevenana-vehicules-funeraires.webp",
  "Tsaralevenana-portrait-traditionnel.webp",
  "Tsaralevenana-emplacement-2.webp",
  "Tsaralevenana-table-traiteur.webp",
  "Tsaralevenana-personnel-preparation.webp",
  "Tsaralevenana-equipe.webp",
] as const;

export type ImageFileName = (typeof imageFileNames)[number];

function toImageUrl(fileName: string): string {
  return `${R2_BASE_URL}/${encodeURIComponent(fileName)}`;
}

export const images = {
  miseEnBiere: toImageUrl("Tsaralevenana-mise-en-biere.webp"),
  facadeExterieure: toImageUrl("Tsaralevenana-facade-exterieure.webp"),
  emplacement1: toImageUrl("Tsaralevenana-emplacement-1.webp"),
  salleVeillee: toImageUrl("Tsaralevenana-salle-veillee.webp"),
  salleCeremonie: toImageUrl("Tsaralevenana-salle-ceremonie.webp"),
  tenteReception: toImageUrl("Tsaralevenana-tente-reception.webp"),
  vehiculesFuneraires: toImageUrl("Tsaralevenana-vehicules-funeraires.webp"),
  portraitTraditionnel: toImageUrl("Tsaralevenana-portrait-traditionnel.webp"),
  emplacement2: toImageUrl("Tsaralevenana-emplacement-2.webp"),
  tableTraiteur: toImageUrl("Tsaralevenana-table-traiteur.webp"),
  personnelPreparation: toImageUrl("Tsaralevenana-personnel-preparation.webp"),
  equipe: toImageUrl("Tsaralevenana-equipe.webp"),
} as const;

export const imageUrls: string[] = imageFileNames.map(toImageUrl);

export const logoUrl = toImageUrl("Tsaralevenana-logo.webp");
export const heroUrl = toImageUrl("Tsaralevenana-hero-ciel-nuages.webp");
