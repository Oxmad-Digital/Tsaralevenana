"use client";

import { useState } from "react";
import { images } from "@/lib/images";
import PhotoFrame from "./PhotoFrame";
import styles from "./Gallery.module.css";

const extraPhotos = [
  {
    src: images.tableTraiteur,
    key: "tableTraiteur",
    alt: "Table du service traiteur avec boissons pour les invités",
  },
  {
    src: images.personnelPreparation,
    key: "personnelPreparation",
    alt: "Personnel de Tsaralevenana préparant la table de cérémonie",
  },
];

export default function Gallery() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section id="galerie" className={styles.gallery}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="eyebrow">En images</p>
          <h2 className="sectionTitle">Galerie photos</h2>
        </div>
        <div className={styles.grid}>
          <PhotoFrame
            src={images.facadeExterieure}
            alt="Façade extérieure de la Maison Funéraire Tsaralevenana à Antananarivo"
            className={styles.tall}
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          <PhotoFrame
            src={images.salleVeillee}
            alt="Salle de veillée avec sièges à la Maison Funéraire Tsaralevenana"
            className={styles.square}
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          <PhotoFrame
            src={images.salleCeremonie}
            alt="Intérieur de la salle de cérémonie avec éclairage d'ambiance"
            className={styles.square}
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          <PhotoFrame
            src={images.vehiculesFuneraires}
            alt="Véhicules de transport funéraire de Tsaralevenana"
            className={styles.square}
            sizes="(max-width: 640px) 50vw, 25vw"
          />
          <PhotoFrame
            src={images.tenteReception}
            alt="Espace traiteur sous tente avec tables dressées pour la réception"
            className={styles.wide}
            sizes="(max-width: 640px) 50vw, 50vw"
          />
          {showMore &&
            extraPhotos.map((photo) => (
              <PhotoFrame
                key={photo.key}
                src={photo.src}
                alt={photo.alt}
                className={styles.square}
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            ))}
          <button
            type="button"
            onClick={() => setShowMore((prev) => !prev)}
            className={styles.more}
            aria-label={showMore ? "Voir moins de photos" : "Voir plus de photos"}
          >
            <span className={styles.morePlus}>{showMore ? "−" : "+"}</span>
            <span className={styles.moreLabel}>
              {showMore ? "Voir moins" : "Voir plus"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
