// URLs des images hébergées sur Cloudflare R2 (bucket "tsaralevenana-images").
// Fichier isolé : à importer où nécessaire, sans dépendance sur les composants existants.

export const R2_BASE_URL =
  "https://pub-64919f93e7b1426dbd14328099e8e1c0.r2.dev";

export const imageFileNames = [
  "450A0129.webp",
  "450A0185.webp",
  "450A9810.webp",
  "450A9857.webp",
  "450A9885 (1).webp",
  "IMG_2217 (1).webp",
  "IMG_2217.webp",
  "_MG_1665_DxO (1).webp",
  "_MG_1676_DxO.webp",
  "_MG_1739_DxO.webp",
  "_MG_1797_DxO.webp",
  "_MG_1835_DxO.webp",
  "_MG_1931_DxO.webp",
] as const;

export type ImageFileName = (typeof imageFileNames)[number];

function toImageUrl(fileName: string): string {
  return `${R2_BASE_URL}/${encodeURIComponent(fileName)}`;
}

export const images = {
  "450A0129": toImageUrl("450A0129.webp"),
  "450A0185": toImageUrl("450A0185.webp"),
  "450A9810": toImageUrl("450A9810.webp"),
  "450A9857": toImageUrl("450A9857.webp"),
  "450A9885_1": toImageUrl("450A9885 (1).webp"),
  IMG_2217_1: toImageUrl("IMG_2217 (1).webp"),
  IMG_2217: toImageUrl("IMG_2217.webp"),
  MG_1665_DxO_1: toImageUrl("_MG_1665_DxO (1).webp"),
  MG_1676_DxO: toImageUrl("_MG_1676_DxO.webp"),
  MG_1739_DxO: toImageUrl("_MG_1739_DxO.webp"),
  MG_1797_DxO: toImageUrl("_MG_1797_DxO.webp"),
  MG_1835_DxO: toImageUrl("_MG_1835_DxO.webp"),
  MG_1931_DxO: toImageUrl("_MG_1931_DxO.webp"),
} as const;

export const imageUrls: string[] = imageFileNames.map(toImageUrl);

// Logo du site : asset local servi depuis /public (pas hébergé sur R2).
export const logoUrl = "/logo.webp";
