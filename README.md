# Maison Funéraire Tsaralevenana — Next.js

Site converti depuis le gabarit HTML original vers **Next.js (App Router,
TypeScript, CSS Modules)**, avec un composant clair par section.

## Structure

```
app/
  layout.tsx        Polices (Cormorant Garamond, Jost) + metadata
  page.tsx           Assemble toutes les sections dans l'ordre
  globals.css        Variables de couleurs / typographie communes

components/
  Navbar.tsx          Barre de navigation fixe
  Hero.tsx            Section d'accueil (titre + slogan + CTA)
  About.tsx           "Qui sommes-nous" (À propos)
  Services.tsx        Grille des 6 prestations
    ServiceCard.tsx    Une carte de prestation
    ServiceIcon.tsx    Icônes SVG des prestations
  Process.tsx          "Notre processus" (4 étapes)
  Gallery.tsx          Galerie photos (grille)
  Faq.tsx              Accordéon de questions fréquentes (client)
  Locations.tsx        Cartes des emplacements
  Contact.tsx          Formulaire de contact (client)
  MapSection.tsx        Carte interactive + bouton de bascule (client)
  Footer.tsx           Pied de page
  FloralSprig.tsx       Icône florale décorative réutilisée partout
  SectionDivider.tsx    Séparateur décoratif entre sections
  PhotoFrame.tsx        Cadre photo réutilisable (image ou placeholder)

lib/
  data.ts             Tout le contenu texte (services, FAQ, emplacements...)
```

## Démarrage

```bash
npm install
npm run dev
```

## Photos

Les emplacements d'images utilisent le composant `PhotoFrame`. Pour
ajouter une vraie photo, passez une prop `src` :

```tsx
<PhotoFrame src="/images/equipe.jpg" alt="Notre équipe" />
```

Placez vos fichiers dans `public/images/`.

## Formulaire de contact

Le formulaire (`components/Contact.tsx`) gère l'état côté client mais
n'envoie encore rien vers un serveur. Ajoutez une route API dans
`app/api/contact/route.ts` et appelez-la dans `handleSubmit`.
